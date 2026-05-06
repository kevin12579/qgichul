package com.qgichul.backend.repository;

import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.entity.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
    // 내 모든 시험 기록 가져오기 (제출 완료된 것만)
    List<ExamSession> findByUserEmailAndStatus(String email, String status);

    // 자격증 필터링된 응시 기록
    List<ExamSession> findByUserEmailAndStatusAndExamCertificationId(String email, String status, Long certificationId);

    // 최근 10회 시험 기록 가져오기 (최신순 정렬)
    List<ExamSession> findTop10ByUserEmailAndStatusOrderBySubmittedAtDesc(String email, String status);

    List<ExamSession> findTop10ByUserEmailAndStatusAndExamCertificationIdOrderBySubmittedAtDesc(
            String email, String status, Long certificationId);

    // 사용자가 응시한 자격증 목록 (distinct)
    @Query("SELECT DISTINCT s.exam.certification FROM ExamSession s " +
           "WHERE s.user.email = :email AND s.status = 'SUBMITTED'")
    List<Certification> findDistinctCertificationsByUserEmail(@Param("email") String email);
}