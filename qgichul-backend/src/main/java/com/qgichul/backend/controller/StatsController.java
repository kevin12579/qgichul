package com.qgichul.backend.controller;

import com.qgichul.backend.dto.response.*;
import com.qgichul.backend.entity.Certification;
import com.qgichul.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/summary")
    public ResponseEntity<SummaryDto> getSummary(
            Principal principal,
            @RequestParam(required = false) Long certId) {
        return ResponseEntity.ok(statsService.getSummary(principal.getName(), certId));
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectStatDto>> getSubjectStats(
            Principal principal,
            @RequestParam(required = false) Long certId) {
        return ResponseEntity.ok(statsService.getSubjectStats(principal.getName(), certId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<HistoryDto>> getHistory(
            Principal principal,
            @RequestParam(required = false) Long certId) {
        return ResponseEntity.ok(statsService.getHistory(principal.getName(), certId));
    }

    @GetMapping("/units")
    public ResponseEntity<List<UnitStatDto>> getUnitStats(
            Principal principal,
            @RequestParam(required = false) Long certId) {
        return ResponseEntity.ok(statsService.getUnitStats(principal.getName(), certId));
    }

    @GetMapping("/cert-list")
    public ResponseEntity<List<Certification>> getCertList(Principal principal) {
        return ResponseEntity.ok(statsService.getTakenCertifications(principal.getName()));
    }
}
