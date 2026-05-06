package com.qgichul.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter @AllArgsConstructor
public class HistoryDto {
    private Long sessionId;
    private String examTitle; // 시험지 이름
    private double score; // 받은 점수
    private LocalDateTime submittedAt; // 제출 일시
}