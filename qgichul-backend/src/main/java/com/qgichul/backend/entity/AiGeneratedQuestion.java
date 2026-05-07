package com.qgichul.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_generated_questions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiGeneratedQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_question_id")
    private Question sourceQuestion;

    @Column(length = 100)
    private String unit;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "choice_1", columnDefinition = "TEXT", nullable = false)
    private String choice1;

    @Column(name = "choice_2", columnDefinition = "TEXT", nullable = false)
    private String choice2;

    @Column(name = "choice_3", columnDefinition = "TEXT", nullable = false)
    private String choice3;

    @Column(name = "choice_4", columnDefinition = "TEXT", nullable = false)
    private String choice4;

    @Column(name = "correct_answer", columnDefinition = "TINYINT")
    private Integer correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "user_answer", columnDefinition = "TINYINT")
    private Integer userAnswer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
