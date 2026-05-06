package com.qgichul.backend.service;

import com.qgichul.backend.dto.request.LoginRequest;
import com.qgichul.backend.dto.request.SignupRequest;
import com.qgichul.backend.entity.User;
import com.qgichul.backend.repository.UserRepository;
import com.qgichul.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 회원가입 로직
    public String signup(SignupRequest request) {
        // 1. 이메일 중복 검사
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 가입된 이메일입니다.");
        }

        // 2. 비밀번호 암호화 및 User 객체 조립
        User newUser = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .nickname(request.getNickname())
                .educationLevel(request.getEducationLevel())
                .major(request.getMajor())
                .build();

        // 3. DB 저장
        userRepository.save(newUser);

        return "회원가입 성공!";
    }

    // 로그인 로직
    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}