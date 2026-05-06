package com.qgichul.backend.service;

import com.qgichul.backend.entity.Exam;
import com.qgichul.backend.entity.Question;
import com.qgichul.backend.repository.ExamRepository; // ⭐️ 추가
import com.qgichul.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository; // ⭐️ 이게 선언되어 있어야 에러가 안 납니다!

    // 특정 시험 상세 조회 (추가)
    public Exam getExamById(Long examId) {
        return examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("시험을 찾을 수 없습니다."));
    }

    // 특정 시험의 문제 목록 조회
    public List<Question> getQuestionsByExamId(Long examId) {
        return questionRepository.findByExamId(examId);
    }
}