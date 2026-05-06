package com.qgichul.backend.dto.response;

import com.qgichul.backend.entity.Choice;
import com.qgichul.backend.entity.Question;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class QuestionResponse {
    private Long id;
    private Integer questionNum;
    private String content;
    private String unit;
    private String subjectName;
    private Integer correctAnswer;
    private String explanation;
    private List<ChoiceResponse> choices;

    private Integer wrongCount;
    private LocalDateTime lastWrongAt;

    public QuestionResponse(Question question) {
        this.id = question.getId();
        this.questionNum = question.getQuestionNum();
        this.content = question.getContent();
        this.unit = question.getUnit();
        this.subjectName = question.getSubject() != null ? question.getSubject().getName() : null;
        this.correctAnswer = question.getCorrectAnswer();
        this.explanation = question.getExplanation();
        this.choices = question.getChoices().stream()
                .map(ChoiceResponse::new)
                .collect(Collectors.toList());
    }

    @Getter
    public static class ChoiceResponse {
        private Integer choiceNum;
        private String content;

        public ChoiceResponse(Choice choice) {
            this.choiceNum = choice.getChoiceNum();
            this.content = choice.getContent();
        }
    }
}
