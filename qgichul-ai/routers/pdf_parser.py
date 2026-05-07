"""
PDF 파싱 파이프라인
comcbt.com 에서 다운로드한 PDF를 파싱해 구조화된 데이터로 반환합니다.
Spring Boot 백엔드가 이 결과를 받아 DB에 저장합니다.

PDF 형식 가정 (comcbt.com 산업기사/기사 시리즈):
  - 2단(좌/우) 컬럼 레이아웃 → 컬럼별 crop 후 좌→우 순서로 텍스트 합침
  - 과목 헤더: "1과목 : 데이터 베이스"
  - 문제 시작: "1.", "2.", ...
  - 보기:      ① ② ③ ④ (오답)  /  ❶ ❷ ❸ ❹ (정답, 교사용에만 표시)
  - 해설:      별도 해설집 PDF의 "<문제 해설>" 블록

사용법:
  pdfs/ 폴더에 다음을 넣어주세요:
    {자격증명}_{연도}_{회차}.pdf        ← 교사용 (필수, 정답 포함)
    {자격증명}_{연도}_{회차}_해설.pdf   ← 해설집 (선택, 해설 머지용)
  예:  정보처리산업기사_2020_3.pdf  +  정보처리산업기사_2020_3_해설.pdf
"""

import os
import re
import io
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import ParsedExam, ParsedSubject, ParsedQuestion, ChoiceItem

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

router = APIRouter()


# ─────────────────────────────────────────────────────────
# 상수
# ─────────────────────────────────────────────────────────
CIRCLE_NUMBERS = {"①": 1, "②": 2, "③": 3, "④": 4}
ANSWER_NUMBERS = {"❶": 1, "❷": 2, "❸": 3, "❹": 4}  # 교사용에서 정답 표시
ALL_CHOICE_CHARS = "①②③④❶❷❸❹"


# ─────────────────────────────────────────────────────────
# 엔드포인트
# ─────────────────────────────────────────────────────────

@router.post("/parse", response_model=ParsedExam, summary="PDF 파싱 (교사용 + 선택적 해설집)")
async def parse_pdf(
    file: UploadFile = File(..., description="교사용 PDF (정답 포함)"),
    explanation_file: UploadFile | None = File(None, description="해설집 PDF (선택)"),
    certification_name: str = "정보처리기사",
    year: int = 2024,
    session: int = 1,
    duration_min: int = 150,
):
    """교사용 PDF를 업로드해 문제·보기·정답을 파싱합니다. 해설집 PDF가 함께 오면 해설을 머지합니다."""
    if pdfplumber is None:
        raise HTTPException(status_code=500, detail="pdfplumber 패키지가 설치되지 않았습니다. pip install pdfplumber")

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="PDF 파일만 업로드 가능합니다.")

    main_bytes = await file.read()
    expl_map: dict[int, str] = {}
    if explanation_file is not None:
        expl_bytes = await explanation_file.read()
        expl_map = _parse_explanations(expl_bytes)

    subjects = _parse_main_pdf(main_bytes, expl_map)

    return ParsedExam(
        certification_name=certification_name,
        title=f"{year}년 {session}회",
        year=year,
        session=session,
        duration_min=duration_min,
        subjects=subjects,
    )


