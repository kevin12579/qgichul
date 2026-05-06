package com.qgichul.backend.controller;

import com.qgichul.backend.dto.request.SubmitAnswerRequest;
import com.qgichul.backend.dto.response.SubmitResultResponse;
import com.qgichul.backend.entity.ExamSession;
import com.qgichul.backend.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/api/exams/{examId}/start")
    public ResponseEntity<Map<String, Long>> startExamSession(@PathVariable Long examId, Principal principal) {
        Long sessionId = sessionService.startSession(principal.getName(), examId);
        Map<String, Long> response = new HashMap<>();
        response.put("sessionId", sessionId);
        return ResponseEntity.ok(response);
    }

    /**
     * 가이드 v2 명세: 답안 제출. 임시저장(PATCH) 방식이 적용되었으므로
     * 본 엔드포인트는 body 없이 채점 트리거 역할만 수행한다.
     */
    @PostMapping("/api/sessions/{sessionId}/submit")
    public ResponseEntity<SubmitResultResponse> submitAnswers(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.gradeBySession(sessionId));
    }

    /**
     * 답안 임시 저장 (한 문제씩 PATCH).
     */
    @PatchMapping("/api/sessions/{sessionId}/answer")
    public ResponseEntity<String> saveAnswerTemporarily(
            @PathVariable Long sessionId,
            @RequestBody SubmitAnswerRequest.AnswerDto answerDto) {
        sessionService.saveTempAnswer(sessionId, answerDto);
        return ResponseEntity.ok("답안이 임시 저장되었습니다.");
    }

    @GetMapping("/api/sessions/{sessionId}")
    public ResponseEntity<ExamSession> getSessionDetail(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getSessionById(sessionId));
    }

    @GetMapping("/api/sessions/{sessionId}/result")
    public ResponseEntity<SubmitResultResponse> getSessionResult(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getSessionResult(sessionId));
    }
}
