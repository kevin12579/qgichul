package com.qgichul.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 이 과목은 어느 시험지에 속해있나?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(nullable = false, length = 100)
    private String name; // 예: 소프트웨어 설계

    @Column(name = "order_num", nullable = false)
    private Integer orderNum; // 출제 순서 (1과목, 2과목)
}