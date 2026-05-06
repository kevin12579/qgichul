"""
AI 문제 생성 (반복학습)
취약 단원의 원본 오답 문제 → GPT → 유사 문제 N개 생성
"""

from fastapi import APIRouter, HTTPException
from models.schemas import GenerateRequest, GenerateResponse, GeneratedQuestion
from prompts.templates import GENERATE_SYSTEM, GENERATE_USER
from utils.openai_client import chat_json

router = APIRouter()


@router.post("/generate-questions", response_model=GenerateResponse, summary="AI 유사 문제 생성")
async def generate_questions(req: GenerateRequest):
    """
    오답 문제 1개를 기반으로 같은 개념의 유사 문제를 AI가 생성합니다.
    생성된 문제는 Spring Boot가 받아 ai_generated_questions 테이블에 저장합니다.

    - count: 생성할 문제 수 (기본 3, 최대 5)
    """
    count = min(req.count, 5)  # 최대 5개 제한

    choice_map = {c.choice_num: c.content for c in req.original_choices}

    user_prompt = GENERATE_USER.format(
        unit=req.unit,
        subject_name=req.subject_name,
        count=count,
        original_content=req.original_content,
        choice_1=choice_map.get(1, ""),
        choice_2=choice_map.get(2, ""),
        choice_3=choice_map.get(3, ""),
        choice_4=choice_map.get(4, ""),
        correct_answer=req.correct_answer,
        explanation=req.explanation or "해설 없음",
    )

    try:
        data = await chat_json(GENERATE_SYSTEM, user_prompt, temperature=0.8)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 호출 실패: {str(e)}")

    raw_questions = data.get("questions", [])
    if not raw_questions:
        raise HTTPException(status_code=500, detail="문제 생성에 실패했습니다. 다시 시도해주세요.")

    generated = [
        GeneratedQuestion(
            source_question_id=req.source_question_id,
            unit=req.unit,
            content=q["content"],
            choice_1=q["choice_1"],
            choice_2=q["choice_2"],
            choice_3=q["choice_3"],
            choice_4=q["choice_4"],
            correct_answer=q["correct_answer"],
            explanation=q["explanation"],
        )
        for q in raw_questions[:count]
    ]

    return GenerateResponse(
        user_id=req.user_id,
        generated_questions=generated,
    )


@router.post("/generate-from-unit", response_model=GenerateResponse, summary="단원명으로 문제 생성")
async def generate_from_unit(
    user_id: int,
    unit: str,
    subject_name: str,
    count: int = 3,
):
    """
    원본 문제 없이 단원명만으로 새 문제를 생성합니다.
    취약 단원 분석 후 즉시 연습 문제가 필요할 때 사용합니다.
    """
    count = min(count, 5)

    system = GENERATE_SYSTEM
    user_prompt = f"""
단원: {unit}
과목: {subject_name}
생성할 문제 수: {count}개

원본 문제 없이 해당 단원의 핵심 개념을 묻는 객관식 문제 {count}개를 생성해주세요.
난이도는 중간 수준으로, 실제 자격증 시험과 유사하게 작성해주세요.
"""

    try:
        data = await chat_json(system, user_prompt, temperature=0.8)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 호출 실패: {str(e)}")

    raw_questions = data.get("questions", [])
    if not raw_questions:
        raise HTTPException(status_code=500, detail="문제 생성에 실패했습니다.")

    generated = [
        GeneratedQuestion(
            source_question_id=0,   # 원본 없음
            unit=unit,
            content=q["content"],
            choice_1=q["choice_1"],
            choice_2=q["choice_2"],
            choice_3=q["choice_3"],
            choice_4=q["choice_4"],
            correct_answer=q["correct_answer"],
            explanation=q["explanation"],
        )
        for q in raw_questions[:count]
    ]

    return GenerateResponse(user_id=user_id, generated_questions=generated)