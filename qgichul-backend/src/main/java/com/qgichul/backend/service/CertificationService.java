package com.qgichul.backend.service;

import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.entity.Exam;
import com.qgichul.backend.repository.CertificationRepository;
import com.qgichul.backend.repository.ExamRepository;
import com.qgichul.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    public Certification getCertificationById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("자격증 정보를 찾을 수 없습니다."));
    }

    public List<Exam> getExamsByCertificationId(Long certId) {
        return examRepository.findByCertificationId(certId).stream()
                .map(e -> Exam.builder()
                        .id(e.getId())
                        .certification(e.getCertification())
                        .title(e.getTitle())
                        .year(e.getYear())
                        .session(e.getSession())
                        .durationMin(e.getDurationMin())
                        .totalQuestions(questionRepository.countByExamId(e.getId()))
                        .createdAt(e.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}