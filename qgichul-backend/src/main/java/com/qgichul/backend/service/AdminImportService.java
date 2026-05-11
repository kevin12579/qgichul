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

    /**
     * 자격증 이름을 받아 카테고리를 자동으로 매핑합니다.
     * 사용자가 제공한 DB 데이터의 category 컬럼 값과 동일하게 맞춥니다.
     */
    private String resolveCategoryByName(String certName) {
        if (certName == null) return "학술/언어/기타";
        String n = certName;

        // 공무원/고시
        if (n.contains("공무원") || n.contains("PSAT") || n.contains("변리사")
                || n.contains("관세사") || n.contains("감정평가사") || n.contains("경찰")
                || n.contains("소방공무원") || n.contains("계리직") || n.contains("간호직")) {
            return "공무원/고시";
        }
        // IT/정보통신
        if (n.contains("정보처리") || n.contains("정보보안") || n.contains("컴퓨터활용")
                || n.contains("사무자동화") || n.contains("네트워크관리") || n.contains("리눅스")
                || n.contains("웹디자인") || n.contains("컴퓨터그래픽") || n.contains("멀티미디어")
                || n.contains("정보기기") || n.contains("데이터분석") || n.contains("SQL")
                || n.contains("ADsP") || n.contains("SQLD") || n.contains("IT")
                || n.contains("정보통신")) {
            return "IT/정보통신";
        }
        // 전기/전자/에너지
        if (n.contains("전기기사") || n.contains("전기기능사") || n.contains("전기산업기사")
                || n.contains("전기공사") || n.contains("전자기사") || n.contains("전자기능사")
                || n.contains("전자산업기사") || n.contains("무선설비") || n.contains("방송통신")
                || n.contains("신재생에너지") || n.contains("전기철도") || n.contains("반도체")
                || n.contains("전기")) {
            return "전기/전자/에너지";
        }
        // 안전/소방/환경
        if (n.contains("산업안전") || n.contains("소방설비") || n.contains("가스기사")
                || n.contains("가스산업기사") || n.contains("가스기능사") || n.contains("수질환경")
                || n.contains("대기환경") || n.contains("폐기물") || n.contains("위험물")
                || n.contains("산업위생") || n.contains("화재감식") || n.contains("소방")) {
            return "안전/소방/환경";
        }
        // 기계/건설/토목
        if (n.contains("일반기계") || n.contains("자동차정비") || n.contains("자동차기사")
                || n.contains("건축기사") || n.contains("건축산업기사") || n.contains("실내건축")
                || n.contains("토목") || n.contains("조경") || n.contains("지적")
                || n.contains("승강기") || n.contains("공조냉동") || n.contains("기계")) {
            return "기계/건설/토목";
        }
        // 경영/금융/사무
        if (n.contains("공인중개사") || n.contains("주택관리사") || n.contains("전산회계")
                || n.contains("전산세무") || n.contains("FAT") || n.contains("TAT")
                || n.contains("ERP") || n.contains("직업상담") || n.contains("물류관리")
                || n.contains("유통관리") || n.contains("사회조사분석") || n.contains("비서")
                || n.contains("회계") || n.contains("세무")) {
            return "경영/금융/사무";
        }
        // 조리/미용/서비스
        if (n.contains("조리") || n.contains("제과") || n.contains("제빵")
                || n.contains("바리스타") || n.contains("조주") || n.contains("미용사")
                || n.contains("지게차") || n.contains("굴착기") || n.contains("항공기체")) {
            return "조리/미용/서비스";
        }
        // 학술/언어/기타
        return "학술/언어/기타";
    }

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

            // 카테고리 자동 매핑
            String category = resolveCategoryByName(certName);

            Certification cert = certificationRepository.findByName(certName)
                    .orElseGet(() -> certificationRepository.save(
                            Certification.builder().name(certName).category(category).build()
                    ));

            // 기존에 "기타"로 잘못 저장된 경우 카테고리 업데이트
            if ("기타".equals(cert.getCategory())) {
                cert.setCategory(category);
                certificationRepository.save(cert);
            }

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
