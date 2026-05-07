package com.qgichul.backend.service;

import com.qgichul.backend.dto.response.AiAnalysisResponse;
import com.qgichul.backend.entity.AiGeneratedQuestion;
import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.entity.Question;
import com.qgichul.backend.entity.User;
import com.qgichul.backend.entity.UserAnswer;
import com.qgichul.backend.repository.AiGeneratedQuestionRepository;
import com.qgichul.backend.repository.CertificationRepository;
import com.qgichul.backend.repository.UserAnswerRepository;
import com.qgichul.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AiService {

    @Value("${ai.server.url}")
    private String aiServerUrl;

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final CertificationRepository certificationRepository;
    private final AiGeneratedQuestionRepository aiGeneratedQuestionRepository;
    private final UserAnswerRepository userAnswerRepository;

    public AiService(UserRepository userRepository, CertificationRepository certificationRepository,
                     AiGeneratedQuestionRepository aiGeneratedQuestionRepository, UserAnswerRepository userAnswerRepository) {
        this.userRepository = userRepository;
        this.certificationRepository = certificationRepository;
        this.aiGeneratedQuestionRepository = aiGeneratedQuestionRepository;
        this.userAnswerRepository = userAnswerRepository;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(55_000);
        this.restTemplate = new RestTemplate(factory);
    }

    public AiAnalysisResponse getAnalysisFromAi(String userEmail, List<UserAnswer> wrongAnswers) {
        String endpoint = aiServerUrl + "/api/ai/analysis";

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        if (wrongAnswers.isEmpty()) {
            AiAnalysisResponse fallback = new AiAnalysisResponse();
            fallback.setSummary("오답 데이터가 없습니다. 시험을 먼저 풀어주세요.");
            return fallback;
        }

        List<Map<String, Object>> wrongAnswerPayload = new ArrayList<>();
        for (UserAnswer a : wrongAnswers) {
            Question q = a.getQuestion();
            Map<String, Object> item = new HashMap<>();
            item.put("question_id", q.getId());
            item.put("unit", q.getUnit() != null ? q.getUnit() : "미분류");
            item.put("subject_name", q.getSubject() != null ? q.getSubject().getName() : "기타");
            item.put("content", q.getContent());
            item.put("correct_answer", q.getCorrectAnswer());
            item.put("selected_answer", a.getSelectedAnswer() != null ? a.getSelectedAnswer() : 0);
            wrongAnswerPayload.add(item);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("user_id", user.getId());
        payload.put("wrong_answers", wrongAnswerPayload);

        try {
            return restTemplate.postForObject(endpoint, payload, AiAnalysisResponse.class);
        } catch (Exception e) {
            log.warn("AI analysis 호출 실패: {}", e.getMessage());
            AiAnalysisResponse fallback = new AiAnalysisResponse();
            fallback.setSummary("AI 서버와 통신할 수 없습니다.");
            fallback.setRecommendedStudy("AI 서버(FastAPI)가 켜져 있는지 확인해 주세요.");
            return fallback;
        }
    }

    /**
     * 가입 학력·전공 + DB 자격증 목록 → AI 서버 /api/ai/home-recommend
     */
    public Map<String, Object> getHomeRecommend(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<String> certNames = certificationRepository.findAll().stream()
                .map(Certification::getName)
                .toList();

        Map<String, Object> payload = new HashMap<>();
        payload.put("user_id", user.getId());
        payload.put("major", user.getMajor());
        payload.put("education_level", user.getEducationLevel());
        payload.put("available_certifications", certNames);

        String endpoint = aiServerUrl + "/api/ai/home-recommend";
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(endpoint, payload, Map.class);
            return response != null ? response : fallbackHomeRecommend();
        } catch (Exception e) {
            log.warn("AI home-recommend 호출 실패: {}", e.getMessage());
            return fallbackHomeRecommend();
        }
    }

    private Map<String, Object> fallbackHomeRecommend() {
        Map<String, Object> result = new HashMap<>();
        result.put("recommended_certifications", List.of());
        result.put("recommended_exam_ids", List.of());
        result.put("ai_message", "AI 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        return result;
    }

    /**
     * AI 문제 생성 트리거: 직전 오답 1건을 시드로 AI 서버 호출 → 결과 DB 저장.
     */
    @Transactional
    public List<AiGeneratedQuestion> generateQuestionsForUser(String userEmail, int count) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<UserAnswer> wrongs = userAnswerRepository.findByExamSessionUserEmailAndIsCorrectFalse(userEmail);
        if (wrongs.isEmpty()) {
            throw new RuntimeException("오답 데이터가 없어 AI 문제를 생성할 수 없습니다. 시험을 먼저 풀어주세요.");
        }
        UserAnswer seed = wrongs.stream()
                .max(Comparator.comparing(a -> a.getAnsweredAt() == null ? java.time.LocalDateTime.MIN : a.getAnsweredAt()))
                .orElse(wrongs.get(0));
        Question source = seed.getQuestion();

        Map<String, Object> payload = new HashMap<>();
        payload.put("user_id", user.getId());
        payload.put("source_question_id", source.getId());
        payload.put("unit", source.getUnit());
        payload.put("subject_name", source.getSubject() != null ? source.getSubject().getName() : "");
        payload.put("original_content", source.getContent());
        payload.put("original_choices", source.getChoices().stream()
                .map(c -> Map.of("choice_num", c.getChoiceNum(), "content", c.getContent()))
                .toList());
        payload.put("correct_answer", source.getCorrectAnswer());
        payload.put("explanation", source.getExplanation());
        payload.put("count", Math.max(1, Math.min(count, 5)));

        String endpoint = aiServerUrl + "/api/ai/generate-questions";
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(endpoint, payload, Map.class);
        if (response == null) {
            throw new RuntimeException("AI 서버 응답이 비어있습니다.");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> generated = (List<Map<String, Object>>) response.getOrDefault("generated_questions", List.of());

        List<AiGeneratedQuestion> saved = new ArrayList<>();
        for (Map<String, Object> g : generated) {
            AiGeneratedQuestion q = AiGeneratedQuestion.builder()
                    .user(user)
                    .sourceQuestion(source)
                    .unit((String) g.get("unit"))
                    .content((String) g.get("content"))
                    .choice1((String) g.get("choice_1"))
                    .choice2((String) g.get("choice_2"))
                    .choice3((String) g.get("choice_3"))
                    .choice4((String) g.get("choice_4"))
                    .correctAnswer(((Number) g.get("correct_answer")).intValue())
                    .explanation((String) g.get("explanation"))
                    .build();
            saved.add(aiGeneratedQuestionRepository.save(q));
        }
        return saved;
    }

    /**
     * AI 생성 문제 채점 — 정답 비교 후 결과 저장 & 반환
     */
    @Transactional
    public Map<String, Object> gradeGeneratedAnswer(String userEmail, Long questionId, Integer selectedAnswer) {
        AiGeneratedQuestion q = aiGeneratedQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("AI 생성 문제를 찾을 수 없습니다."));

        if (q.getUser() == null || !userEmail.equals(q.getUser().getEmail())) {
            throw new RuntimeException("본인의 AI 생성 문제만 채점할 수 있습니다.");
        }

        boolean isCorrect = selectedAnswer != null
                && q.getCorrectAnswer() != null
                && selectedAnswer.equals(q.getCorrectAnswer());

        q.setUserAnswer(selectedAnswer);
        q.setIsCorrect(isCorrect);
        aiGeneratedQuestionRepository.save(q);

        Map<String, Object> result = new HashMap<>();
        result.put("isCorrect", isCorrect);
        result.put("correctAnswer", q.getCorrectAnswer());
        result.put("explanation", q.getExplanation());
        return result;
    }
}
