package com.qgichul.backend.repository;

import com.qgichul.backend.entity.WrongNoteMemo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WrongNoteMemoRepository extends JpaRepository<WrongNoteMemo, Long> {
    // 특정 유저(이메일)가 특정 문제에 쓴 메모가 이미 있는지 찾아보는 기능
    Optional<WrongNoteMemo> findByUserEmailAndQuestionId(String email, Long questionId);
}