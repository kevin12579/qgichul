package com.qgichul.backend.repository;

import com.qgichul.backend.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

    Optional<Certification> findByName(String name);

    // 카테고리 목록 (중복 제거, 정렬)
    @Query("SELECT DISTINCT c.category FROM Certification c ORDER BY c.category")
    List<String> findDistinctCategories();

    // 카테고리별 등급 목록 (중복 제거)
    @Query("SELECT DISTINCT c.grade FROM Certification c WHERE c.category = :category ORDER BY c.grade")
    List<String> findDistinctGradesByCategory(@Param("category") String category);

    // 카테고리 + 등급으로 자격증 조회
    List<Certification> findByCategoryAndGradeOrderByNameAsc(String category, String grade);

    // 카테고리별 전체 자격증 조회
    List<Certification> findByCategoryOrderByNameAsc(String category);
}
