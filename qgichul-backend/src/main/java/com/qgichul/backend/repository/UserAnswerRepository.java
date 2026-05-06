package com.qgichul.backend.repository;

import com.qgichul.backend.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {

    List<UserAnswer> findByExamSessionUserEmail(String email);

    List<UserAnswer> findByExamSessionUserEmailAndExamSessionExamCertificationId(String email, Long certificationId);

    List<UserAnswer> findByExamSessionUserEmailAndIsCorrectFalse(String email);

    List<UserAnswer> findByExamSessionIdAndIsCorrectFalse(Long sessionId);

    /** 가이드 v2: gradeBySession 채점에서 사용 */
    List<UserAnswer> findByExamSessionId(Long sessionId);

    Optional<UserAnswer> findByExamSessionIdAndQuestionId(Long sessionId, Long questionId);
}
