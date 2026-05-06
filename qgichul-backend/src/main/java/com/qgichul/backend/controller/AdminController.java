package com.qgichul.backend.controller;

import com.qgichul.backend.service.AdminImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminImportService adminImportService;

    /**
     * AI 서버의 `qgichul-ai/pdfs/` 폴더를 파싱해 DB에 저장.
     * 사용 예: curl -X POST 'http://localhost:8080/api/admin/import-pdfs?folder=pdfs'
     */
    @PostMapping("/import-pdfs")
    public ResponseEntity<Map<String, Object>> importPdfs(
            @RequestParam(defaultValue = "pdfs") String folder) {
        return ResponseEntity.ok(adminImportService.importPdfsFromFolder(folder));
    }
}
