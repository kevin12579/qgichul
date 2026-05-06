-- 큐기출 MySQL 초기화 스크립트
-- docker-compose 최초 실행 시 자동으로 한 번만 실행됨
-- (MYSQL_DATABASE 환경변수로 DB는 이미 생성되므로 USE만 선언)

USE qgichul;

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    name          VARCHAR(50)  NOT NULL,
    nickname      VARCHAR(50)  NOT NULL,
    education_level VARCHAR(20) NOT NULL,
    major         VARCHAR(100),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS certifications (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    category    VARCHAR(50)  NOT NULL,
    description TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exams (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    certification_id BIGINT       NOT NULL,
    title            VARCHAR(200) NOT NULL,
    year             INT          NOT NULL,
    session          INT          NOT NULL,
    duration_min     INT          NOT NULL,
    total_questions  INT          NOT NULL,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (certification_id) REFERENCES certifications(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_id   BIGINT       NOT NULL,
    name      VARCHAR(100) NOT NULL,
    order_num INT          NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS questions (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_id        BIGINT,
    subject_id     BIGINT,
    unit           VARCHAR(100) NOT NULL,
    question_num   INT          NOT NULL,
    content        TEXT         NOT NULL,
    difficulty     TINYINT      NOT NULL,
    correct_answer TINYINT      NOT NULL,
    explanation    TEXT,
    FOREIGN KEY (exam_id)    REFERENCES exams(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS choices (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT   NOT NULL,
    choice_num  TINYINT  NOT NULL,
    content     TEXT     NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exam_sessions (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    exam_id       BIGINT       NOT NULL,
    score         DOUBLE,
    correct_count INT,
    total_count   INT,
    status        VARCHAR(20),
    started_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    submitted_at  DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exam_id) REFERENCES exams(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_answers (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id      BIGINT NOT NULL,
    question_id     BIGINT NOT NULL,
    selected_answer INT,
    is_correct      BOOLEAN,
    answered_at     DATETIME,
    FOREIGN KEY (session_id)  REFERENCES exam_sessions(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wrong_note_memos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    memo        TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_generated_questions (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT NOT NULL,
    source_question_id BIGINT,
    unit               VARCHAR(100),
    content            TEXT    NOT NULL,
    choice_1           TEXT    NOT NULL,
    choice_2           TEXT    NOT NULL,
    choice_3           TEXT    NOT NULL,
    choice_4           TEXT    NOT NULL,
    correct_answer     TINYINT,
    explanation        TEXT,
    user_answer        TINYINT,
    is_correct         BOOLEAN,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)            REFERENCES users(id),
    FOREIGN KEY (source_question_id) REFERENCES questions(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
