package com.qgichul.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "choices")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "choice_num", nullable = false, columnDefinition = "TINYINT")
    private Integer choiceNum; // 보기 번호 (1, 2, 3, 4)

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 보기 내용
}