@router.post("/parse-folder", response_model=list[ParsedExam], summary="폴더 일괄 PDF 파싱")
async def parse_pdf_folder(folder: str = "pdfs"):
    """
    AI 서버의 `folder` 안의 PDF를 일괄 파싱합니다.

    파일명 규칙:
      {자격증명}_{연도}_{회차}.pdf        ← 교사용 (필수, 정답 포함)
      {자격증명}_{연도}_{회차}_해설.pdf   ← 해설집 (선택)

    예:
      정보처리산업기사_2020_3.pdf
      정보처리산업기사_2020_3_해설.pdf
    """
    if pdfplumber is None:
        raise HTTPException(status_code=500, detail="pdfplumber 패키지가 설치되지 않았습니다.")

    base = Path(folder)
    if not base.is_absolute():
        base = Path(__file__).resolve().parent.parent / folder

    if not base.exists() or not base.is_dir():
        raise HTTPException(status_code=400, detail=f"폴더를 찾을 수 없습니다: {base}")

    # 메인 PDF (교사용)와 해설 PDF를 짝지어 처리
    results: list[ParsedExam] = []
    for pdf_path in sorted(base.glob("*.pdf")):
        if pdf_path.stem.endswith("_해설"):
            continue  # 해설집은 메인이 아님

        meta = _parse_filename(pdf_path.name)
        if meta is None:
            continue
        cert_name, year, session = meta

        expl_path = pdf_path.with_name(f"{pdf_path.stem}_해설.pdf")
        expl_map: dict[int, str] = {}
        if expl_path.exists():
            try:
                expl_map = _parse_explanations(expl_path.read_bytes())
            except Exception:
                expl_map = {}

        try:
            subjects = _parse_main_pdf(pdf_path.read_bytes(), expl_map)
            if not subjects:
                continue
            results.append(ParsedExam(
                certification_name=cert_name,
                title=f"{year}년 {session}회",
                year=year,
                session=session,
                duration_min=150,
                subjects=subjects,
            ))
        except Exception:
            continue

    return results


@router.post("/import", summary="폴더 내 PDF 파싱 후 백엔드 DB로 저장")
async def import_pdfs_to_db(folder: str = "pdfs"):
    """
    `folder`의 PDF를 파싱하고 곧바로 Spring Boot 백엔드에 저장합니다.
    내부적으로 백엔드의 `/api/admin/import-pdfs`를 호출합니다 (백엔드가 다시 본 서버의
    `/parse-folder`를 호출하는 구조이므로 트리거 역할).

    백엔드 URL은 `BACKEND_URL` 환경변수로 지정하세요. (기본값: http://backend:8080)
    """
    import httpx

    backend_url = os.getenv("BACKEND_URL", "http://backend:8080").rstrip("/")
    async with httpx.AsyncClient(timeout=120) as client:
        try:
            resp = await client.post(
                f"{backend_url}/api/admin/import-pdfs",
                params={"folder": folder},
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"백엔드에 연결 실패: {e}")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


def _parse_filename(name: str):
    """`{자격증명}_{연도}_{회차}.pdf`에서 메타정보 추출."""
    stem = Path(name).stem
    parts = stem.rsplit("_", 2)
    if len(parts) != 3:
        return None
    cert_name, year_str, session_str = parts
    try:
        return cert_name, int(year_str), int(session_str)
    except ValueError:
        return None


# ─────────────────────────────────────────────────────────
# 텍스트 추출 (2단 컬럼 분리)
# ─────────────────────────────────────────────────────────

def _extract_text_columns(raw_bytes: bytes) -> str:
    """
    각 페이지를 좌/우 절반으로 잘라 좌→우 순으로 텍스트를 합칩니다.
    comcbt PDF는 2단 레이아웃이라 일반 extract_text()로는 좌·우 행이 섞여 나옵니다.
    상하 5% 마진은 헤더/푸터 워터마크라 잘라냅니다.
    """
    out: list[str] = []
    with pdfplumber.open(io.BytesIO(raw_bytes)) as pdf:
        for page in pdf.pages:
            w, h = page.width, page.height
            top, bot = h * 0.05, h * 0.95
            mid = w / 2
            left = page.crop((0, top, mid, bot)).extract_text() or ""
            right = page.crop((mid, top, w, bot)).extract_text() or ""
            out.append(left)
            out.append(right)
    return "\n".join(out)


# ─────────────────────────────────────────────────────────
# 메인 PDF 파싱 (교사용)
# ─────────────────────────────────────────────────────────

SUBJECT_RE = re.compile(r'(\d+)\s*과목\s*[:：]\s*([^\n]+)')
QUESTION_RE = re.compile(
    r'(?:^|\n)\s*(\d{1,3})\.\s+(.+?)(?=(?:\n\s*\d{1,3}\.\s+)|\Z)',
    re.DOTALL,
)


