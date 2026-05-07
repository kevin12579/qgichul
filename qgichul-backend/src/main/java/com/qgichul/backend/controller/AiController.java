package com.qgichul.backend.controller;

import com.qgichul.backend.dto.response.AiAnalysisResponse;
import com.qgichul.backend.entity.AiGeneratedQuestion;
import com.qgichul.backend.entity.UserAnswer;
import com.qgichul.backend.repository.AiGeneratedQuestionRepository;
import com.qgichul.backend.repository.UserAnswerRepository;
import com.qgichul.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final UserAnswerRepository userAnswerRepository;
    private final AiGeneratedQuestionRepository aiGeneratedQuestionRepository;

    /**
     * GET /api/ai/analysis — 백엔드가 과목별 통계를 계산해 AI 서버로 전달.
     */
    @GetMapping("/analysis")
    public ResponseEntity<AiAnalysisResponse> getAiAnalysis(Principal principal) {
        String email = principal.getName();
        List<UserAnswer> wrongAnswers = userAnswerRepository.findByExamSessionUserEmailAndIsCorrectFalse(email);
        return ResponseEntity.ok(aiService.getAnalysisFromAi(email, wrongAnswers));
    }

    /**
     * GET /api/ai/home-recommend — 가입 학력·전공 기반 추천을 AI 서버에 위임.
     */
    @GetMapping("/home-recommend")
    public ResponseEntity<Map<String, Object>> getHomeRecommend(Principal principal) {
        return ResponseEntity.ok(aiService.getHomeRecommend(principal.getName()));
    }

    @GetMapping("/generated-questions")
    public ResponseEntity<List<AiGeneratedQuestion>> getGeneratedQuestions(Principal principal) {
        return ResponseEntity.ok(aiGeneratedQuestionRepository.findByUserEmail(principal.getName()));
    }

    /**
     * POST /api/ai/generate-questions — 사용자의 직전 오답을 시드로 AI 문제 생성.
     * body: {"count": 3}
     */
    @PostMapping("/generate-questions")
    public ResponseEntity<List<AiGeneratedQuestion>> generateQuestions(
            @RequestBody(required = false) Map<String, Integer> body,
            Principal principal) {
        int count = body != null && body.get("count") != null ? body.get("count") : 3;
        return ResponseEntity.ok(aiService.generateQuestionsForUser(principal.getName(), count));
    }

    /**
     * POST /api/ai/generated-questions/{id}/answer — AI 생성 문제 채점.
     */
    @PostMapping("/generated-questions/{id}/answer")
    public ResponseEntity<Map<String, Object>> answerGeneratedQuestion(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body,
            Principal principal) {
        Integer selected = body.get("selectedAnswer");
        return ResponseEntity.ok(aiService.gradeGeneratedAnswer(principal.getName(), id, selected));
    }
}
