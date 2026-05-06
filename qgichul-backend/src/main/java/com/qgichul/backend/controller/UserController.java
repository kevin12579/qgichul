package com.qgichul.backend.controller;

import com.qgichul.backend.dto.response.UserResponse;
import com.qgichul.backend.entity.User;
import com.qgichul.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * 프론트는 /api/auth/me 만 호출. 본 컨트롤러는 별도 사용자 관리 API용 자리만 유지.
 * /me 는 AuthController 로 이전됨.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        return ResponseEntity.ok(new UserResponse(user));
    }
}
