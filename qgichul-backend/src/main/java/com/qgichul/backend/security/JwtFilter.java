package com.qgichul.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1. 클라이언트가 보낸 헤더에서 "Authorization" 키값을 찾음
        String header = request.getHeader("Authorization");

        // 2. 통행증이 있고, "Bearer "로 시작하는지 확인
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // "Bearer " 글자 떼어내고 진짜 토큰만 추출

            // 3. 통행증이 진짜라면?
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmailFromToken(token);

                // 4. 스프링 시큐리티에게 "이 사람 인증 완료된 정상 유저야!" 라고 알려줌
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 5. 다음 단계(Controller 등)로 넘겨줌
        filterChain.doFilter(request, response);
    }
}