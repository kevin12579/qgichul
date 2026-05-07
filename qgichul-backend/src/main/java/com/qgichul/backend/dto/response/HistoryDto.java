package com.qgichul.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter @AllArgsConstructor
public class HistoryDto {
    private Long sessionId;
    private String examTitle;
    private double score;
    private LocalDateTime submittedAt;
    private Integer correctCount;
    private Integer totalCount;
}