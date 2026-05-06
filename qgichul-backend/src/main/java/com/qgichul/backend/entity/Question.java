package com.qgichul.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam; // <--- qgichul 흔적 제거!

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(nullable = false, length = 100)
    private String unit;

    @Column(name = "question_num", nullable = false)
    private Integer questionNum;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false, columnDefinition = "TINYINT")
    private Integer difficulty;

    @Column(name = "correct_answer", nullable = false, columnDefinition = "TINYINT")
    private Integer correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // ⭐️ 새롭게 추가할 부분: 문제 하나를 부르면 밑에 달린 보기(choices)들도 같이 가져오기
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Choice> choices;
}