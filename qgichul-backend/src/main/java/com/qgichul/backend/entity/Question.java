package com.qgichul.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @JsonIgnore
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

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Choice> choices;

    public String getSubjectName() {
        return subject != null ? subject.getName() : null;
    }
}