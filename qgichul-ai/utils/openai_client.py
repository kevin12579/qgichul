import os
import json
import logging
import traceback
import httpx
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

def _get_client() -> AsyncOpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return AsyncOpenAI(
        api_key=api_key,
        http_client=httpx.AsyncClient(
            timeout=httpx.Timeout(60.0),
        ),
    )


async def chat(system: str, user: str, temperature: float = 0.7) -> str:
    client = _get_client()
    try:
        response = await client.chat.completions.create(
            model=MODEL,
            temperature=temperature,
            messages=[
                {"role": "system", "content": system},
                {"role": "user",   "content": user},
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error("chat() error: %s\n%s", type(e).__name__, traceback.format_exc())
        raise


async def chat_json(system: str, user: str, temperature: float = 0.3) -> dict | list:
    client = _get_client()
    try:
        response = await client.chat.completions.create(
            model=MODEL,
            temperature=temperature,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system + "\n\nRespond in JSON format only."},
                {"role": "user",   "content": user},
            ],
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except UnicodeEncodeError as e:
        logger.error(
            "Header encoding failed — value=%r  start=%d  end=%d",
            e.object, e.start, e.end,
        )
        raise
    except Exception as e:
        logger.error("chat_json() error: %s\n%s", type(e).__name__, traceback.format_exc())
        raise