package com.qgichul.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class SubmitAnswerRequest {

    private List<AnswerDto> answers;

    @Getter @Setter
    public static class AnswerDto {
        private Long questionId;
        private Integer selectedAnswer;
    }
}
