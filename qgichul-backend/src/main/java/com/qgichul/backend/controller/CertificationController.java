package com.qgichul.backend.controller;

import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.entity.Exam;
import com.qgichul.backend.service.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    @GetMapping
    public ResponseEntity<List<Certification>> getCertifications() {
        return ResponseEntity.ok(certificationService.getAllCertifications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certification> getCertDetail(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.getCertificationById(id));
    }

    @GetMapping("/{id}/exams")
    public ResponseEntity<List<Exam>> getExamsByCert(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.getExamsByCertificationId(id));
    }

    // 카테고리 목록
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(certificationService.getAllCategories());
    }

    // 카테고리별 등급 목록
    @GetMapping("/grades")
    public ResponseEntity<List<String>> getGrades(@RequestParam String category) {
        return ResponseEntity.ok(certificationService.getGradesByCategory(category));
    }

    // 카테고리 + 등급으로 자격증 목록
    @GetMapping("/by-grade")
    public ResponseEntity<List<Certification>> getCertsByGrade(
            @RequestParam String category,
            @RequestParam String grade) {
        return ResponseEntity.ok(certificationService.getCertificationsByCategoryAndGrade(category, grade));
    }

    // 카테고리별 전체 자격증 (fallback)
    @GetMapping("/by-category")
    public ResponseEntity<List<Certification>> getCertsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(certificationService.getCertificationsByCategory(category));
    }
}
