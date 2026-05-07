package com.qgichul.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 이 시험은 어느 자격증에 속해있나?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    @JsonIgnore
    private Certification certification;

    @Column(nullable = false, length = 200)
    private String title; // 예: 2023년 1회차 정보처리기사

    @Column(nullable = false)
    private Integer year; // 출제 연도

    @Column(nullable = false)
    private Integer session; // 회차

    @Column(name = "duration_min", nullable = false)
    private Integer durationMin; // 제한 시간(분)

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions; // 총 문항 수

    @CreationTimestamp
    private LocalDateTime createdAt;


}