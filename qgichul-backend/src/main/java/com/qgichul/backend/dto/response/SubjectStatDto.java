package com.qgichul.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubjectStatDto {
    private String subjectName;
    private double correctRate;
    private int correctCount;
    private int totalCount;

    public SubjectStatDto(String subjectName, double correctRate) {
        this(subjectName, correctRate, 0, 0);
    }
}
