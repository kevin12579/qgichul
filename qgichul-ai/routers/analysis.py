"""
취약 단원 분석
사용자 오답 데이터 → GPT → 취약 단원·오류 패턴·학습 우선순위
"""

import json
from fastapi import APIRouter, HTTPException
from models.schemas import AnalysisRequest, AnalysisResponse, WeakUnit
from prompts.templates import ANALYSIS_SYSTEM, ANALYSIS_USER
from utils.openai_client import chat_json

router = APIRouter()


@router.post("/analysis", response_model=AnalysisResponse, summary="취약 단원 분석")
async def analyze_weak_units(req: AnalysisRequest):
    """
    사용자의 오답 목록을 분석해 취약 단원, 오류 패턴, 학습 우선순위를 반환합니다.
    오답 노트 화면에서 'AI 분석 요청' 버튼 클릭 시 Spring Boot → FastAPI 순서로 호출됩니다.
    """
    if not req.wrong_answers:
        raise HTTPException(status_code=400, detail="오답 데이터가 없습니다.")

    # 오답 데이터를 GPT에 전달할 형식으로 직렬화
    wrong_json = json.dumps(
        [
            {
                "question_id":   wa.question_id,
                "unit":          wa.unit,
                "subject":       wa.subject_name,
                "question":      wa.content,
                "correct":       wa.correct_answer,
                "user_selected": wa.selected_answer,
            }
            for wa in req.wrong_answers
        ],
        ensure_ascii=False,
        indent=2,
    )

    user_prompt = ANALYSIS_USER.format(wrong_answers_json=wrong_json)

    try:
        data = await chat_json(ANALYSIS_SYSTEM, user_prompt, temperature=0.3)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 호출 실패: {str(e)}")

    weak_units = [WeakUnit(**u) for u in data.get("weak_units", [])]

    return AnalysisResponse(
        user_id=req.user_id,
        weak_units=weak_units,
        overall_feedback=data.get("overall_feedback", ""),
        study_priority=data.get("study_priority", []),
    )