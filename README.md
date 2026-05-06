# 큐기출 (qgichul)

AI 기반 자격증 CBT 학습 추천 서비스. 3-tier 구조 (frontend / backend / ai server) + MySQL(TiDB Cloud).

> 상세 명세는 `guide/_큐기출_팀협업_A_to_Z_가이드_v2.md`,
> 단계별 개선 작업은 `guide/개선_가이드라인.md` 참고.

---

## 1. 빠른 시작 (Docker)

### 1-1. `.env` 작성

```bash
cp .env.example .env
# .env 안의 빈 값을 채운다 (DB, JWT, OPENAI, CORS 등)
```

JWT 시크릿은 64자 이상 랜덤으로 새로 만든다:
```bash
openssl rand -base64 64
```

### 1-2. 빌드 & 기동

```bash
docker compose build
docker compose up -d
docker compose logs -f
```

확인:
- 프론트: http://localhost:3000
- 백엔드 헬스: http://localhost:8080/actuator/health
- AI Swagger: http://localhost:8000/docs

종료:
```bash
docker compose down
```

---

## 2. 로컬 개발 (Docker 없이)

### 2-1. 백엔드

```bash
cd qgichul-backend
# application-local.properties 의 DB/JWT 값을 채운다 (.gitignore 처리됨)
./gradlew bootRun
```

`spring.profiles.active=local` 이 기본이므로 `application-local.properties` 가 자동 로드된다.

### 2-2. AI 서버

```bash
cd qgichul-ai
cp .env.example .env       # OPENAI_API_KEY 입력
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2-3. 프론트엔드

```bash
cd qgichul-frontend
cp .env.example .env.local   # VITE_API_BASE_URL 확인
npm install
npm run dev
```

---

## 3. 운영 배포 (EC2 + docker-compose)

`guide/개선_가이드라인.md` P5 섹션 참고. 요약:

1. EC2 Ubuntu 22.04 t3.small 띄우기 (보안그룹: 22/내IP, 80/443 공개, 8000·8080 비공개)
2. Docker + Compose 설치
3. `git clone` → `.env` 작성 → `docker compose up -d --build`
4. 도메인 + nginx + Certbot 으로 HTTPS

---

## 4. 디렉터리

```
qgichul/
├── qgichul-frontend/   # React 19 + Vite 8 + Recharts
│   ├── Dockerfile      # build → nginx
│   └── nginx.conf
├── qgichul-backend/    # Spring Boot 3 + JPA + JWT
│   └── Dockerfile      # gradle build → JRE 17
├── qgichul-ai/         # FastAPI + OpenAI GPT-4o
│   └── Dockerfile      # python:3.11-slim
├── docker-compose.yml  # 3-tier orchestration
├── .env.example
└── guide/              # 협업/개선 가이드 문서
```

---

## 5. 운영 체크리스트

- [ ] `.env` 는 EC2 디스크에만, 절대 git 커밋 금지
- [ ] OpenAI 사용량 한도 알림 설정
- [ ] TiDB Cloud → IP Access List 에 EC2 Public IP 등록
- [ ] CORS_ALLOWED_ORIGINS 운영 도메인으로 제한
- [ ] HTTPS 적용 후 `VITE_API_BASE_URL` = 운영 API 주소
- [ ] `docker compose logs --tail=200` 로 모니터링 (CloudWatch/Sentry 연동 권장)
- [ ] JWT 시크릿 분기마다 회전 정책
- [ ] OpenAI API 키 노출 시 즉시 Revoke → Re-issue
