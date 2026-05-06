package com.qgichul.backend.controller;

import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.entity.Exam;
import com.qgichul.backend.service.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}