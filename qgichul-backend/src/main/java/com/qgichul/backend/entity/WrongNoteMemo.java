package com.qgichul.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "wrong_note_memos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class WrongNoteMemo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 누가 쓴 메모인가?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question; // 어떤 문제에 대한 메모인가?

    @Column(columnDefinition = "TEXT")
    private String memo; // 메모 내용

    @CreationTimestamp
    private LocalDateTime createdAt; // 처음 쓴 시간

    @UpdateTimestamp
    private LocalDateTime updatedAt; // 마지막으로 수정한 시간
}