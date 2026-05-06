package com.qgichul.backend.repository;

import com.qgichul.backend.entity.AiGeneratedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiGeneratedQuestionRepository extends JpaRepository<AiGeneratedQuestion, Long> {
    List<AiGeneratedQuestion> findByUserEmail(String email);
}