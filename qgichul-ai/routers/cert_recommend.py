"""
자격증 추천 (Nice to have)
사용자의 강점·약점 과목 → GPT → 적합 자격증 + 학습 경로 + 진로 제안
"""

from fastapi import APIRouter, HTTPException

from models.schemas import (
    CertRecommendRequest,
    CertRecommendResponse,
    RecommendedCertification,
)
from prompts.templates import CERT_RECOMMEND_SYSTEM, CERT_RECOMMEND_USER
from utils.openai_client import chat_json

router = APIRouter()


@router.post(
    "/recommend/certifications",
    response_model=CertRecommendResponse,
    summary="자격증 추천 (강·약점 기반)",
)
async def recommend_certifications(req: CertRecommendRequest):
    """
    사용자의 강점·약점 과목을 분석해 적합한 자격증, 학습 경로, 진로 방향을 제안합니다.
    """
    if not req.available_certifications:
        raise HTTPException(status_code=400, detail="추천 가능한 자격증 목록이 비어 있습니다.")

    user_prompt = CERT_RECOMMEND_USER.format(
        strong_subjects=", ".join(req.strong_subjects) or "없음",
        weak_subjects=", ".join(req.weak_subjects) or "없음",
        certifications="\n".join(f"- {c}" for c in req.available_certifications),
    )

    try:
        data = await chat_json(CERT_RECOMMEND_SYSTEM, user_prompt, temperature=0.5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 호출 실패: {str(e)}")

    recommendations = [
        RecommendedCertification(**c) for c in data.get("recommendations", [])
    ]
    recommendations.sort(key=lambda x: x.priority)

    return CertRecommendResponse(
        user_id=req.user_id,
        recommendations=recommendations,
        learning_path=data.get("learning_path", []),
        career_suggestions=data.get("career_suggestions", []),
    )
