<div align="center">

# 큐기출 (Qgichul)

**AI 기반 자격증 CBT 학습 추천 서비스**

오답을 분석하고, 취약점을 파악하고, AI가 맞춤 문제를 생성해 드립니다.

---

<p align="center">
  <a href="https://github.com/kevin12579/qgichul/blob/main/docs/intro.pdf" target="_blank">
    <img src="https://img.shields.io/badge/PDF%20Presentation-프로젝트%20소개%20PPT%20보기-blue?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="QGICHUL PPT"/>
  </a>
</p>
---

<br/>

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

---

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [AI 분석 흐름](#ai-분석-흐름)
- [디렉토리 구조](#디렉토리-구조)
- [시작 가이드](#시작-가이드)
- [API 명세](#api-명세)
- [트러블슈팅](#트러블슈팅)

---

## 프로젝트 소개

**큐기출**은 자격증 시험을 준비하는 사용자가 단순 반복 학습에서 벗어나 **AI 기반의 맞춤형 학습**을 할 수 있도록 지원하는 CBT(Computer Based Test) 플랫폼입니다.

- 시험을 응시하고 결과를 분석합니다.
- GPT-4o가 오답 데이터를 분석해 **취약 단원과 오류 패턴**을 도출합니다.
- 취약 단원에 대한 **유사 문제를 자동 생성**하여 반복 학습을 지원합니다.

---

## 주요 기능

| 기능                 | 설명                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| **자격증 시험 응시** | 자격증별 기출문제를 타이머와 함께 풀어볼 수 있습니다                 |
| **성적 분석**        | 과목별·단원별 정답률을 차트로 시각화합니다                           |
| **AI 약점 분석**     | 오답 데이터를 GPT-4o에 전달해 취약 단원과 학습 우선순위를 분석합니다 |
| **AI 문제 생성**     | 취약 단원의 유사 문제를 자동 생성하여 반복 학습 환경을 제공합니다    |
| **오답 노트**        | 오답 문제에 메모를 추가하고 AI 분석 결과를 저장합니다                |
| **학습 대시보드**    | 전체 학습 현황, 통계, 추천 콘텐츠를 한눈에 확인합니다                |
| **자격증 추천**      | 학습 이력을 기반으로 다음에 도전할 자격증을 추천합니다               |

---

## 기술 스택

### Frontend

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.14-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.15-5A29E4?logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.8-22b5bf)

### Backend

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?logo=springsecurity&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-Hibernate-59666C?logo=hibernate&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

### AI Server

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)
![pdfplumber](https://img.shields.io/badge/pdfplumber-0.11-lightgrey)

### DevOps

![Docker](https://img.shields.io/badge/Docker_Compose-3-2496ED?logo=docker&logoColor=white)

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                      Client                         │
│              React + Vite (Port 3000)               │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (REST API)
┌──────────────────────▼──────────────────────────────┐
│               Spring Boot (Port 8080)               │
│     인증(JWT) · 시험 · 세션 · 통계 · 오답 노트       │
└───────────┬──────────────────────┬──────────────────┘
            │ JPA / MySQL          │ HTTP (내부)
┌───────────▼──────────┐  ┌───────▼──────────────────┐
│    MySQL 8.0         │  │  FastAPI AI (Port 8000)   │
│    (Port 3306)       │  │  GPT-4o · PDF 파싱        │
└──────────────────────┘  └──────────────────────────┘
```

모든 서비스는 Docker Compose의 `qgichul-net` 브릿지 네트워크로 연결됩니다.

---

## AI 분석 흐름

사용자의 오답 데이터가 GPT-4o 분석을 거쳐 피드백으로 돌아오는 전체 흐름입니다.

```
1. 답안 제출
   └─ POST /api/sessions/{sessionId}/submit
       └─ Spring Boot가 정오답 판정 후 MySQL에 저장

2. AI 약점 분석 요청
   └─ POST /api/ai/analysis
       └─ Spring Boot → FastAPI로 오답 데이터 전달
           {
             "wrong_questions": [
               { "subject": "전기기기", "chapter": "직류기",
                 "question": "...", "user_answer": 2, "correct_answer": 4 }
             ]
           }

3. GPT-4o 프롬프트 구성 (FastAPI)
   └─ 오답 목록을 단원별로 집계하여 구조화된 프롬프트 생성
      - 취약 단원 식별: 오답률 높은 단원 상위 N개 추출
      - 오류 패턴 분류: 개념 혼동 / 계산 실수 / 함정 문항 유형 구분
      - 학습 우선순위: 문제 배점·출제 빈도 기반 가중치 부여

4. GPT-4o 응답 파싱 → 구조화된 피드백 반환
   └─ {
        "weak_chapters": ["직류기", "유도전동기"],
        "error_patterns": ["개념 혼동: 역기전력 공식"],
        "recommendations": ["직류기 단원 집중 복습 후 유사 문제 풀이 권장"]
      }

5. AI 유사 문제 생성
   └─ POST /api/ai/generate-questions
       └─ 취약 단원 + 오답 문제를 컨텍스트로 GPT-4o가 새 문제 생성
          - 선택지 4개, 해설 포함
          - 기존 기출 문제와 유사한 난이도·형식 유지
```

---

## 디렉토리 구조

```
qgichul/
├── qgichul-frontend/       # React 프론트엔드
│   └── src/
│       ├── api/            # API 호출 모듈
│       ├── components/     # 공통 UI, 시험, 차트 컴포넌트
│       ├── hooks/          # Custom hooks
│       ├── pages/          # 페이지 컴포넌트
│       └── store/          # 인증 상태 관리
├── qgichul-backend/        # Spring Boot 백엔드
│   └── src/main/java/com/qgichul/backend/
│       ├── controller/     # REST API 엔드포인트
│       ├── service/        # 비즈니스 로직
│       ├── entity/         # JPA 엔티티
│       ├── repository/     # 데이터 접근
│       └── security/       # JWT 인증
├── qgichul-ai/             # FastAPI AI 서버
│   ├── routers/            # API 라우터
│   │   ├── ai.py           # 분석·문제 생성
│   │   └── pdf_parser.py   # PDF 파싱
│   └── prompts/            # GPT 프롬프트 템플릿
├── docker/
│   └── mysql/init.sql      # DB 초기화 스크립트
├── docker-compose.yml
└── .env.example
```

---

## 시작 가이드

### 요구사항

- Docker & Docker Compose
- (로컬 개발 시) Node.js 20+, Java 17+, Python 3.11+

### 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 값을 채워 넣습니다.

```env
# Database
MYSQL_ROOT_PASSWORD=your_password
DB_USERNAME=qgichul
DB_PASSWORD=your_password

# JWT (64자 이상 권장: openssl rand -base64 64)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Frontend
VITE_API_BASE_URL=http://localhost:8080
```

### Docker Compose로 전체 실행

```bash
docker compose up --build
```

| 서비스            | URL                        |
| ----------------- | -------------------------- |
| 프론트엔드        | http://localhost:3000      |
| 백엔드 API        | http://localhost:8080      |
| AI 서버 (Swagger) | http://localhost:8000/docs |

```bash
# 종료
docker compose down
```

### 로컬 개발 환경 (개별 실행)

**프론트엔드**

```bash
cd qgichul-frontend
npm install
npm run dev
```

**백엔드**

```bash
cd qgichul-backend
./gradlew bootRun
```

**AI 서버**

```bash
cd qgichul-ai
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## API 명세

### 인증

| Method | URL                | 설명              |
| ------ | ------------------ | ----------------- |
| POST   | `/api/auth/signup` | 회원가입          |
| POST   | `/api/auth/login`  | 로그인 (JWT 발급) |
| GET    | `/api/auth/me`     | 내 정보 조회      |

### 시험

| Method | URL                             | 설명        |
| ------ | ------------------------------- | ----------- |
| GET    | `/api/certifications`           | 자격증 목록 |
| GET    | `/api/exams`                    | 시험 목록   |
| GET    | `/api/exams/{examId}/questions` | 문제 조회   |

### 세션 & 통계

| Method | URL                                | 설명               |
| ------ | ---------------------------------- | ------------------ |
| POST   | `/api/sessions/start`              | 시험 시작          |
| POST   | `/api/sessions/{sessionId}/submit` | 답안 제출          |
| GET    | `/api/stats`                       | 과목별·단원별 통계 |
| GET    | `/api/stats/summary`               | 학습 요약          |

### 오답 노트

| Method | URL                   | 설명           |
| ------ | --------------------- | -------------- |
| GET    | `/api/notes`          | 오답 노트 목록 |
| POST   | `/api/notes`          | 메모 추가      |
| PUT    | `/api/notes/{memoId}` | 메모 수정      |

### AI

| Method | URL                          | 설명              |
| ------ | ---------------------------- | ----------------- |
| POST   | `/api/ai/analysis`           | 취약 단원 AI 분석 |
| POST   | `/api/ai/generate-questions` | AI 유사 문제 생성 |

---

## 트러블슈팅

### Next.js SSR → React CSR 전환

**문제 상황**

초기 프로젝트는 Next.js App Router(SSR)로 시작했습니다. CBT 시험 응시 화면은 타이머, 문제 네비게이션, 실시간 답안 상태 등 클라이언트 상태가 복잡하게 얽혀 있어, 서버 컴포넌트와 클라이언트 컴포넌트 경계를 나누는 과정에서 `useEffect` / `useState` 관련 오류가 반복 발생했습니다. 또한 Spring Boot 백엔드와의 JWT 기반 인증을 처리할 때 서버/클라이언트 쿠키 처리 방식의 차이로 인해 예상치 못한 인증 오류가 발생했습니다.

**원인 분석**

CBT 플랫폼의 핵심 화면(시험 응시, 실시간 통계 차트)은 SSR이 제공하는 초기 로딩 성능 이점보다 **클라이언트 인터랙션의 복잡도**가 훨씬 높았습니다. Next.js의 SSR 모델을 유지하면서 이 복잡도를 제어하는 비용이 순수 CSR로 전환하는 비용보다 크다고 판단했습니다.

**해결**

React + Vite CSR로 전환했습니다. 번들러를 Vite로 교체하면서 개발 서버 HMR 속도도 개선되었고, 시험 응시 화면의 상태 관리 구조가 단순해져 유지보수성이 높아졌습니다.

---

## 팀원 및 역할

| 이름   | 역할                                                       |
| ------ | ---------------------------------------------------------- |
| 박성훈 | 시스템 아키텍처 설계, 프론트 개발, Spring Boot 백엔드 개발 |
| 강민구 | AI 서버 개발 (FastAPI, GPT-4o 프롬프트 설계)               |
| 유찬양 | Spring Boot 백엔드 개발, DB 설계                           |

---

## 프로젝트 일정

- **4/13~4/17** : 요구사항 분석, 기술스택 선정, 기획
- **4/27~5/1** : 백엔드·DB 구축, 프론트앤드 완성
- **5/4~5/8** : 백앤드 완성 AI 개발
- **5/11** : 전체 시스템 완성, 프로젝트 정리

---

## 정보

- **SMU 엔지니어 9기 팀 미니 프로젝트**
