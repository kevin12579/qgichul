package com.qgichul.backend.service;

import com.qgichul.backend.entity.*;
import com.qgichul.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminImportService {

    @Value("${ai.server.url}")
    private String aiServerUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private final CertificationRepository certificationRepository;
    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;
    private final QuestionRepository questionRepository;

    @Transactional
    public Map<String, Object> importPdfsFromFolder(String folder) {
        String url = UriComponentsBuilder.fromHttpUrl(aiServerUrl)
                .path("/api/pdf/parse-folder")
                .queryParam("folder", folder)
                .toUriString();

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(new HashMap<>()),
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );

        List<Map<String, Object>> parsedExams = response.getBody();
        if (parsedExams == null) parsedExams = List.of();

        int imported = 0;
        int skipped = 0;
        int totalQuestions = 0;

        for (Map<String, Object> parsed : parsedExams) {
            String certName = (String) parsed.get("certification_name");
            Integer year = ((Number) parsed.get("year")).intValue();
            Integer session = ((Number) parsed.get("session")).intValue();
            Integer durationMin = ((Number) parsed.getOrDefault("duration_min", 150)).intValue();

            Certification cert = certificationRepository.findByName(certName)
                    .orElseGet(() -> certificationRepository.save(
                            Certification.builder().name(certName).category("기타").build()
                    ));

            if (examRepository.findByCertificationIdAndYearAndSession(cert.getId(), year, session).isPresent()) {
                skipped++;
                continue;
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> subjects = (List<Map<String, Object>>) parsed.getOrDefault("subjects", List.of());

            int qCount = subjects.stream()
                    .mapToInt(s -> ((List<?>) s.getOrDefault("questions", List.of())).size())
                    .sum();

            Exam exam = Exam.builder()
                    .certification(cert)
                    .title(certName + " " + year + "년 " + session + "회")
                    .year(year)
                    .session(session)
                    .durationMin(durationMin)
                    .totalQuestions(qCount)
                    .build();
            exam = examRepository.save(exam);

            for (Map<String, Object> s : subjects) {
                String subjectName = (String) s.get("name");
                Integer orderNum = ((Number) s.getOrDefault("order_num", 1)).intValue();
                Subject subject = Subject.builder()
                        .exam(exam)
                        .name(subjectName)
                        .orderNum(orderNum)
                        .build();
                subject = subjectRepository.save(subject);

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> questions = (List<Map<String, Object>>) s.getOrDefault("questions", List.of());

                for (Map<String, Object> q : questions) {
                    Question question = Question.builder()
                            .exam(exam)
                            .subject(subject)
                            .questionNum(((Number) q.get("question_num")).intValue())
                            .content((String) q.get("content"))
                            .unit((String) q.getOrDefault("unit", "미분류"))
                            .difficulty(((Number) q.getOrDefault("difficulty", 2)).intValue())
                            .correctAnswer(((Number) q.get("correct_answer")).intValue())
                            .explanation((String) q.get("explanation"))
                            .build();
                    question = questionRepository.save(question);

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) q.getOrDefault("choices", List.of());
                    java.util.List<Choice> choiceEntities = new java.util.ArrayList<>();
                    for (Map<String, Object> c : choices) {
                        choiceEntities.add(Choice.builder()
                                .question(question)
                                .choiceNum(((Number) c.get("choice_num")).intValue())
                                .content((String) c.get("content"))
                                .build());
                    }
                    question.setChoices(choiceEntities);
                    questionRepository.save(question);
                }
            }

            imported++;
            totalQuestions += qCount;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("imported", imported);
        result.put("skipped", skipped);
        result.put("totalQuestions", totalQuestions);
        result.put("scanned", parsedExams.size());
        return result;
    }
}
