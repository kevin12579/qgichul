package com.qgichul.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class SummaryDto {
    private int totalExamsTaken; // 총 응시 횟수
    private double overallCorrectRate; // 전체 평균 정답률 (%)
}