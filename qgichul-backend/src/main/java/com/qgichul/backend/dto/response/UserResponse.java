package com.qgichul.backend.dto.response;

import com.qgichul.backend.entity.User;
import lombok.Getter;

@Getter
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String nickname;
    private String educationLevel;
    private String major;

    // User 엔티티를 받아서 안전하게 응답용으로 변환
    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.nickname = user.getNickname();
        this.educationLevel = user.getEducationLevel();
        this.major = user.getMajor();
    }
}