package com.qgichul.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_sessions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ExamSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 누가 풀었나?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam; // 무슨 시험을 풀었나? (기존에 Exam 엔티티가 없다면 만들어야 합니다!)

    private Double score; // 몇 점?
    private Integer correctCount; // 몇 개 맞춤?
    private Integer totalCount; // 총 문제 수

    @Column(length = 20)
    private String status; // 상태 (예: SUBMITTED)

    @CreationTimestamp
    private LocalDateTime startedAt; // 시작 시간

    private LocalDateTime submittedAt; // 제출 시간
}