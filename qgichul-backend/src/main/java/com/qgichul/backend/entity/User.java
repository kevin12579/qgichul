package com.qgichul.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 50)
    private String nickname; // 부활한 닉네임

    @Column(name = "education_level", nullable = false, length = 20)
    private String educationLevel; // 이름 변경 (education -> educationLevel)

    @Column(length = 100)
    private String major; // 이름 변경 (department -> major)

    @CreationTimestamp
    private LocalDateTime createdAt;
}