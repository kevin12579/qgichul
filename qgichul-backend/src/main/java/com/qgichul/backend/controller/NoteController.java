package com.qgichul.backend.controller;

import com.qgichul.backend.dto.request.MemoRequest;
import com.qgichul.backend.dto.response.QuestionResponse;
import com.qgichul.backend.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getMyWrongNotes(Principal principal) {
        return ResponseEntity.ok(noteService.getWrongQuestions(principal.getName()));
    }

    /** 가이드 v2: 단건 오답 + 메모 조회 */
    @GetMapping("/{questionId}")
    public ResponseEntity<Map<String, Object>> getNoteDetail(
            @PathVariable Long questionId, Principal principal) {
        return ResponseEntity.ok(noteService.getNoteDetail(principal.getName(), questionId));
    }

    @PostMapping("/{questionId}/memo")
    public ResponseEntity<String> saveMemo(
            @PathVariable Long questionId,
            @RequestBody MemoRequest request,
            Principal principal) {
        return ResponseEntity.ok(noteService.saveOrUpdateMemo(principal.getName(), questionId, request));
    }

    /** 가이드 v2: 메모 수정 (PUT) */
    @PutMapping("/{questionId}/memo")
    public ResponseEntity<Void> updateMemo(
            @PathVariable Long questionId,
            @RequestBody MemoRequest request,
            Principal principal) {
        noteService.saveOrUpdateMemo(principal.getName(), questionId, request);
        return ResponseEntity.ok().build();
    }
}