def _parse_main_pdf(raw_bytes: bytes, expl_map: dict[int, str]) -> list[ParsedSubject]:
    """교사용 PDF → 과목·문제·정답 추출, 해설 머지."""
    text = _extract_text_columns(raw_bytes)
    text = _strip_footers(text)

    subject_matches = list(SUBJECT_RE.finditer(text))
    if not subject_matches:
        questions = _parse_questions(text, expl_map)
        return [ParsedSubject(name="전체", order_num=1, questions=questions)] if questions else []

    subjects: list[ParsedSubject] = []
    for i, m in enumerate(subject_matches):
        order = int(m.group(1))
        name = m.group(2).strip()
        start = m.end()
        end = subject_matches[i + 1].start() if i + 1 < len(subject_matches) else len(text)
        chunk = text[start:end]
        questions = _parse_questions(chunk, expl_map)
        if questions:
            subjects.append(ParsedSubject(name=name, order_num=order, questions=questions))
    return subjects


def _strip_footers(text: str) -> str:
    """페이지 하단 워터마크/페이지번호 제거."""
    text = re.sub(r'최강 자격증 기출문제[^\n]*', '', text)
    text = re.sub(r'전자문제집 CBT[^\n]*', '', text)
    text = re.sub(r'기출문제 및 해설집 다운로드[^\n]*', '', text)
    text = re.sub(r'본 해설집은[^\n]*', '', text)
    text = re.sub(r'기출문제 해설은[^\n]*', '', text)
    text = re.sub(r'정보처리[^\n]*필기 기출문제[^\n]*', '', text)
    text = re.sub(r'^\s*\(\d+\)\s*$', '', text, flags=re.MULTILINE)
    return text


def _parse_questions(chunk: str, expl_map: dict[int, str]) -> list[ParsedQuestion]:
    """과목 chunk → 문제 리스트. q_num은 단조증가만 인정해 페이지번호·정답표 grid 오인을 차단."""
    questions: list[ParsedQuestion] = []
    last = 0
    for m in QUESTION_RE.finditer(chunk):
        q_num = int(m.group(1))
        if q_num <= last or q_num > 200:
            continue
        body = m.group(2)
        content, choices, correct = _parse_question_body(body)
        if not content:
            continue
        last = q_num
        questions.append(ParsedQuestion(
            question_num=q_num,
            content=content,
            choices=choices,
            correct_answer=correct,
            explanation=expl_map.get(q_num),
            unit=_extract_unit(body),
            difficulty=_estimate_difficulty(body),
        ))
    return questions


def _parse_question_body(body: str):
    """문제 body → (content, choices[], correct_answer)."""
    # 보기/정답 위치
    choice_positions: list[tuple[int, int]] = []  # (pos, choice_num)
    correct = 0
    for i, ch in enumerate(body):
        if ch in CIRCLE_NUMBERS:
            choice_positions.append((i, CIRCLE_NUMBERS[ch]))
        elif ch in ANSWER_NUMBERS:
            num = ANSWER_NUMBERS[ch]
            choice_positions.append((i, num))
            correct = num  # ❶❷❸❹는 정답 표시

    # 첫 보기 이전이 문제 본문
    if choice_positions:
        content = body[:choice_positions[0][0]].strip()
    else:
        content = body.strip()
    content = re.sub(r'\s+', ' ', content)

    # 보기 추출: 같은 번호가 여러 번 등장하면 마지막 것을 사용 (그림 문제 우측에 단독 보기 마커가 다시 나오는 경우 대비)
    # 단순히 순서대로 처음 4개만 잘라낸다
    choices: list[ChoiceItem] = []
    used_nums: set[int] = set()
    for idx, (pos, num) in enumerate(choice_positions):
        if num in used_nums:
            continue
        end = choice_positions[idx + 1][0] if idx + 1 < len(choice_positions) else len(body)
        raw = body[pos + 1:end].strip()
        raw = re.sub(r'\s+', ' ', raw)
        choices.append(ChoiceItem(choice_num=num, content=raw))
        used_nums.add(num)
        if len(choices) == 4:
            break

    choices.sort(key=lambda c: c.choice_num)

    # 그림 문제: 보기 텍스트가 모두 비어있으면 placeholder 삽입
    if choices and all(not c.content for c in choices):
        choices = [ChoiceItem(choice_num=c.choice_num, content="[그림 참조]") for c in choices]

    if correct == 0:
        correct = 1  # 정답 표시 누락 시 fallback

    return content, choices, correct


