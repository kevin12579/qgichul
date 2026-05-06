"""
전공 기반 홈 추천
사용자 학력·전공 → GPT → 맞춤 자격증 추천
"""

from fastapi import APIRouter, HTTPException
from models.schemas import HomeRecommendRequest, HomeRecommendResponse, RecommendedCertification
from prompts.templates import HOME_RECOMMEND_SYSTEM, HOME_RECOMMEND_USER
from utils.openai_client import chat_json

router = APIRouter()

# 학력 코드 → 한국어
EDUCATION_MAP = {
    "HIGH_SCHOOL":  "고졸",
    "COLLEGE_2_3":  "2·3년제 대학 재학/졸업",
    "COLLEGE_4":    "4년제 대학 재학/졸업",
    "GRADUATE":     "대학원 이상",
}


@router.post("/home-recommend", response_model=HomeRecommendResponse, summary="전공 기반 홈 추천")
async def home_recommend(req: HomeRecommendRequest):
    """
    회원가입 시 입력한 학력·전공을 기반으로 메인 홈에 표시할 맞춤 자격증을 추천합니다.
    Spring Boot 백엔드가 사용자 정보 + 자격증 목록을 조합해 이 엔드포인트를 호출합니다.
    """
    education_label = EDUCATION_MAP.get(req.education_level, req.education_level)
    major_label     = req.major if req.major else "전공 없음 (고졸)"
    certs_str       = "\n".join(f"- {c}" for c in req.available_certifications)

    user_prompt = HOME_RECOMMEND_USER.format(
        education_level=education_label,
        major=major_label,
        certifications=certs_str,
    )

    try:
        data = await chat_json(HOME_RECOMMEND_SYSTEM, user_prompt, temperature=0.5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 호출 실패: {str(e)}")

    # 응답 파싱
    cert_list = [
        RecommendedCertification(**c)
        for c in data.get("recommended_certifications", [])
    ]
    cert_list.sort(key=lambda x: x.priority)

    return HomeRecommendResponse(
        user_id=req.user_id,
        recommended_certifications=cert_list,
        recommended_exam_ids=data.get("recommended_exam_ids", []),
        ai_message=data.get("ai_message", "오늘도 열심히 학습해보세요!"),
    )