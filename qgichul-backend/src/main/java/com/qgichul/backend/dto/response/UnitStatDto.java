package com.qgichul.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnitStatDto {
    private String unitName;    // 단원명
    private double correctRate; // 정답률
    private int totalQuestions; // 총 문제 수
}