def _extract_unit(body: str) -> str:
    keywords = re.findall(r'【([^】]+)】|\[([^\]]+)\]', body)
    if keywords:
        return (keywords[0][0] or keywords[0][1]).strip()
    return "미분류"


def _estimate_difficulty(body: str) -> int:
    length = len(body)
    if length < 200:
        return 1
    if length < 400:
        return 2
    return 3


# ─────────────────────────────────────────────────────────
# 해설집 PDF 파싱
# ─────────────────────────────────────────────────────────

EXPL_HEADER_RE = re.compile(r'(?:^|\n)\s*(\d{1,3})\.\s+')
EXPL_MARKER_RE = re.compile(r'<\s*문제\s*해설\s*>')


def _parse_explanations(raw_bytes: bytes) -> dict[int, str]:
    """
    해설집 PDF → {question_num: explanation} 매핑.

    해설집은 본문이 다음 구조로 반복됩니다:
        N. 문제 본문
        ① ② ③ ④ 보기
        <문제 해설>
        해설 텍스트...
        [해설작성자 : ...]

    해설 본문 안에 "3. 일반 사용자도..." 처럼 숫자로 시작하는 줄이 있을 수 있어
    문제 헤더 정규식 매치만으로는 잘못 잘릴 수 있습니다.
    따라서 `<문제 해설>` 마커마다 그 직전에 등장한 가장 가까운 문제 헤더의 번호에
    매핑합니다.
    """
    text = _extract_text_columns(raw_bytes)
    text = _strip_footers(text)

    # 해설 본문 안의 "3. ..." 같은 가짜 헤더는 prev+1 규칙으로 거른다
    # (시험 문제는 1→2→3→... 순서대로 빠짐없이 등장)
    raw_headers = [(m.start(), int(m.group(1))) for m in EXPL_HEADER_RE.finditer(text)]
    headers: list[tuple[int, int]] = []
    expected = 1
    for pos, num in raw_headers:
        if num == expected:
            headers.append((pos, num))
            expected = num + 1

    markers = [m.start() for m in EXPL_MARKER_RE.finditer(text)]
    if not headers or not markers:
        return {}

    expl_map: dict[int, str] = {}
    next_marker_pos = markers + [len(text)]

    for i, mpos in enumerate(markers):
        # 직전 진짜 헤더 번호
        owner = None
        for hpos, hnum in reversed(headers):
            if hpos < mpos:
                owner = hnum
                break
        if owner is None:
            continue
        end = next_marker_pos[i + 1]
        start = text.find(">", mpos) + 1
        body = text[start:end]
        # 본문 끝은 (다음 진짜 헤더) 또는 (다음 마커) 중 가까운 쪽
        for hpos, _ in headers:
            if hpos > mpos and hpos < end:
                body = text[start:hpos]
                break
        cleaned = re.sub(r'\n{2,}', '\n', body).strip()
        if cleaned and owner not in expl_map:
            expl_map[owner] = cleaned
    return expl_map


# ─────────────────────────────────────────────────────────
# URL로 파싱 (메인 + 선택적 해설집)
# ─────────────────────────────────────────────────────────

@router.post("/parse-url", response_model=ParsedExam, summary="URL로 PDF 파싱")
async def parse_pdf_from_url(
    pdf_url: str,
    explanation_url: str | None = None,
    certification_name: str = "정보처리기사",
    year: int = 2024,
    session: int = 1,
    duration_min: int = 150,
):
    """교사용 PDF URL을 전달하면 다운로드 후 파싱합니다. 해설집 URL이 있으면 머지합니다."""
    import httpx

    if pdfplumber is None:
        raise HTTPException(status_code=500, detail="pdfplumber 패키지가 설치되지 않았습니다.")

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(pdf_url)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail=f"PDF 다운로드 실패: {resp.status_code}")
        main_bytes = resp.content

        expl_map: dict[int, str] = {}
        if explanation_url:
            er = await client.get(explanation_url)
            if er.status_code == 200:
                expl_map = _parse_explanations(er.content)

    subjects = _parse_main_pdf(main_bytes, expl_map)

    return ParsedExam(
        certification_name=certification_name,
        title=f"{year}년 {session}회",
        year=year,
        session=session,
        duration_min=duration_min,
        subjects=subjects,
    )
