"""
학습 로드맵 추천 (Nice to have)
목표 자격증 + 시험 일자 → GPT → 주차별 학습 계획
"""

from datetime import date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from utils.openai_client import chat_json

router = APIRouter()


class RoadmapRequest(BaseModel):
    user_id: int
    cert_name: str          # 자격증 이름
    target_date: str        # ISO date (YYYY-MM-DD)
    weekly_hours: int = 10  # 주당 학습 시간


class RoadmapStep(BaseModel):
    week: int
    topic: str
    goal: str
    estimated_hours: int


class RoadmapResponse(BaseModel):
    user_id: int
    cert_name: str
    total_weeks: int
    steps: List[RoadmapStep]
    final_advice: str


SYSTEM_PROMPT = """
당신은 자격증 학습 코치입니다.
주어진 자격증과 시험일까지 남은 기간을 바탕으로 주차별 학습 계획을 작성하세요.

응답은 반드시 아래 JSON 형식으로만:
{
  "total_weeks": 8,
  "steps": [
    {"week": 1, "topic": "주제", "goal": "이번 주 목표", "estimated_hours": 10}
  ],
  "final_advice": "마지막 한마디"
}

규칙:
- 시험 직전 1주는 모의고사·복습 위주로 배정
- topic은 실제 출제 단원 기준으로 작성
- estimated_hours 합은 weekly_hours × total_weeks 와 비슷하게
"""


@router.post("/recommend/roadmap", response_model=RoadmapResponse, summary="학습 로드맵 추천")
async def recommend_roadmap(req: RoadmapRequest):
    try:
        target = date.fromisoformat(req.target_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="target_date는 YYYY-MM-DD 형식이어야 합니다.")

    days_left = (target - date.today()).days
    if days_left <= 0:
        raise HTTPException(status_code=400, detail="시험일이 이미 지났습니다.")

    weeks = max(1, days_left // 7)

    user_prompt = (
        f"자격증: {req.cert_name}\n"
        f"시험일까지: {days_left}일 ({weeks}주)\n"
        f"주당 학습 가능 시간: {req.weekly_hours}시간\n\n"
        f"위 조건으로 주차별 학습 계획을 작성해주세요."
    )

    try:
        data = await chat_json(SYSTEM_PROMPT, user_prompt, temperature=0.4)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 호출 실패: {str(e)}")

    steps = [RoadmapStep(**s) for s in data.get("steps", [])]

    return RoadmapResponse(
        user_id=req.user_id,
        cert_name=req.cert_name,
        total_weeks=data.get("total_weeks", weeks),
        steps=steps,
        final_advice=data.get("final_advice", ""),
    )
