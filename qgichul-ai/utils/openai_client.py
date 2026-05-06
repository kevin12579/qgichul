import os
import json
from openai import AsyncOpenAI

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

def _get_client() -> AsyncOpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.")
    return AsyncOpenAI(api_key=api_key)


async def chat(system: str, user: str, temperature: float = 0.7) -> str:
    """단순 텍스트 응답"""
    client = _get_client()
    response = await client.chat.completions.create(
        model=MODEL,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
    )
    return response.choices[0].message.content.strip()


async def chat_json(system: str, user: str, temperature: float = 0.3) -> dict | list:
    """JSON 응답 강제 (response_format=json_object)"""
    client = _get_client()
    response = await client.chat.completions.create(
        model=MODEL,
        temperature=temperature,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system + "\n\n반드시 JSON 형식으로만 응답하세요."},
            {"role": "user",   "content": user},
        ],
    )
    raw = response.choices[0].message.content.strip()
    return json.loads(raw)