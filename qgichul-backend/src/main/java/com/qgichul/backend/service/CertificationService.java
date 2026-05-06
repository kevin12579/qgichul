package com.qgichul.backend.service;

import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.entity.Exam;
import com.qgichul.backend.repository.CertificationRepository;
import com.qgichul.backend.repository.ExamRepository; // ⭐️ 추가
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final ExamRepository examRepository; // ⭐️ 추가 (이게 있어야 getExams... 가능)

    // 전체 자격증 목록 조회
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    // 자격증 상세 정보 조회 (추가)
    public Certification getCertificationById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("자격증 정보를 찾을 수 없습니다."));
    }

    // 해당 자격증에 속한 시험 목록 조회 (추가)
    public List<Exam> getExamsByCertificationId(Long certId) {
        return examRepository.findByCertificationId(certId);
    }
}