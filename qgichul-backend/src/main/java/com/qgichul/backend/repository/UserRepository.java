package com.qgichul.backend.repository;

import com.qgichul.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 이메일 중복 검사 및 로그인 시 유저를 찾기 위한 메서드
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}