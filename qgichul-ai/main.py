from dotenv import load_dotenv
load_dotenv()  # 라우터 import 전에 환경변수 로드

import logging
import os
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    analysis,
    cert_recommend,
    home_recommend,
    pdf_parser,
    question_generator,
    roadmap,
)

# ─────────────────────────────────────────────────────────
# 로깅 설정
# ─────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("qgichul-ai")

# ─────────────────────────────────────────────────────────
# FastAPI app
# ─────────────────────────────────────────────────────────
app = FastAPI(
    title="큐기출 AI 서버",
    description="AI 기반 자격증 CBT 학습 추천 서비스 - FastAPI AI Server",
    version="1.0.0",
)

allowed_origins_env = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:8080",
)
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    elapsed_ms = (time.time() - start) * 1000
    logger.info(
        "%s %s -> %d (%.1fms)",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    return response


# ─────────────────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────────────────
app.include_router(pdf_parser.router,         prefix="/api/pdf", tags=["PDF 파싱"])
app.include_router(home_recommend.router,     prefix="/api/ai",  tags=["홈 추천"])
app.include_router(analysis.router,           prefix="/api/ai",  tags=["취약 단원 분석"])
app.include_router(question_generator.router, prefix="/api/ai",  tags=["AI 문제 생성"])
app.include_router(cert_recommend.router,     prefix="/api/ai",  tags=["자격증 추천"])
app.include_router(roadmap.router,            prefix="/api/ai",  tags=["학습 로드맵"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "큐기출 AI 서버"}
