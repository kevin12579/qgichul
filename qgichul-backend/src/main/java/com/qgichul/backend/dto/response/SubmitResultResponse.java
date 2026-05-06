package com.qgichul.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubmitResultResponse {
    private int totalQuestions; // 총 문제 수
    private int correctCount; // 맞춘 문제 수
    private int wrongCount; // 틀린 문제 수 (총 문제 수 - 맞춘 문제 수)
    private double score; // 최종 점수 (100점 만점 기준)
}