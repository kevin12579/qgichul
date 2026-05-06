package com.qgichul.backend.service;

import com.qgichul.backend.dto.response.*;
import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.entity.ExamSession;
import com.qgichul.backend.entity.UserAnswer;
import com.qgichul.backend.repository.ExamSessionRepository;
import com.qgichul.backend.repository.UserAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ExamSessionRepository examSessionRepository;
    private final UserAnswerRepository userAnswerRepository;

    public SummaryDto getSummary(String email, Long certId) {
        List<ExamSession> sessions = certId == null
                ? examSessionRepository.findByUserEmailAndStatus(email, "SUBMITTED")
                : examSessionRepository.findByUserEmailAndStatusAndExamCertificationId(email, "SUBMITTED", certId);
        int totalExams = sessions.size();
        double totalScoreSum = sessions.stream().mapToDouble(ExamSession::getScore).sum();
        double overallRate = totalExams > 0 ? Math.round((totalScoreSum / totalExams) * 10) / 10.0 : 0.0;
        return new SummaryDto(totalExams, overallRate);
    }

    public List<SubjectStatDto> getSubjectStats(String email, Long certId) {
        List<UserAnswer> answers = certId == null
                ? userAnswerRepository.findByExamSessionUserEmail(email)
                : userAnswerRepository.findByExamSessionUserEmailAndExamSessionExamCertificationId(email, certId);
        Map<String, int[]> statsMap = new HashMap<>();
        for (UserAnswer answer : answers) {
            String subjectName = answer.getQuestion().getSubject().getName();
            statsMap.putIfAbsent(subjectName, new int[]{0, 0});
            statsMap.get(subjectName)[1]++;
            if (Boolean.TRUE.equals(answer.getIsCorrect())) {
                statsMap.get(subjectName)[0]++;
            }
        }
        return statsMap.entrySet().stream()
                .map(e -> new SubjectStatDto(
                        e.getKey(),
                        e.getValue()[1] > 0 ? Math.round(((double) e.getValue()[0] / e.getValue()[1]) * 1000) / 10.0 : 0.0,
                        e.getValue()[0],
                        e.getValue()[1]))
                .collect(Collectors.toList());
    }

    public List<HistoryDto> getHistory(String email, Long certId) {
        List<ExamSession> recentSessions = certId == null
                ? examSessionRepository.findTop10ByUserEmailAndStatusOrderBySubmittedAtDesc(email, "SUBMITTED")
                : examSessionRepository.findTop10ByUserEmailAndStatusAndExamCertificationIdOrderBySubmittedAtDesc(email, "SUBMITTED", certId);
        return recentSessions.stream()
                .map(s -> new HistoryDto(s.getId(), s.getExam().getTitle(), s.getScore(), s.getSubmittedAt()))
                .collect(Collectors.toList());
    }

    public List<UnitStatDto> getUnitStats(String email, Long certId) {
        List<UserAnswer> allAnswers = certId == null
                ? userAnswerRepository.findByExamSessionUserEmail(email)
                : userAnswerRepository.findByExamSessionUserEmailAndExamSessionExamCertificationId(email, certId);
        Map<String, int[]> unitMap = new HashMap<>(); // [맞힌수, 전체수]

        for (UserAnswer ans : allAnswers) {
            String unit = ans.getQuestion().getUnit();
            unitMap.putIfAbsent(unit, new int[]{0, 0});
            unitMap.get(unit)[1]++;
            if (Boolean.TRUE.equals(ans.getIsCorrect())) unitMap.get(unit)[0]++;
        }

        return unitMap.entrySet().stream()
                .map(e -> new UnitStatDto(e.getKey(),
                        e.getValue()[1] > 0 ? (double) e.getValue()[0] / e.getValue()[1] * 100 : 0,
                        e.getValue()[1]))
                .collect(Collectors.toList());
    }

    public List<Certification> getTakenCertifications(String email) {
        return examSessionRepository.findDistinctCertificationsByUserEmail(email);
    }
}
