package com.qgichul.backend.repository;
import com.qgichul.backend.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCertificationId(Long certId);
    Optional<Exam> findByCertificationIdAndYearAndSession(Long certId, Integer year, Integer session);
}