package com.qgichul.backend.service;

import com.qgichul.backend.dto.request.SubmitAnswerRequest;
import com.qgichul.backend.dto.response.SubmitResultResponse;
import com.qgichul.backend.entity.*;
import com.qgichul.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final QuestionRepository questionRepository;
    private final ExamSessionRepository examSessionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;

    @Transactional
    public Long startSession(String userEmail, Long examId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("유저 찾을 수 없음"));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("시험 찾을 수 없음"));

        ExamSession session = ExamSession.builder()
                .user(user)
                .exam(exam)
                .totalCount(questionRepository.countByExamId(examId))
                .status("IN_PROGRESS")
                .startedAt(LocalDateTime.now())
                .build();

        return examSessionRepository.save(session).getId();
    }

    /**
     * 임시저장된 답안만으로 채점 (가이드 v2: submit body 없음)
     */
    @Transactional
    public SubmitResultResponse gradeBySession(Long sessionId) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션 없음"));

        List<UserAnswer> answers = userAnswerRepository.findByExamSessionId(sessionId);

        int correctCount = (int) answers.stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsCorrect()))
                .count();

        int total = session.getTotalCount() != null ? session.getTotalCount() : answers.size();
        double score = total > 0
                ? Math.round(((double) correctCount / total) * 1000) / 10.0
                : 0.0;

        session.setCorrectCount(correctCount);
        session.setScore(score);
        session.setStatus("SUBMITTED");
        session.setSubmittedAt(LocalDateTime.now());
        examSessionRepository.save(session);

        return SubmitResultResponse.builder()
                .totalQuestions(total)
                .correctCount(correctCount)
                .wrongCount(total - correctCount)
                .score(score)
                .build();
    }

    /**
     * (구) 일괄 채점 — body에 답안 리스트가 들어오는 케이스를 위해 보존.
     */
    @Transactional
    public SubmitResultResponse submitAndGrade(Long sessionId, SubmitAnswerRequest request) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("시험 세션을 찾을 수 없습니다."));

        int correctCount = 0;
        int totalQuestions = request.getAnswers().size();

        for (SubmitAnswerRequest.AnswerDto answerDto : request.getAnswers()) {
            Question question = questionRepository.findById(answerDto.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("문제 없음"));

            boolean isCorrect = answerDto.getSelectedAnswer() != null
                    && answerDto.getSelectedAnswer().equals(question.getCorrectAnswer());
            if (isCorrect) correctCount++;

            UserAnswer userAnswer = UserAnswer.builder()
                    .examSession(session)
                    .question(question)
                    .selectedAnswer(answerDto.getSelectedAnswer())
                    .isCorrect(isCorrect)
                    .answeredAt(LocalDateTime.now())
                    .build();
            userAnswerRepository.save(userAnswer);
        }

        double score = totalQuestions > 0
                ? Math.round(((double) correctCount / totalQuestions) * 1000) / 10.0
                : 0.0;
        session.setScore(score);
        session.setCorrectCount(correctCount);
        session.setStatus("SUBMITTED");
        session.setSubmittedAt(LocalDateTime.now());
        examSessionRepository.save(session);

        return SubmitResultResponse.builder()
                .totalQuestions(totalQuestions)
                .correctCount(correctCount)
                .wrongCount(totalQuestions - correctCount)
                .score(score)
                .build();
    }

    public ExamSession getSessionById(Long sessionId) {
        return examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션 정보를 찾을 수 없습니다."));
    }

    public SubmitResultResponse getSessionResult(Long sessionId) {
        ExamSession session = getSessionById(sessionId);
        int total = session.getTotalCount() != null ? session.getTotalCount() : 0;
        int correct = session.getCorrectCount() != null ? session.getCorrectCount() : 0;
        return SubmitResultResponse.builder()
                .totalQuestions(total)
                .correctCount(correct)
                .wrongCount(total - correct)
                .score(session.getScore() != null ? session.getScore() : 0.0)
                .build();
    }

    @Transactional
    public void saveTempAnswer(Long sessionId, SubmitAnswerRequest.AnswerDto answerDto) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션 없음"));
        Question question = questionRepository.findById(answerDto.getQuestionId())
                .orElseThrow(() -> new RuntimeException("문제 없음"));

        UserAnswer userAnswer = userAnswerRepository
                .findByExamSessionIdAndQuestionId(sessionId, answerDto.getQuestionId())
                .orElse(UserAnswer.builder()
                        .examSession(session)
                        .question(question)
                        .build());

        userAnswer.setSelectedAnswer(answerDto.getSelectedAnswer());
        userAnswer.setAnsweredAt(LocalDateTime.now());

        if (answerDto.getSelectedAnswer() != null) {
            userAnswer.setIsCorrect(answerDto.getSelectedAnswer().equals(question.getCorrectAnswer()));
        } else {
            userAnswer.setIsCorrect(false);
        }

        userAnswerRepository.save(userAnswer);
    }
}
