# 큐기출 — 3인 팀 협업 A to Z 가이드
> AI 기반 자격증 CBT 학습 추천 서비스 | 백엔드 · 프론트엔드 · AI | 2주 완성

---

## 📑 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [데이터베이스 설계](#4-데이터베이스-설계)
5. [API 명세 요약](#5-api-명세-요약)
6. [Git 협업 가이드](#6-git-협업-가이드)
7. [역할별 상세 가이드](#7-역할별-상세-가이드)
   - [7-1. 백엔드 (Spring Boot)](#7-1-백엔드-spring-boot)
   - [7-2. 프론트엔드 (React + Vite)](#7-2-프론트엔드-react--vite)
   - [7-3. AI 서버 (FastAPI)](#7-3-ai-서버-fastapi)
8. [2주 일정표](#8-2주-일정표)
9. [팀 소통 가이드](#9-팀-소통-가이드)
10. [공통 환경 세팅](#10-공통-환경-세팅)
11. [배포 가이드 (Docker + EC2)](#11-배포-가이드-docker--ec2)
12. [최종 체크리스트](#12-최종-체크리스트)

---

## 1. 프로젝트 개요

### 서비스 한 줄 소개

> 사용자의 CBT 문제풀이 데이터를 기반으로 취약 단원을 분석하고,  
> 맞춤 문제 · 자격증 · 학습경로 · 진로까지 추천하는 AI 학습 지원 플랫폼

### 핵심 기능 목록

| 번호 | 기능명 | 설명 |
|------|--------|------|
| 1 | 회원가입 / 로그인 | JWT 기반 인증, 이름·학력·전공 입력, 사용자별 학습 이력 관리 |
| 2 | PDF 파싱 + DB 저장 | comcbt.com PDF를 파싱해 문제·보기·해설을 DB에 자동 저장 |
| 3 | 자격증 시험 목록 조회 | 카테고리별 자격증 및 시험 목록 |
| 4 | 전공 기반 홈 추천 | 가입 시 입력한 전공을 AI가 분석해 메인 홈에 맞춤 문제 표시 |
| 5 | 문제풀이 (CBT) | 객관식 문제, 이전/다음 이동, 임시 저장 |
| 6 | 시험 제출 + 자동 채점 | 정답 비교, 점수 계산, 오답 저장 |
| 7 | 오답 노트 | 틀린 문제 자동 수집, 메모 작성, 재풀이 |
| 8 | 통계 | 전체/과목별/단원별 정답률, 추이 차트 |
| 9 | AI 취약 단원 분석 | 풀이 데이터 기반 약점 분석 |
| 10 | AI 문제 생성 (반복학습) | 취약 단원 분석 후 AI가 유사 문제를 직접 생성해 반복 학습 |
| 11 | AI 자격증 추천 | 강점 과목 기반 적합 자격증 추천 |
| 12 | AI 학습경로 + 진로 추천 | 단계별 학습 순서 및 직무 방향 제안 |

### MVP 우선순위 (2주 안에 반드시 완성)

**반드시 완성해야 하는 것 (Must)**
- PDF 파싱 파이프라인 (comcbt.com → DB 저장)
- 회원가입 / 로그인 (이름·학력·전공 포함)
- 전공 기반 홈 화면 AI 문제 추천
- 자격증 · 시험 목록 조회
- 문제풀이 + 채점
- 오답 노트
- 통계 (기본)
- AI 취약 단원 분석 + AI 문제 생성 (반복학습)

**시간이 남으면 추가 (Nice to have)**
- AI 자격증 추천
- AI 학습경로 + 진로 추천

---

## 2. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| **프론트엔드** | React | 18 |
| **프론트엔드 번들러** | Vite | 5 |
| **프론트엔드 차트** | Recharts | 최신 |
| **백엔드** | Spring Boot | 3.x |
| **백엔드 ORM** | Spring Data JPA | - |
| **AI 서버** | FastAPI | 최신 |
| **AI API** | OpenAI API | GPT-4o |
| **데이터베이스** | MySQL | 8.0 |
| **인증** | JWT | - |
| **컨테이너** | Docker + Docker Compose | 최신 |
| **배포** | AWS EC2 | - |

---

## 3. 시스템 아키텍처

### 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│            [사전 작업] PDF 파싱 파이프라인                  │
│  comcbt.com PDF 다운로드 → FastAPI 파서 → MySQL DB 저장   │
│  (서비스 오픈 전 1회성 작업 / 추가 시험 시 반복 실행)        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     사용자 브라우저                        │
│              React + Vite  (포트: 3000)                  │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API 호출 (HTTP/JSON)
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Spring Boot 백엔드 서버                      │
│                   (포트: 8080)                           │
│  - 회원 인증 (JWT) — 이름·학력·전공 포함                  │
│  - 자격증 / 시험 / 문제 API                               │
│  - 채점 / 오답 / 통계 API                                 │
│  - AI 서버와 내부 통신                                    │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
           │ JPA (DB 연결)            │ HTTP 요청 (AI 분석·생성 요청)
           ▼                          ▼
┌─────────────────┐        ┌──────────────────────────────┐
│   MySQL DB       │        │     FastAPI AI 서버           │
│  (포트: 3306)   │        │       (포트: 8000)            │
│                  │        │  - PDF 파싱 (pdfplumber)     │
│  - 사용자 정보   │        │  - 전공 기반 문제 추천         │
│    (이름·학력·과) │        │  - 취약 단원 분석             │
│  - 자격증/시험   │        │  - AI 문제 생성 (반복학습)    │
│  - 문제/보기     │        │  - 자격증/진로 추천           │
│  - 시험 세션     │        │       ↓                      │
│  - 사용자 답안   │        │   OpenAI GPT-4o API          │
│  - 오답 메모     │        └──────────────────────────────┘
│  - AI 생성 문제  │
└─────────────────┘
```

### 요청 흐름 예시

**[사전] PDF 파싱 파이프라인**
```
1. comcbt.com에서 시험 PDF 다운로드
2. AI 서버(FastAPI)의 파싱 스크립트 실행
   → pdfplumber로 문제·보기·해설·정답 추출
3. 추출된 데이터를 MySQL DB에 저장
   (certifications → exams → subjects → questions → choices)
```

**[회원가입] 전공 기반 홈 추천 흐름**
```
1. 사용자가 회원가입 (이름, 학력, 전공 입력)
2. 로그인 후 홈 화면 접속
   → 프론트: GET /api/ai/home-recommend
   → 백엔드: FastAPI로 전공 정보 전달
   → FastAPI: GPT가 전공과 연관된 자격증·문제 선별
   → 프론트: 맞춤 추천 문제 카드 표시
```

**[문제풀이] 채점 → AI 분석 → AI 문제 생성 흐름**
```
1. 사용자가 시험 시작 버튼 클릭
   → 프론트: POST /api/exams/{examId}/start

2. 백엔드가 시험 세션 생성 후 응답
   → 프론트: 문제 화면 렌더링

3. 사용자가 답안 제출
   → 프론트: POST /api/sessions/{sessionId}/submit

4. 백엔드가 채점 후 결과 저장
   → 백엔드: 오답 자동 저장, 통계 업데이트

5. 사용자가 오답 노트에서 AI 분석 요청
   → 프론트: GET /api/ai/analysis
   → 백엔드: FastAPI로 오답 데이터 전달
   → FastAPI: 취약 단원 분석 + 유사 문제 AI 생성
   → DB: ai_generated_questions 테이블에 저장
   → 프론트: 취약 분석 결과 + AI 생성 문제 표시

6. 사용자가 AI 생성 문제 풀이 (반복학습)
   → 프론트: POST /api/ai/generated-questions/{id}/answer
   → 백엔드: 정오답 저장 → 다시 분석 → 추가 생성 반복
```

---

## 4. 데이터베이스 설계

> **담당**: 백엔드 팀원이 아래 설계를 그대로 사용해 JPA Entity를 작성합니다.  
> Day 2에 팀 전원이 함께 검토한 뒤 확정합니다.

### 테이블 목록

| 테이블명 | 역할 |
|----------|------|
| users | 회원 정보 (이름·학력·전공 포함) |
| certifications | 자격증 목록 |
| exams | 시험 회차 |
| subjects | 과목 |
| questions | 문제 (PDF 파싱으로 저장) |
| choices | 보기 (1~4번) |
| exam_sessions | 시험 응시 세션 |
| user_answers | 사용자 답안 |
| wrong_note_memos | 오답 메모 |
| ai_generated_questions | AI가 생성한 반복학습용 문제 |

---

### 테이블 상세 설계

#### 1. users (회원)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 사용자 고유 ID |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 이메일 (로그인 아이디) |
| password | VARCHAR(255) | NOT NULL | bcrypt 암호화된 비밀번호 |
| name | VARCHAR(50) | NOT NULL | 실명 |
| nickname | VARCHAR(50) | NOT NULL | 닉네임 (화면 표시용) |
| education_level | VARCHAR(20) | NOT NULL | 학력 (HIGH_SCHOOL / COLLEGE_2_3 / COLLEGE_4 / GRADUATE) |
| major | VARCHAR(100) | - | 전공 (고졸이면 NULL, 대학 이상이면 필수) |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 가입 일시 |

> **education_level 값 규칙**
> - `HIGH_SCHOOL` — 고졸
> - `COLLEGE_2_3` — 2·3년제 대학
> - `COLLEGE_4` — 4년제 대학
> - `GRADUATE` — 대학원 이상
>
> 프론트에서 education_level이 HIGH_SCHOOL이면 major 입력 필드를 숨깁니다.

---

#### 2. certifications (자격증)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 자격증 고유 ID |
| name | VARCHAR(100) | NOT NULL | 자격증 이름 (예: 정보처리기사) |
| category | VARCHAR(50) | NOT NULL | 카테고리 (예: IT, 사무, 안전) |
| description | TEXT | - | 자격증 설명 |

**초기 데이터 예시**

| id | name | category |
|----|------|----------|
| 1 | 정보처리기사 | IT |
| 2 | SQLD | IT |
| 3 | 컴퓨터활용능력 1급 | 사무 |
| 4 | 전산회계 | 사무 |
| 5 | 산업안전기사 | 안전 |

---

#### 3. exams (시험 회차)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 시험 고유 ID |
| certification_id | BIGINT | FK → certifications.id | 어느 자격증 시험인지 |
| title | VARCHAR(200) | NOT NULL | 시험명 (예: 2024년 1회) |
| year | INT | NOT NULL | 출제 연도 |
| session | INT | NOT NULL | 회차 (1, 2, 3...) |
| duration_min | INT | NOT NULL | 제한 시간 (분 단위) |
| total_questions | INT | NOT NULL | 총 문항 수 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 등록 일시 |

---

#### 4. subjects (과목)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 과목 고유 ID |
| exam_id | BIGINT | FK → exams.id | 어느 시험의 과목인지 |
| name | VARCHAR(100) | NOT NULL | 과목명 |
| order_num | INT | NOT NULL | 출제 순서 |

---

#### 5. questions (문제)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 문제 고유 ID |
| exam_id | BIGINT | FK → exams.id | 어느 시험 문제인지 |
| subject_id | BIGINT | FK → subjects.id | 어느 과목 문제인지 |
| unit | VARCHAR(100) | NOT NULL | 단원명 (예: SQL JOIN) |
| question_num | INT | NOT NULL | 문항 번호 (1번~N번) |
| content | TEXT | NOT NULL | 문제 내용 |
| difficulty | TINYINT | NOT NULL | 난이도 (1:하, 2:중, 3:상) |
| correct_answer | TINYINT | NOT NULL | 정답 번호 (1~4) |
| explanation | TEXT | - | 해설 |

---

#### 6. choices (보기)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 보기 고유 ID |
| question_id | BIGINT | FK → questions.id | 어느 문제의 보기인지 |
| choice_num | TINYINT | NOT NULL | 보기 번호 (1~4) |
| content | TEXT | NOT NULL | 보기 내용 |

---

#### 7. exam_sessions (시험 응시 세션)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 세션 고유 ID |
| user_id | BIGINT | FK → users.id | 응시한 사용자 |
| exam_id | BIGINT | FK → exams.id | 응시한 시험 |
| started_at | DATETIME | NOT NULL | 시험 시작 일시 |
| submitted_at | DATETIME | - | 제출 일시 (null이면 미제출) |
| score | FLOAT | - | 점수 (제출 후 채워짐) |
| correct_count | INT | - | 맞힌 문제 수 |
| total_count | INT | NOT NULL | 총 문제 수 |
| status | VARCHAR(20) | NOT NULL | IN_PROGRESS 또는 SUBMITTED |

---

#### 8. user_answers (사용자 답안)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 답안 고유 ID |
| session_id | BIGINT | FK → exam_sessions.id | 어느 세션의 답안인지 |
| question_id | BIGINT | FK → questions.id | 어느 문제의 답안인지 |
| selected_answer | TINYINT | - | 사용자가 선택한 번호 (1~4, null이면 미답) |
| is_correct | BOOLEAN | - | 정답 여부 (제출 후 채워짐) |
| answered_at | DATETIME | - | 답안 입력 일시 |

---

#### 9. wrong_note_memos (오답 메모)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 메모 고유 ID |
| user_id | BIGINT | FK → users.id | 메모 작성 사용자 |
| question_id | BIGINT | FK → questions.id | 해당 문제 |
| memo | TEXT | - | 사용자가 쓴 메모 내용 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 생성 일시 |
| updated_at | DATETIME | NOT NULL | 수정 일시 |

---

#### 10. ai_generated_questions (AI 생성 문제)

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 생성 문제 고유 ID |
| user_id | BIGINT | FK → users.id | 대상 사용자 |
| source_question_id | BIGINT | FK → questions.id | 기반이 된 원본 오답 문제 |
| unit | VARCHAR(100) | NOT NULL | 취약 단원명 |
| content | TEXT | NOT NULL | AI가 생성한 문제 내용 |
| choice_1 | TEXT | NOT NULL | 보기 1 |
| choice_2 | TEXT | NOT NULL | 보기 2 |
| choice_3 | TEXT | NOT NULL | 보기 3 |
| choice_4 | TEXT | NOT NULL | 보기 4 |
| correct_answer | TINYINT | NOT NULL | 정답 번호 (1~4) |
| explanation | TEXT | NOT NULL | AI가 작성한 해설 |
| user_answer | TINYINT | - | 사용자가 선택한 답 (null이면 미풀이) |
| is_correct | BOOLEAN | - | 정오답 여부 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 생성 일시 |

---

### 테이블 관계 요약 (ERD)

```
certifications
    │
    └──< exams
              │
              ├──< subjects
              │
              └──< questions
                        │
                        └──< choices

users
    │
    ├──< exam_sessions >──── exams
    │         │
    │         └──< user_answers >──── questions
    │
    ├──< wrong_note_memos >──── questions
    │
    └──< ai_generated_questions >──── questions (source)
```

---

## 5. API 명세 요약

> **중요**: 백엔드와 프론트가 이 명세를 Day 2에 함께 확정합니다.  
> 실제 개발은 이 표를 기준으로 진행하고, 변경 시 반드시 팀 전체에 공유합니다.

### 인증 API

| 메서드 | 경로 | 설명 | 요청 Body | 응답 |
|--------|------|------|-----------|------|
| POST | /api/auth/signup | 회원가입 | email, password, name, nickname, education_level, major(선택) | 성공 메시지 |
| POST | /api/auth/login | 로그인 | email, password | JWT 토큰 |
| GET | /api/auth/me | 내 정보 조회 | - (헤더에 토큰) | 사용자 정보 (전공·학력 포함) |

### 자격증 / 시험 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/certifications | 자격증 목록 전체 조회 |
| GET | /api/certifications/{id} | 자격증 상세 조회 |
| GET | /api/certifications/{id}/exams | 특정 자격증의 시험 목록 |
| GET | /api/exams/{examId} | 시험 상세 정보 |
| GET | /api/exams/{examId}/questions | 시험 문제 목록 (보기 포함) |

### 문제풀이 / 채점 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/exams/{examId}/start | 시험 세션 시작 |
| GET | /api/sessions/{sessionId} | 현재 세션 상태 조회 |
| PATCH | /api/sessions/{sessionId}/answer | 답안 임시 저장 |
| POST | /api/sessions/{sessionId}/submit | 시험 제출 + 채점 |
| GET | /api/sessions/{sessionId}/result | 채점 결과 조회 |

### 오답 노트 / 통계 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/notes | 내 오답 목록 전체 |
| GET | /api/notes/{questionId} | 오답 문제 상세 |
| POST | /api/notes/{questionId}/memo | 오답 메모 저장 |
| PUT | /api/notes/{questionId}/memo | 오답 메모 수정 |
| GET | /api/stats/summary | 전체 통계 요약 |
| GET | /api/stats/subjects | 과목별 정답률 |
| GET | /api/stats/units | 단원별 정답률 |
| GET | /api/stats/history | 최근 시험 점수 추이 |

### AI 분석 API (FastAPI 내부) / 백엔드 공개 API

| 메서드 | 경로 | 설명 | 누가 호출하나 |
|--------|------|------|--------------|
| GET | /api/ai/home-recommend | 전공 기반 홈 추천 문제 목록 | 프론트 → 백엔드 → AI |
| POST | /ai/analyze/weakness | 취약 단원 분석 | 백엔드 → AI 서버 |
| POST | /ai/generate/questions | 취약 단원 기반 문제 생성 | 백엔드 → AI 서버 |
| GET | /api/ai/generated-questions | 내 AI 생성 문제 목록 | 프론트 → 백엔드 |
| POST | /api/ai/generated-questions/{id}/answer | AI 생성 문제 풀기 | 프론트 → 백엔드 |
| POST | /ai/recommend/certifications | 자격증 추천 | 백엔드 → AI 서버 |
| POST | /ai/recommend/roadmap | 학습경로 + 진로 추천 | 백엔드 → AI 서버 |

> **주의**: `/ai/...` 경로는 FastAPI 내부 엔드포인트입니다. 프론트에서 직접 호출하지 않고 반드시 백엔드(`/api/ai/...`)를 거칩니다.

---

## 6. Git 협업 가이드

> 코딩 초보자도 따라할 수 있도록 단계별로 설명합니다.  
> 모르면 팀원에게 바로 물어보세요.

### 레포지토리 구조

3개의 GitHub 레포지토리를 각각 생성합니다.

| 레포 이름 | 담당 | 설명 |
|-----------|------|------|
| `qgichul-backend` | 백엔드 | Spring Boot 프로젝트 |
| `qgichul-frontend` | 프론트엔드 | React + Vite 프로젝트 |
| `qgichul-ai` | AI | FastAPI 프로젝트 |

**레포 생성 방법**: GitHub → New Repository → 레포명 입력 → Private 선택 → Create

---

### 브랜치 전략

브랜치는 딱 2종류만 사용합니다.

```
main
  └── develop
         ├── feature/회원가입
         ├── feature/로그인
         ├── feature/시험목록
         └── feature/문제풀이
```

| 브랜치 | 용도 | 규칙 |
|--------|------|------|
| `main` | 최종 배포용 | 절대 직접 push 금지. develop에서 merge만 |
| `develop` | 통합 개발용 | feature 브랜치를 merge하는 곳 |
| `feature/기능명` | 기능 개발용 | 각자 이 브랜치를 만들어 작업 후 develop에 merge |

---

### 브랜치 만드는 방법 (처음 클론 후)

```
1. GitHub에서 레포 주소 복사
2. 터미널 열기
3. 아래 순서대로 명령어 입력:

   git clone 레포주소
   cd 레포이름
   git checkout develop            ← develop 브랜치로 이동
   git checkout -b feature/기능명  ← 내 작업 브랜치 생성
```

---

### 매일 작업 흐름 (이것만 따라하면 됩니다)

```
① 작업 시작 전 — 최신 코드 받기
   git checkout develop
   git pull origin develop

② 내 브랜치로 이동
   git checkout feature/내기능명

③ 코드 작성 (본인 작업)

④ 작업 저장 (커밋)
   git add .
   git commit -m "feat: 로그인 API 작성"

⑤ GitHub에 올리기
   git push origin feature/내기능명

⑥ GitHub에서 PR(Pull Request) 생성
   - 제목: [기능명] 작업 내용 요약
   - base: develop ← compare: feature/내기능명
   - 팀원에게 리뷰 요청 (또는 바로 merge)
```

---

### 커밋 메시지 규칙

팀원끼리 어떤 작업을 했는지 바로 알 수 있도록 아래 형식을 지킵니다.

| 타입 | 언제 사용 | 예시 |
|------|----------|------|
| `feat:` | 새로운 기능 추가 | feat: 회원가입 API 작성 |
| `fix:` | 버그 수정 | fix: 로그인 토큰 오류 수정 |
| `style:` | UI 스타일 수정 | style: 버튼 색상 변경 |
| `refactor:` | 코드 정리 (기능 변화 없음) | refactor: 함수명 정리 |
| `docs:` | 문서 수정 | docs: README 업데이트 |
| `chore:` | 설정 파일 변경 | chore: .env.example 추가 |

---

### PR (Pull Request) 규칙

- 하루에 1회 이상 PR을 올려서 팀원이 진행상황을 알 수 있게 합니다
- PR 제목 형식: `[백엔드] 회원가입 API 완성`
- PR 본문에 다음을 간단히 적습니다:
  - 무엇을 했는지
  - 테스트 방법
  - 막히는 부분이 있으면 질문

---

### .gitignore 필수 항목

**절대 GitHub에 올리면 안 되는 파일들** (각자 .gitignore에 추가)

백엔드:
```
application-secret.properties
.env
target/
*.class
```

프론트엔드:
```
.env
.env.local
node_modules/
dist/
```

AI 서버:
```
.env
__pycache__/
*.pyc
venv/
.venv/
```

---

### 충돌(Conflict) 발생 시 대처법

같은 파일을 두 명이 수정했을 때 충돌이 발생합니다.  
당황하지 말고 아래 순서대로 합니다.

```
1. git pull origin develop
   → 충돌 파일 목록이 표시됨

2. VS Code에서 충돌 파일 열기
   → <<<<<<< HEAD (내 코드)
   → ======= (상대방 코드)
   → >>>>>>> develop (develop 코드)
   를 찾아서 어떤 코드를 살릴지 결정 후 <<<, ===, >>> 줄을 삭제

3. git add .
   git commit -m "fix: 충돌 해결"
```

혼자 해결하기 어려우면 반드시 팀원을 불러서 같이 해결하세요.

---

## 7. 역할별 상세 가이드

---

### 7-1. 백엔드 (Spring Boot)

#### 담당 기능

- 회원가입 / 로그인 / JWT 인증
- 자격증 · 시험 · 문제 API
- 문제풀이 세션 · 채점 · 오답 저장 API
- 통계 데이터 계산 API
- AI 서버 연동 (중계 역할)
- MySQL DB 연동 및 테이블 관리

---

#### 개발 환경 세팅 (처음 1번만)

**필요한 설치 목록**

| 도구 | 설치 방법 | 확인 명령어 |
|------|----------|------------|
| Java 17 | https://adoptium.net → JDK 17 LTS 다운로드 | `java -version` |
| IntelliJ IDEA | https://www.jetbrains.com/idea/ (Community 무료) | - |
| MySQL 8.0 | https://dev.mysql.com/downloads/installer/ | `mysql -V` |
| MySQL Workbench | MySQL 설치 시 함께 설치 가능 | - |
| Postman | https://www.postman.com/downloads/ | - |

---

#### 프로젝트 생성 방법

1. https://start.spring.io 접속
2. 아래 설정 선택:
   - **Project**: Gradle - Groovy
   - **Language**: Java
   - **Spring Boot**: 3.x 최신
   - **Group**: com.qgichul
   - **Artifact**: backend
   - **Java**: 17
3. **Dependencies 추가** (검색해서 추가):
   - Spring Web
   - Spring Data JPA
   - MySQL Driver
   - Spring Security
   - Lombok
   - Validation
4. **GENERATE** 클릭 → zip 다운로드 → IntelliJ로 열기

---

#### 폴더 구조

```
src/main/java/com/qgichul/backend/
├── config/
│   ├── SecurityConfig.java          ← Spring Security + JWT 설정
│   └── WebConfig.java               ← CORS 설정 (프론트 요청 허용)
├── controller/
│   ├── AuthController.java          ← 회원가입, 로그인 API
│   ├── CertificationController.java ← 자격증 목록 API
│   ├── ExamController.java          ← 시험 목록, 문제 API
│   ├── SessionController.java       ← 시험 세션, 채점 API
│   ├── NoteController.java          ← 오답 노트 API
│   ├── StatsController.java         ← 통계 API
│   └── AiController.java            ← AI 분석 API (AI 서버 중계)
├── service/
│   ├── AuthService.java
│   ├── CertificationService.java
│   ├── ExamService.java
│   ├── SessionService.java
│   ├── NoteService.java
│   ├── StatsService.java
│   └── AiService.java               ← FastAPI로 HTTP 요청 보내는 로직
├── repository/
│   ├── UserRepository.java
│   ├── CertificationRepository.java
│   ├── ExamRepository.java
│   ├── QuestionRepository.java
│   ├── ExamSessionRepository.java
│   ├── UserAnswerRepository.java
│   └── WrongNoteMemoRepository.java
├── entity/
│   ├── User.java
│   ├── Certification.java
│   ├── Exam.java
│   ├── Subject.java
│   ├── Question.java
│   ├── Choice.java
│   ├── ExamSession.java
│   ├── UserAnswer.java
│   └── WrongNoteMemo.java
├── dto/
│   ├── request/                     ← API 요청 데이터 형식
│   └── response/                    ← API 응답 데이터 형식
├── jwt/
│   ├── JwtUtil.java                 ← 토큰 생성/검증
│   └── JwtFilter.java               ← 요청마다 토큰 확인
└── BackendApplication.java          ← 시작점
```

---

#### 개발 순서 및 체크리스트

**1단계: 데이터베이스 & JPA 엔티티 (Day 2~3)**

- [ ] MySQL에 `qgichul_db` 데이터베이스 생성
- [ ] `application.properties`에 DB 연결 정보 입력
- [ ] 4장(DB 설계)을 참고해 Entity 클래스 9개 작성
- [ ] JPA `ddl-auto=create`로 첫 실행해서 테이블 자동 생성 확인
- [ ] MySQL Workbench에서 테이블이 정상적으로 만들어졌는지 확인

**2단계: 인증 (Day 3~4)**

- [ ] `User` Entity 및 `UserRepository` 작성
- [ ] `AuthService`에서 비밀번호 암호화 (BCryptPasswordEncoder) 회원가입 처리
- [ ] `JwtUtil`에서 JWT 토큰 생성 · 검증 로직 작성
- [ ] `JwtFilter`에서 모든 요청의 헤더에서 토큰 확인하도록 설정
- [ ] `POST /api/auth/signup` API 완성
- [ ] `POST /api/auth/login` API 완성
- [ ] `GET /api/auth/me` API 완성
- [ ] Postman으로 3가지 API 모두 테스트 성공

**3단계: 자격증 · 시험 · 문제 API (Day 4~5)**

- [ ] `Certification`, `Exam`, `Subject`, `Question`, `Choice` Entity 작성
- [ ] SQL로 초기 데이터 삽입 (자격증 5개, 시험 2개, 문제 20개 이상)
- [ ] `GET /api/certifications` 자격증 목록 API
- [ ] `GET /api/exams/{examId}/questions` 문제 목록 API (보기 포함)
- [ ] Postman 테스트 성공

**4단계: 시험 세션 & 채점 (Day 6~7)**

- [ ] `ExamSession`, `UserAnswer` Entity 작성
- [ ] `POST /api/exams/{examId}/start` — 시험 세션 생성
- [ ] `PATCH /api/sessions/{sessionId}/answer` — 답안 임시 저장
- [ ] `POST /api/sessions/{sessionId}/submit` — 제출 & 채점 로직 구현
  - 사용자 답안과 정답 비교
  - is_correct 업데이트
  - score 계산 (맞힌 수 / 전체 수 × 100)
  - status를 SUBMITTED로 변경
- [ ] Postman으로 시험 시작 → 답안 저장 → 제출 흐름 테스트

**5단계: 오답 노트 & 통계 (Day 7~8)**

- [ ] `GET /api/notes` — 틀린 문제 목록 (is_correct=false인 답안)
- [ ] `POST /api/notes/{questionId}/memo` — 메모 저장
- [ ] `GET /api/stats/summary` — 전체 정답률, 총 응시 횟수
- [ ] `GET /api/stats/subjects` — 과목별 정답률
- [ ] `GET /api/stats/units` — 단원별 정답률 (취약 단원 파악용)
- [ ] `GET /api/stats/history` — 최근 10회 점수 추이

**6단계: AI 서버 연동 (Day 9)**

- [ ] `AiService`에서 `RestTemplate` 또는 `WebClient`로 FastAPI 호출 구현
- [ ] `GET /api/ai/analysis` — AI 분석 결과 반환 API
  - 백엔드가 사용자 통계 데이터를 가져와 → FastAPI에 전달 → 결과 받아서 → 프론트에 반환
- [ ] AI 서버 팀원과 함께 요청/응답 형식 확인 후 테스트

---

#### CORS 설정 (프론트 연동 필수)

프론트엔드(포트 3000)에서 백엔드(포트 8080)로 요청할 때 브라우저가 막지 않도록 설정해야 합니다.

`WebConfig.java`에서 `http://localhost:3000` 을 허용 origin으로 등록합니다.

---

#### application.properties 작성 가이드

```
# 서버 포트
server.port=8080

# MySQL 연결
spring.datasource.url=jdbc:mysql://localhost:3306/qgichul_db?useSSL=false&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=여기에_본인_비밀번호

# JPA 설정
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT 설정 (절대 GitHub에 올리면 안 됨)
jwt.secret=여기에_랜덤_문자열_32자_이상
jwt.expiration=86400000

# AI 서버 주소
ai.server.url=http://localhost:8000
```

> **중요**: `application.properties`는 `.gitignore`에 추가하거나,  
> 비밀 정보가 없는 `application-example.properties`를 GitHub에 올려두세요.

---

### 7-2. 프론트엔드 (React + Vite)

#### 담당 기능

- 전체 화면 UI 구현
- 회원가입 / 로그인 화면
- 자격증 · 시험 목록 화면
- 문제풀이 화면 (CBT UI)
- 채점 결과 화면
- 오답 노트 화면
- 통계 / 대시보드 화면
- AI 분석 결과 화면

---

#### 개발 환경 세팅

**필요한 설치 목록**

| 도구 | 설치 방법 | 확인 명령어 |
|------|----------|------------|
| Node.js 20 LTS | https://nodejs.org → LTS 버전 | `node -v` |
| VS Code | https://code.visualstudio.com | - |

**VS Code 확장 설치 (필수)**

VS Code 좌측 확장 아이콘 → 아래 4개 검색해서 설치:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- ESLint

---

#### 프로젝트 생성 방법

터미널에서 아래 명령어 순서대로 입력:

```
1. npm create vite@latest qgichul-frontend -- --template react
2. cd qgichul-frontend
3. npm install
4. npm install axios react-router-dom recharts
5. npm run dev
   → 브라우저에서 http://localhost:3000 확인
```

---

#### 폴더 구조

```
src/
├── api/
│   ├── axiosInstance.js    ← API 기본 설정 (baseURL, 토큰 자동 첨부)
│   ├── authApi.js          ← 회원가입, 로그인, 내 정보 API 함수들
│   ├── certApi.js          ← 자격증, 시험, 문제 API 함수들
│   ├── sessionApi.js       ← 시험 세션, 채점 API 함수들
│   ├── noteApi.js          ← 오답 노트 API 함수들
│   ├── statsApi.js         ← 통계 API 함수들
│   └── aiApi.js            ← AI 분석 API 함수들
├── components/
│   ├── common/
│   │   ├── Navbar.jsx      ← 상단 내비게이션
│   │   ├── Button.jsx      ← 공통 버튼 컴포넌트
│   │   ├── Loading.jsx     ← 로딩 스피너
│   │   └── Modal.jsx       ← 공통 모달
│   ├── exam/
│   │   ├── QuestionCard.jsx    ← 문제 + 보기 카드
│   │   ├── ExamProgress.jsx    ← N/총문항 진행 표시
│   │   └── Timer.jsx           ← 남은 시간 표시
│   └── chart/
│       ├── ScoreLineChart.jsx  ← 점수 추이 선 그래프 (Recharts)
│       └── SubjectBarChart.jsx ← 과목별 정답률 막대 그래프
├── pages/
│   ├── LoginPage.jsx           ← 로그인 화면
│   ├── SignupPage.jsx          ← 회원가입 화면
│   ├── CertListPage.jsx        ← 자격증 목록 화면
│   ├── ExamListPage.jsx        ← 시험 목록 화면
│   ├── ExamPage.jsx            ← 문제풀이 CBT 화면
│   ├── ResultPage.jsx          ← 채점 결과 화면
│   ├── NotePage.jsx            ← 오답 노트 화면
│   ├── StatsPage.jsx           ← 통계 / 대시보드 화면
│   └── AiPage.jsx              ← AI 분석 결과 화면
├── hooks/
│   ├── useAuth.js              ← 로그인 여부, 토큰 관리
│   └── useTimer.js             ← 시험 타이머 로직
├── store/
│   └── authStore.js            ← 로그인 상태 전역 관리 (localStorage)
├── App.jsx                     ← 라우팅 설정
└── main.jsx                    ← 진입점
```

---

#### 개발 순서 및 체크리스트

**1단계: 기본 세팅 & 라우팅 (Day 2~3)**

- [ ] `App.jsx`에서 페이지별 라우팅 설정 (`react-router-dom`)
  - `/login` → LoginPage
  - `/signup` → SignupPage
  - `/` → CertListPage
  - `/exams/:certId` → ExamListPage
  - `/exam/:examId` → ExamPage
  - `/result/:sessionId` → ResultPage
  - `/notes` → NotePage
  - `/stats` → StatsPage
  - `/ai` → AiPage
- [ ] `Navbar.jsx` 공통 내비게이션 만들기 (로고, 메뉴, 로그아웃 버튼)
- [ ] `axiosInstance.js`에서 baseURL을 `http://localhost:8080`으로 설정
- [ ] 로그인 상태면 `/login`으로 못 가도록 라우트 보호 설정

**2단계: 인증 화면 (Day 3~4)**

- [ ] `SignupPage.jsx` — 이름, 이메일, 비밀번호, 학력 선택(드롭다운), 전공 입력 폼
  - 학력이 `HIGH_SCHOOL`이면 전공 입력 필드 숨기기 (조건부 렌더링)
  - 학력 선택지: 고졸 / 2·3년제 / 4년제 / 대학원 이상
- [ ] `LoginPage.jsx` — 이메일, 비밀번호 입력 폼
- [ ] 로그인 성공 시 JWT 토큰을 `localStorage`에 저장
- [ ] `useAuth.js` — 토큰 저장/삭제/확인 함수 만들기
- [ ] 로그인 성공 → **홈 화면(AI 추천 포함)** 으로 자동 이동
- [ ] 로그아웃 버튼 클릭 → 토큰 삭제 → 로그인 페이지로 이동
- [ ] 백엔드 팀원에게 회원가입 API가 준비됐는지 확인 후 연동 테스트

**3단계: 자격증 · 시험 목록 화면 (Day 4~5)**

- [ ] `CertListPage.jsx` — 자격증 카드 목록 (카테고리별)
- [ ] `ExamListPage.jsx` — 선택한 자격증의 시험 목록
- [ ] 카드 클릭 → 상세 페이지 이동
- [ ] API가 아직 안 나왔으면 임시 더미 데이터로 UI 먼저 완성

**4단계: 문제풀이 CBT 화면 (Day 5~6) — 가장 중요!**

- [ ] `ExamPage.jsx` — 전체 시험 화면
- [ ] `QuestionCard.jsx` — 문제 번호, 문제 내용, 보기 1~4개 라디오 버튼
- [ ] `ExamProgress.jsx` — "5 / 20문항" 진행 표시
- [ ] `Timer.jsx` — 남은 시간 표시 (초 단위 카운트다운)
- [ ] 이전 / 다음 문제 이동 버튼
- [ ] 답 선택 시 즉시 API로 임시 저장 (`PATCH /api/sessions/{sessionId}/answer`)
- [ ] 문제 번호 목록 (풀었으면 색상 변경)
- [ ] 제출 버튼 → 확인 모달 → 제출 API 호출 → 결과 페이지 이동

**5단계: 채점 결과 화면 (Day 6~7)**

- [ ] `ResultPage.jsx`
- [ ] 총점, 정답 수, 오답 수 표시
- [ ] 문항별 정오 표시 (O / X)
- [ ] 오답 문제의 정답 및 해설 표시
- [ ] "오답 노트 보기" 버튼
- [ ] "다시 풀기" 버튼

**6단계: 오답 노트 & 통계 화면 (Day 7~8)**

- [ ] `NotePage.jsx` — 오답 목록, 각 문제의 내 답 / 정답 / 해설, 메모 입력칸
- [ ] `StatsPage.jsx`
  - 전체 정답률 숫자 표시
  - 최근 점수 추이 선 그래프 (Recharts LineChart)
  - 과목별 정답률 막대 그래프 (Recharts BarChart)
  - 오답률 높은 단원 TOP 5 리스트

**7단계: AI 분석 + 반복학습 화면 (Day 9)**

- [ ] `AiPage.jsx`
- [ ] "AI 분석 시작" 버튼 → 로딩 스피너 → 결과 표시
- [ ] 취약 단원 분석 결과 카드 (단원명, 정답률, 분석 코멘트)
- [ ] **AI 생성 문제 섹션** — "이 단원 집중 연습하기" 버튼
  - 버튼 클릭 → AI가 해당 단원 문제 3~5개 생성
  - 기존 CBT와 동일한 `QuestionCard` 컴포넌트로 표시
  - 풀고 나면 정오답 즉시 표시 + 해설 공개
  - 오답이면 "다시 생성" 버튼 → 추가 문제 생성 (반복학습)
- [ ] `HomePage.jsx` — 로그인 직후 홈 화면
  - 전공 기반 AI 추천 문제 카드 3~5개 표시
  - "오늘의 추천 자격증" 섹션
- [ ] 추천 자격증 + 이유
- [ ] 학습경로 단계별 표시

---

#### 중요한 프론트 개발 원칙

**API가 아직 준비 안 됐을 때는 더미 데이터로 UI 먼저 만드세요**

```
예시 더미 데이터 (실제 API 나오면 교체):

const dummyQuestion = {
  id: 1,
  questionNum: 1,
  content: "SQL에서 JOIN의 종류가 아닌 것은?",
  choices: [
    { choiceNum: 1, content: "INNER JOIN" },
    { choiceNum: 2, content: "OUTER JOIN" },
    { choiceNum: 3, content: "CROSS JOIN" },
    { choiceNum: 4, content: "LOOP JOIN" }
  ]
}
```

**axios로 API 호출하는 기본 패턴**

```
1. api 폴더의 해당 파일에서 함수 작성
2. 페이지 컴포넌트에서 useEffect로 호출
3. 데이터를 state에 저장
4. 화면에 렌더링
```

---

### 7-3. AI 서버 (FastAPI)

#### 담당 기능

- FastAPI 서버 구축
- 백엔드로부터 사용자 데이터를 받아 OpenAI API 호출
- 취약 단원 분석
- 문제 추천
- 자격증 추천
- 학습경로 · 진로 추천

---

#### 개발 환경 세팅

**필요한 설치 목록**

| 도구 | 설치 방법 | 확인 명령어 |
|------|----------|------------|
| Python 3.11 | https://www.python.org/downloads/ | `python --version` |
| VS Code | https://code.visualstudio.com | - |

**VS Code 확장 설치**

- Python (Microsoft 제공)
- Pylance

---

#### 프로젝트 생성 방법

터미널에서 순서대로 입력:

```
1. 폴더 만들기
   mkdir qgichul-ai
   cd qgichul-ai

2. 가상환경 만들기 (의존성 격리)
   python -m venv venv

3. 가상환경 활성화
   Windows: venv\Scripts\activate
   Mac/Linux: source venv/bin/activate

4. 필요한 패키지 설치
   pip install fastapi uvicorn openai python-dotenv httpx pdfplumber pymysql sqlalchemy

5. 설치 목록 저장 (팀원들도 동일하게 설치할 수 있게)
   pip freeze > requirements.txt
```

---

#### 폴더 구조

```
qgichul-ai/
├── main.py                        ← FastAPI 앱 시작점, API 라우트 등록
├── parser/
│   ├── pdf_parser.py              ← PDF → 문제/보기/해설 추출 (pdfplumber)
│   ├── db_uploader.py             ← 파싱 결과를 MySQL에 저장
│   └── run_parser.py              ← 파싱 실행 스크립트 (1회성 CLI 실행)
├── routers/
│   ├── weakness.py                ← 취약 단원 분석 API
│   ├── question_generate.py      ← AI 문제 생성 API (반복학습)
│   ├── home_recommend.py         ← 전공 기반 홈 추천 API
│   ├── cert_recommend.py         ← 자격증 추천 API
│   └── roadmap.py                ← 학습경로 + 진로 추천 API
├── services/
│   ├── openai_service.py         ← OpenAI API 공통 호출 함수
│   └── prompt_builder.py        ← 각 기능별 프롬프트 조립
├── models/
│   └── schemas.py                ← 요청/응답 데이터 형식 정의 (Pydantic)
├── .env                          ← OPENAI_API_KEY, DB 설정 (GitHub 절대 금지!)
├── .env.example                  ← 키 없이 형식만
├── requirements.txt
└── README.md
```

---

#### 개발 순서 및 체크리스트

**0단계: PDF 파싱 파이프라인 구축 (Day 1~2) — 가장 먼저!**

> comcbt.com에서 다운로드한 PDF를 파싱해서 DB에 집어넣는 1회성 스크립트입니다.  
> 이 작업이 완료돼야 다른 기능이 모두 동작합니다.

- [ ] `pip install pdfplumber` 설치 확인
- [ ] `pdf_parser.py` 작성 — pdfplumber로 PDF 열고 텍스트 추출

```python
import pdfplumber, re

def parse_exam_pdf(pdf_path: str) -> list[dict]:
    questions = []
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            full_text += page.extract_text() + "\n"
    # 정규식으로 문제 번호·문제 내용·보기·정답 분리
    # (PDF 구조마다 파싱 로직이 다를 수 있으니 실제 PDF 확인 후 조정)
    return questions
```

- [ ] `db_uploader.py` 작성 — 파싱 결과를 MySQL에 INSERT

```python
import pymysql

def upload_questions(questions: list[dict], exam_id: int):
    conn = pymysql.connect(host="localhost", user="root", password="...", db="qgichul_db")
    with conn.cursor() as cursor:
        for q in questions:
            cursor.execute(
                "INSERT INTO questions (exam_id, subject_id, question_num, content, correct_answer, explanation) VALUES (%s, %s, %s, %s, %s, %s)",
                (exam_id, q["subject_id"], q["num"], q["content"], q["answer"], q["explanation"])
            )
    conn.commit()
```

- [ ] `run_parser.py` CLI 스크립트 작성 후 실행
  ```
  python run_parser.py --pdf "./컴퓨터활용능력2급20200704_교사용_.pdf" --exam_id 1
  ```
- [ ] DB 확인: `SELECT COUNT(*) FROM questions;` → 문제 수 정상 저장 확인
- [ ] 해설집 PDF도 동일하게 파싱하여 `explanation` 필드 채우기

**1단계: 기본 서버 세팅 (Day 2~3)**

- [ ] `main.py`에서 FastAPI 앱 생성
- [ ] 포트 8000으로 서버 실행 (`uvicorn main:app --reload --port 8000`)
- [ ] 브라우저에서 `http://localhost:8000/docs` 접속 → Swagger 문서 확인
- [ ] `.env` 파일 생성 후 `OPENAI_API_KEY` 입력
- [ ] `.gitignore`에 `.env` 추가 (!!!중요)
- [ ] `schemas.py`에서 요청/응답 데이터 형식 정의

**2단계: OpenAI 연동 기본 테스트 (Day 3~4)**

- [ ] `openai_service.py`에서 OpenAI 클라이언트 설정
- [ ] 간단한 테스트: "안녕하세요"를 보내면 GPT가 응답하는지 확인
- [ ] 응답 형식이 JSON으로 잘 오는지 확인 (JSON 모드 사용 권장)

**3단계: 취약 단원 분석 API (Day 5~6)**

요청 데이터 형식 (백엔드가 이렇게 보냄):
```
{
  "user_id": 1,
  "unit_stats": [
    { "unit": "SQL JOIN", "correct_rate": 0.3, "attempt_count": 10 },
    { "unit": "인덱스", "correct_rate": 0.8, "attempt_count": 5 },
    { "unit": "트랜잭션", "correct_rate": 0.4, "attempt_count": 8 }
  ]
}
```

- [ ] `weakness.py`에서 `POST /ai/analyze/weakness` API 구현
- [ ] `prompt_builder.py`에서 단원별 정답률 데이터를 GPT 프롬프트로 변환
- [ ] GPT가 분석 결과를 JSON으로 반환하도록 프롬프트 작성
- [ ] 응답 형식 예시:
```
{
  "weak_units": ["SQL JOIN", "트랜잭션"],
  "analysis": "SQL JOIN 단원의 정답률이 30%로 가장 낮습니다...",
  "priority": "SQL JOIN 기본 개념부터 다시 학습하세요."
}
```

**4단계: 전공 기반 홈 추천 API (Day 6)**

요청 데이터: 사용자 전공, 학력

- [ ] `home_recommend.py`에서 `POST /ai/home-recommend` API 구현
- [ ] GPT 프롬프트 예시:
  ```
  사용자의 전공은 "컴퓨터공학"이고 학력은 "4년제 대학"입니다.
  이 사용자에게 적합한 자격증 시험 문제를 아래 DB 문제 목록 중 5개 선정해 주세요.
  선정 기준: 전공 연관성, 취업 연관성
  JSON 형식으로만 응답: { "recommended_question_ids": [1, 5, 12, 33, 40] }
  ```
- [ ] 고졸(`HIGH_SCHOOL`)은 전공 없이 일반 인기 자격증 기반 추천

**4단계: AI 문제 생성 API — 반복학습 핵심 기능 (Day 7~8)**

> 오답 노트의 취약 단원을 기반으로 GPT가 유사 문제를 직접 만들어 반복 학습시키는 기능입니다.

요청 데이터: 취약 단원명 + 원본 오답 문제 내용

```json
{
  "user_id": 1,
  "weak_unit": "SQL JOIN",
  "source_question": {
    "id": 15,
    "content": "다음 중 INNER JOIN의 설명으로 옳은 것은?",
    "correct_answer": 2,
    "explanation": "INNER JOIN은 두 테이블에서 조건에 맞는 행만 반환합니다."
  }
}
```

- [ ] `question_generate.py`에서 `POST /ai/generate/questions` API 구현
- [ ] GPT 프롬프트 설계:
  ```
  당신은 자격증 시험 문제 출제 전문가입니다.
  아래 기출 문제와 비슷한 난이도·유형의 새 문제를 1개 만들어 주세요.
  
  [단원]: SQL JOIN
  [참고 기출 문제]: "다음 중 INNER JOIN의 설명으로 옳은 것은?"
  
  반드시 아래 JSON 형식으로만 응답하세요:
  {
    "content": "문제 내용",
    "choices": ["보기1", "보기2", "보기3", "보기4"],
    "correct_answer": 2,
    "explanation": "해설 내용"
  }
  ```
- [ ] 생성된 문제를 `ai_generated_questions` 테이블에 저장
- [ ] 사용자가 풀면 정오답 업데이트 → 오답이면 다시 생성 요청 가능

**5단계: 자격증 추천 API (Day 7~8)**

요청 데이터: 과목별 정답률 + 현재 학습 중인 자격증 정보

- [ ] `cert_recommend.py`에서 `POST /ai/recommend/certifications` API 구현
- [ ] 강점 과목 기반으로 어울리는 자격증 추천 + 이유 제공

**6단계: 학습경로 + 진로 추천 API (Day 8~9)**

- [ ] `roadmap.py`에서 `POST /ai/recommend/roadmap` API 구현
- [ ] 추천 자격증 기반 단계별 학습 순서 제안
- [ ] 해당 자격증 취득 후 관련 직무 추천

**7단계: 백엔드 연동 테스트 (Day 9)**

- [ ] 백엔드 팀원과 함께 실제 데이터로 연동 테스트
- [ ] 응답 속도 확인 (GPT 호출은 느릴 수 있음, 보통 3~10초)
- [ ] 에러 처리 추가 (OpenAI API 오류 시 적절한 오류 메시지 반환)

---

#### 프롬프트 작성 팁 (초보자용)

GPT에게 명확하게 지시하는 것이 핵심입니다.

**좋은 프롬프트 구조:**
```
[시스템 역할 설명]
당신은 자격증 시험 학습 전문가입니다.
사용자의 학습 데이터를 분석하여 취약 단원을 파악하고 개선 방향을 제시합니다.

[데이터]
사용자의 단원별 정답률:
- SQL JOIN: 30% (10회 시도)
- 인덱스: 80% (5회 시도)

[지시]
위 데이터를 분석하여 아래 JSON 형식으로만 응답하세요:
{
  "weak_units": ["단원명"],
  "analysis": "분석 내용",
  "priority": "우선 학습 방향"
}
```

---

## 8. 2주 일정표

> **원칙**: 하루가 밀려도 다음 날을 늘리지 말고 기능을 줄이세요.  
> 마지막 이틀(Day 13~14)은 통합 · 버그 수정 · 배포 전용입니다.

---

### 🔵 1주차

#### Day 1 (월) — 전원 함께: 환경 세팅 & 킥오프

| 역할 | 작업 내용 |
|------|----------|
| **전원** | 각자 PC에 개발 도구 전부 설치 |
| **전원** | GitHub 레포 3개 생성 (backend, frontend, ai) |
| **전원** | 카카오톡 오픈채팅 또는 디스코드 팀 채널 만들기 |
| **전원** | 이 가이드 전체 읽기 (각자 담당 섹션 꼼꼼히) |
| **백엔드** | Spring Boot 프로젝트 생성 → GitHub push |
| **프론트** | Vite 프로젝트 생성 → GitHub push |
| **AI** | FastAPI 프로젝트 생성 → GitHub push + **PDF 파싱 스크립트 시작** |

**오늘의 목표**: 3개 프로젝트 모두 실행되고 GitHub에 올라가 있음 + AI는 PDF 파싱 스크립트 초안 완성

---

#### Day 2 (화) — 전원 함께: DB & API 명세 확정 (가장 중요한 날!)

| 역할 | 작업 내용 |
|------|----------|
| **전원** | 오전 10시: 화상/대면 미팅 — DB 설계 검토 및 확정 |
| **전원** | API 명세 표를 팀 채널에 공유하고 이견 조율 |
| **백엔드** | MySQL DB 생성, JPA Entity 9개 작성 시작 |
| **프론트** | 라우팅 설정 + Navbar 컴포넌트 제작 |
| **AI** | FastAPI 기본 서버 실행, OpenAI 연동 테스트 |

**오늘의 결과물**: 확정된 DB 설계 문서 + API 명세 표 (팀 채널 공유)

> 🔴 **주의**: 이 날 API 명세가 확정되지 않으면 이후 연동이 꼬입니다.  
> 애매한 부분은 가장 단순한 쪽으로 결정하고 넘어가세요.

---

#### Day 3 (수) — 각자: 인증 기능 개발

| 역할 | 작업 내용 |
|------|----------|
| **백엔드** | JPA Entity 완성 + 회원가입 · 로그인 · JWT API 3개 완성 |
| **프론트** | 회원가입 페이지 + 로그인 페이지 UI 완성 |
| **AI** | schemas.py 작성, 취약 단원 분석 프롬프트 초안 작성 |

**저녁 (Slack/카카오): 백엔드 ↔ 프론트 로그인 API 연동 간단 테스트**

---

#### Day 4 (목) — 각자: 자격증 · 시험 목록

| 역할 | 작업 내용 |
|------|----------|
| **백엔드** | 자격증 / 시험 / 문제 API 완성 |
| **프론트** | 자격증 목록 페이지 + 시험 목록 페이지 UI 완성 |
| **AI** | **PDF 파싱 + DB 업로드 완성** (모든 문제 DB에 저장 완료) + 취약 단원 분석 API 1차 완성 |

**저녁: 백엔드 → 프론트 자격증 목록 API 연동 확인 / AI → 백엔드 DB에 문제 저장 확인**

---

#### Day 5 (금) — 각자: 문제풀이 화면 착수

| 역할 | 작업 내용 |
|------|----------|
| **백엔드** | 시험 시작 · 답안 저장 · 제출 · 채점 API 완성 |
| **프론트** | CBT 문제풀이 화면 UI 완성 (더미 데이터 사용 가능) |
| **AI** | 전공 기반 홈 추천 API (`POST /ai/home-recommend`) 완성 |

**금요일 저녁: 1주차 팀 미팅 (필수 참석)**
- 각자 진행 상황 공유 (5분씩)
- PDF 파싱 결과 확인 (문제 수, 파싱 오류 여부)
- 막히는 부분 공유 → 해결 방향 논의
- 2주차 일정 점검 및 조정

---

### 🟢 2주차

#### Day 6 (월) — 각자: 채점 결과 · 오답 노트

| 역할 | 작업 내용 |
|------|----------|
| **백엔드** | 오답 노트 API + 통계 API 전체 완성 + AI 생성 문제 풀기 API 추가 |
| **프론트** | 채점 결과 페이지 + 오답 노트 페이지 UI 완성 |
| **AI** | 자격증 추천 API (`POST /ai/recommend/certifications`) 완성 |

---

#### Day 7 (화) — 각자: 통계 · AI 화면

| 역할 | 작업 내용 |
|------|----------|
| **백엔드** | 통계 API 완성 + AI 서버 연동 코드 작성 시작 |
| **프론트** | 통계 / 대시보드 페이지 완성 (Recharts 차트 적용) + 홈 화면 AI 추천 카드 UI |
| **AI** | **AI 문제 생성 API** (`POST /ai/generate/questions`) 완성 + 학습경로 추천 API |

---

#### Day 8 (수) — 전원 함께: 1차 통합 테스트 (중요!)

| 역할 | 작업 내용 |
|------|----------|
| **전원** | 오전 10시: 화상/대면 미팅 — 전체 흐름 통합 테스트 |
| **백엔드 ↔ 프론트** | 회원가입(전공 포함) → 로그인 → 홈 추천 → 문제풀이 → 채점 → 오답 → AI 문제 생성 전체 흐름 테스트 |
| **백엔드 ↔ AI** | 백엔드에서 FastAPI 호출 연동 테스트 (홈 추천, 취약 분석, 문제 생성) |
| **프론트** | AI 분석 결과 페이지 + AI 생성 문제 풀이 UI 연동 |

**발견된 버그를 GitHub Issue에 등록 → 담당자 배정**

---

#### Day 9 (목) — 버그 수정 + UI 다듬기

| 역할 | 작업 내용 |
|------|----------|
| **백엔드** | 버그 수정 + API 응답 형식 정리 |
| **프론트** | 버그 수정 + 반응형 UI 점검 (모바일 화면 깨짐 확인) + 로딩 · 에러 처리 |
| **AI** | GPT 응답 품질 개선 (프롬프트 수정) + 에러 처리 |

---

#### Day 10 (금) — Docker 세팅 + 배포 준비

| 역할 | 작업 내용 |
|------|----------|
| **전원** | Docker Desktop 설치 |
| **백엔드** | Dockerfile 작성 |
| **프론트** | Dockerfile 작성 |
| **AI** | Dockerfile 작성 |
| **백엔드** | docker-compose.yml 작성 (전체 서비스 통합) |

---

#### Day 11 (토) — AWS EC2 배포

| 역할 | 작업 내용 |
|------|----------|
| **백엔드 (리드)** | EC2 인스턴스 생성 + Docker 설치 + 배포 |
| **프론트** | EC2 배포 결과 브라우저 테스트 |
| **AI** | 배포 환경에서 OpenAI API 연동 확인 |

---

#### Day 12 (일) — 최종 테스트 + 마무리

| 역할 | 작업 내용 |
|------|----------|
| **전원** | 배포된 URL에서 처음부터 끝까지 전체 흐름 테스트 |
| **전원** | README.md 작성 (프로젝트 소개, 실행 방법, 배포 URL) |
| **전원** | 최종 체크리스트 확인 |

---

### 일정 요약 표

| 일자 | 주요 작업 | 팀 소통 |
|------|----------|---------|
| Day 1 (월) | 환경 세팅, 프로젝트 생성 | 킥오프 미팅 |
| Day 2 (화) | DB & API 명세 확정 | **필수 미팅** |
| Day 3 (수) | 인증 기능 개발 | 저녁 연동 확인 |
| Day 4 (목) | 자격증·시험 API & 화면 | 저녁 연동 확인 |
| Day 5 (금) | 문제풀이 API & 화면 | **1주차 미팅** |
| Day 6 (월) | 채점·오답 API & 화면 | 개별 진행 |
| Day 7 (화) | 통계 API & 화면 | 개별 진행 |
| Day 8 (수) | 전체 통합 테스트 | **필수 미팅** |
| Day 9 (목) | 버그 수정, UI 다듬기 | 개별 진행 |
| Day 10 (금) | Docker 세팅 | 저녁 확인 |
| Day 11 (토) | EC2 배포 | 실시간 소통 |
| Day 12 (일) | 최종 테스트 & 마무리 | **최종 미팅** |

---

## 9. 팀 소통 가이드

### 필수 팀 미팅 일정

총 4번의 전원 참석 필수 미팅이 있습니다.

| 시점 | 시간 | 목적 |
|------|------|------|
| Day 1 오전 | 10:00 (30분) | 킥오프 — 역할 확인, 일정 합의 |
| Day 2 오전 | 10:00 (1시간) | DB 설계 + API 명세 최종 확정 |
| Day 5 저녁 | 20:00 (1시간) | 1주차 진행상황 점검 + 2주차 조정 |
| Day 8 오전 | 10:00 (2시간) | 통합 테스트 + 버그 목록 정리 |
| Day 12 오후 | 14:00 (1시간) | 최종 확인 + 완료 선언 |

---

### 일상 소통 채널 운영

**추천 도구**: 카카오톡 오픈채팅 또는 Discord

**채널 구성 예시**:
- `#공지` — 중요한 결정사항만
- `#백엔드` — 백엔드 관련 질문/논의
- `#프론트` — 프론트 관련 질문/논의
- `#AI` — AI 서버 관련 질문/논의
- `#연동이슈` — API 연동 중 발생한 문제
- `#잡담` — 자유롭게

---

### 소통 규칙

**매일 지켜야 할 것**

- 매일 저녁 9시까지 팀 채널에 오늘 한 일 간단히 공유
  ```
  예시:
  [백엔드] 오늘 한 일:
  ✅ 회원가입 API 완성
  ✅ JWT 토큰 발급 완성
  🔧 로그인 시 500 오류 발생 중 → 내일 해결 예정
  ```

- API 변경이 생기면 반드시 30분 안에 팀 채널에 공유
  ```
  예시:
  [백엔드→프론트] API 변경 알림
  /api/sessions/{id}/submit 응답 형식이 바뀌었어요.
  score 필드가 추가됐습니다.
  ```

- 막힌 게 있으면 혼자 3시간 이상 잡고 있지 말고 채팅에 물어보기

---

### 연동 포인트 별 담당자 소통

| 연동 포인트 | 프론트 담당 | 백엔드 담당 | 확인 시점 |
|------------|-----------|-----------|----------|
| 회원가입/로그인 | 프론트 전원 | 백엔드 전원 | Day 3 저녁 |
| 자격증 목록 | 프론트 | 백엔드 | Day 4 저녁 |
| 문제풀이 세션 | 프론트 | 백엔드 | Day 5 저녁 |
| 채점 결과 | 프론트 | 백엔드 | Day 6 저녁 |
| 오답 노트 | 프론트 | 백엔드 | Day 7 저녁 |
| 통계 차트 | 프론트 | 백엔드 | Day 7 저녁 |
| AI 분석 | 프론트 | 백엔드 ↔ AI | Day 8 미팅 |

---

### 문제 해결 우선순위

1. 본인이 30분 이상 고민해도 모르면 → **팀 채팅에 바로 질문**
2. 팀 내에서 해결 안 되면 → **Claude/ChatGPT에게 오류 메시지 복붙해서 질문**
3. 그래도 안 되면 → **해당 기능 잠깐 보류하고 다음 기능으로**

> 막힌다고 며칠씩 잡고 있으면 일정이 무너집니다.  
> 과감하게 기능을 줄이는 것도 실력입니다.

---

## 10. 공통 환경 세팅

> 3명 모두 이 섹션의 도구를 Day 1에 설치합니다.

### 전원 필수 설치 목록

| 도구 | 다운로드 | 용도 |
|------|---------|------|
| Git | https://git-scm.com/downloads | 버전 관리 |
| VS Code | https://code.visualstudio.com | 코드 편집기 |
| Postman | https://www.postman.com/downloads | API 테스트 |
| Docker Desktop | https://www.docker.com/products/docker-desktop | 컨테이너 |

### Git 최초 설정 (1번만)

터미널에서 아래 명령어 입력:
```
git config --global user.name "본인 이름"
git config --global user.email "GitHub 가입 이메일"
```

### GitHub 공통 설정

- Organization 생성 또는 팀장 GitHub 계정에서 레포 3개 생성
- 팀원들을 Collaborator로 초대 (레포 Settings → Collaborators)
- `develop` 브랜치를 기본 브랜치로 설정

---

## 11. 배포 가이드 (Docker + EC2)

> Day 10~11에 진행합니다. 백엔드 팀원이 리드하고 전원 함께 진행합니다.

### 11-1. 각 서비스 Dockerfile 개요

**백엔드 (Spring Boot)**
- Java 17 기반 이미지 사용
- JAR 파일을 빌드 후 실행
- 포트: 8080

**프론트엔드 (React + Vite)**
- Node.js 이미지로 빌드
- Nginx로 정적 파일 서빙
- 포트: 80 (또는 3000)

**AI 서버 (FastAPI)**
- Python 3.11 이미지 사용
- requirements.txt 기반 패키지 설치
- 포트: 8000

### 11-2. docker-compose.yml 구조 개요

백엔드 팀원이 최상위 폴더에 `docker-compose.yml`을 작성합니다.

포함될 서비스:
- `db` — MySQL 8.0
- `backend` — Spring Boot (db에 의존)
- `ai` — FastAPI
- `frontend` — React (Nginx)

각 서비스는 같은 Docker 네트워크 안에서 서비스 이름으로 서로를 호출합니다.
예: 백엔드에서 AI 서버 호출 시 `http://ai:8000`

### 11-3. AWS EC2 세팅 순서

1. **AWS 계정 생성** (없으면 생성, 카드 등록 필요)
2. **EC2 인스턴스 생성**
   - AMI: Ubuntu 22.04 LTS 선택
   - 인스턴스 타입: t2.micro (프리티어 / 무료)
   - 키 페어 생성 → `.pem` 파일 다운로드 (잃어버리면 안됨!)
   - 보안 그룹: 포트 22(SSH), 80, 8080, 8000 열기
3. **EC2에 SSH 접속**
   ```
   ssh -i 키파일.pem ubuntu@EC2_퍼블릭_IP
   ```
4. **Docker 설치** (EC2 접속 후)
   ```
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker ubuntu
   ```
5. **코드 배포**
   - GitHub에서 각 레포 clone
   - `.env` 파일 생성 (절대 GitHub에 올리면 안 됨)
   - `docker-compose up -d` 실행
6. **브라우저 확인**
   - `http://EC2_IP` → 프론트 화면 확인

### 11-4. 환경변수 (.env) 관리

배포 서버의 `.env` 파일에는 아래 정보를 입력합니다.

**백엔드 `.env`**
```
DB_URL=jdbc:mysql://db:3306/qgichul_db
DB_USERNAME=root
DB_PASSWORD=강력한비밀번호
JWT_SECRET=32자이상랜덤문자열
AI_SERVER_URL=http://ai:8000
```

**AI 서버 `.env`**
```
OPENAI_API_KEY=sk-...실제키...
```

> 이 파일들은 절대 GitHub에 올리면 안 됩니다.  
> 팀원 간에는 카카오톡 DM이나 구글 드라이브로 공유하세요.

---

## 12. 최종 체크리스트

### 기능 완성 체크리스트

**인증 및 회원가입**
- [ ] 회원가입 가능 (이름, 학력, 전공 포함)
- [ ] 학력이 고졸이면 전공 필드 숨김
- [ ] 로그인 → JWT 토큰 발급 → 자동 저장
- [ ] 로그아웃 → 토큰 삭제 → 로그인 화면으로 이동
- [ ] 로그인 안 한 사용자가 메인 페이지 접근 시 로그인 화면으로 이동

**PDF 파싱 & 데이터**
- [ ] comcbt.com PDF 파싱 완료 → DB에 문제 전부 저장됨
- [ ] questions / choices / exams 테이블에 데이터 정상 존재

**홈 화면 추천**
- [ ] 로그인 후 홈 화면에 전공 기반 AI 추천 문제 카드 표시

**문제풀이**
- [ ] 자격증 목록 → 시험 선택 → 시험 시작 가능
- [ ] 문제 이전 / 다음 이동 가능
- [ ] 답 선택 시 서버에 임시 저장됨 (새로고침해도 유지)
- [ ] 제출 후 채점 결과 확인 가능
- [ ] 채점 결과에 점수, 정답 수, 오답 수 표시

**오답 노트**
- [ ] 틀린 문제 자동으로 오답 노트에 저장됨
- [ ] 오답 노트에서 정답 / 내 답 / 해설 확인 가능
- [ ] 메모 작성 및 수정 가능

**통계**
- [ ] 전체 정답률 표시
- [ ] 과목별 정답률 차트 표시
- [ ] 최근 점수 추이 차트 표시

**AI 분석 + 반복학습**
- [ ] AI 분석 요청 → 취약 단원 분석 결과 표시
- [ ] 취약 단원 기반 AI 문제 생성 완료 (오답 노트에서 실행 가능)
- [ ] AI 생성 문제 풀기 → 정오답 저장 → 오답 시 추가 문제 재생성

### 기술 체크리스트

- [ ] 모든 API에 JWT 인증 적용 (로그인 없이 접근 불가)
- [ ] `.env` 파일이 GitHub에 올라가지 않음
- [ ] Docker로 로컬 실행 가능 (`docker-compose up`)
- [ ] EC2 배포 후 브라우저에서 정상 접속 가능
- [ ] README.md 작성 (배포 URL, 실행 방법, 팀원 소개)

### README.md 필수 포함 내용

```
# 큐기출

## 서비스 소개
[한 줄 소개]

## 배포 URL
http://EC2_퍼블릭_IP

## 팀원
- 백엔드: [이름]
- 프론트엔드: [이름]
- AI: [이름]

## 기능
[핵심 기능 목록]

## 기술 스택
[표로 정리]

## 실행 방법 (로컬)
[단계별 설명]
```

---

## 📌 부록: 자주 발생하는 문제 & 해결법

| 상황 | 원인 | 해결 방법 |
|------|------|----------|
| 프론트에서 API 호출 시 CORS 오류 | 백엔드 CORS 설정 누락 | `WebConfig.java`에서 `http://localhost:3000` 허용 추가 |
| JWT 토큰이 만료됐다는 오류 | 토큰 유효시간 지남 | 로그아웃 후 재로그인, 또는 만료시간 늘리기 |
| API 요청 시 401 Unauthorized | 헤더에 토큰 미첨부 | axiosInstance에서 `Authorization: Bearer ${token}` 자동 첨부 설정 |
| GPT 응답이 JSON이 아님 | 프롬프트에 JSON 지시 미흡 | 프롬프트에 "JSON으로만 응답하세요" 명시 + JSON 모드 활성화 |
| Docker 빌드 오류 | Dockerfile 경로 문제 | 각 서비스 루트 폴더에서 빌드하는지 확인 |
| EC2 접속 안됨 | 보안 그룹 포트 미열림 | AWS 콘솔 → EC2 → 보안 그룹 → 인바운드 규칙에 해당 포트 추가 |
| MySQL 연결 오류 (Spring Boot) | DB URL / 비밀번호 오타 | `application.properties` 설정 재확인 |
| `git push` 거부됨 | 팀원이 먼저 push함 | `git pull origin develop` 후 다시 push |

---

**문서 버전**: v2.0  
**작성 기준일**: 2026-04-29  
**주요 변경사항 (v1 → v2)**:
- PDF 파싱 파이프라인 (comcbt.com → DB) 추가
- 회원가입 필드 확장 (이름, 학력, 전공)
- 전공 기반 홈 화면 AI 추천 기능 추가
- AI 문제 생성 기반 반복학습 기능 추가 (오답 노트 연계)
- ai_generated_questions 테이블 신규 설계
**프로젝트**: 큐기출 — AI 기반 자격증 CBT 학습 추천 서비스  
**팀 구성**: 백엔드 1인 · 프론트엔드 1인 · AI 1인  
**목표 기간**: 12일 (2주)

> 💡 **막히면 바로 팀원에게 물어보세요.**  
> 혼자 3시간 이상 잡고 있는 것보다 10분 질문이 훨씬 효율적입니다.  
> 완벽한 코드보다 **돌아가는 서비스**가 우선입니다.
