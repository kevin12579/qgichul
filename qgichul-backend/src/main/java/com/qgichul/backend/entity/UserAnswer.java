package com.qgichul.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_answers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ExamSession examSession; // 어느 시험 기록에 속해있나?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question; // 무슨 문제인가?

    private Integer selectedAnswer; // 유저가 몇 번 골랐나?
    private Boolean isCorrect; // 맞았나 틀렸나? (T/F)

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
}