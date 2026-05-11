package com.qgichul.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certifications")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    // 기사 / 산업기사 / 기능사 / 기타
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String grade = "기타";

    @Column(columnDefinition = "TEXT")
    private String description;
}
