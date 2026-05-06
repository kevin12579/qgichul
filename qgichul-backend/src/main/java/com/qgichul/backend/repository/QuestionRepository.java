package com.qgichul.backend.repository;

import com.qgichul.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // 특정 시험(exam_id)에 속한 모든 문제들을 가져오는 마법의 메서드
    List<Question> findByExamId(Long examId);
}