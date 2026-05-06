package com.qgichul.backend.controller;

import com.qgichul.backend.entity.Exam;
import com.qgichul.backend.entity.Question;
import com.qgichul.backend.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    // 특정 시험의 문제 목록 조회
    @GetMapping("/{examId}/questions")
    public ResponseEntity<List<Question>> getQuestions(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getQuestionsByExamId(examId));
    }

    @GetMapping("/{examId}")
    public ResponseEntity<Exam> getExamDetail(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getExamById(examId));
    }
}