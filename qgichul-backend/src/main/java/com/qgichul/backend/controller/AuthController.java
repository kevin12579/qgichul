package com.qgichul.backend.controller;

import com.qgichul.backend.dto.request.LoginRequest;
import com.qgichul.backend.dto.request.SignupRequest;
import com.qgichul.backend.dto.response.UserResponse;
import com.qgichul.backend.entity.User;
import com.qgichul.backend.repository.UserRepository;
import com.qgichul.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("accessToken", token);
        return ResponseEntity.ok(response);
    }

    /**
     * 가이드 v2 명세: GET /api/auth/me — 토큰 유효성 + 내 정보 조회
     * 프론트(authApi.getMe)가 호출하는 단일 진입점.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        return ResponseEntity.ok(new UserResponse(user));
    }
}
