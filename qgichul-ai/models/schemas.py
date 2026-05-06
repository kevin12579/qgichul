from pydantic import BaseModel
from typing import Optional


# ─────────────────────────────────────────
# 공통
# ─────────────────────────────────────────
class ChoiceItem(BaseModel):
    choice_num: int          # 1~4
    content: str


# ─────────────────────────────────────────
# PDF 파싱
# ─────────────────────────────────────────
class ParsedQuestion(BaseModel):
    question_num: int
    content: str
    choices: list[ChoiceItem]
    correct_answer: int
    explanation: Optional[str] = None
    unit: Optional[str] = None
    difficulty: int = 2       # 기본값: 중


class ParsedSubject(BaseModel):
    name: str
    order_num: int
    questions: list[ParsedQuestion]


class ParsedExam(BaseModel):
    certification_name: str
    title: str
    year: int
    session: int
    duration_min: int
    subjects: list[ParsedSubject]


# ─────────────────────────────────────────
# 홈 추천
# ─────────────────────────────────────────
class HomeRecommendRequest(BaseModel):
    user_id: int
    major: Optional[str] = None          # 전공 (고졸이면 null)
    education_level: str                 # HIGH_SCHOOL / COLLEGE_2_3 / COLLEGE_4 / GRADUATE
    available_certifications: list[str]  # DB에 있는 자격증 이름 목록


class RecommendedCertification(BaseModel):
    name: str
    reason: str
    priority: int   # 1=가장 추천


class HomeRecommendResponse(BaseModel):
    user_id: int
    recommended_certifications: list[RecommendedCertification]
    recommended_exam_ids: list[int]      # 프론트에서 문제 카드 표시용
    ai_message: str                      # 메인 홈에 표시할 AI 한마디


# ─────────────────────────────────────────
# 취약 단원 분석
# ─────────────────────────────────────────
class WrongAnswerItem(BaseModel):
    question_id: int
    unit: str
    subject_name: str
    content: str
    correct_answer: int
    selected_answer: int


class AnalysisRequest(BaseModel):
    user_id: int
    wrong_answers: list[WrongAnswerItem]


class WeakUnit(BaseModel):
    unit: str
    subject_name: str
    wrong_count: int
    error_pattern: str          # "계산 실수" / "개념 미이해" / "유형 혼동" 등
    improvement_tip: str


class AnalysisResponse(BaseModel):
    user_id: int
    weak_units: list[WeakUnit]
    overall_feedback: str
    study_priority: list[str]   # 학습 우선순위 단원 순서


# ─────────────────────────────────────────
# AI 문제 생성
# ─────────────────────────────────────────
class GenerateRequest(BaseModel):
    user_id: int
    source_question_id: int
    unit: str
    subject_name: str
    original_content: str
    original_choices: list[ChoiceItem]
    correct_answer: int
    explanation: Optional[str] = None
    count: int = 3              # 생성할 문제 수


class GeneratedQuestion(BaseModel):
    source_question_id: int
    unit: str
    content: str
    choice_1: str
    choice_2: str
    choice_3: str
    choice_4: str
    correct_answer: int
    explanation: str


class GenerateResponse(BaseModel):
    user_id: int
    generated_questions: list[GeneratedQuestion]


# ─────────────────────────────────────────
# 자격증 추천 (Nice to have)
# ─────────────────────────────────────────
class CertRecommendRequest(BaseModel):
    user_id: int
    strong_subjects: list[str]
    weak_subjects: list[str]
    available_certifications: list[str]


class CertRecommendResponse(BaseModel):
    user_id: int
    recommendations: list[RecommendedCertification]
    learning_path: list[str]
    career_suggestions: list[str]