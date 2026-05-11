-- ============================================================
-- 기존 "기타"로 잘못 분류된 자격증 카테고리 일괄 업데이트
-- docker exec -i <mysql-container> mysql -u root -p qgichul < fix_categories.sql
-- ============================================================

USE qgichul;

UPDATE certifications SET category = 'IT/정보통신'   WHERE category = '기타' AND (
    name LIKE '%정보처리%' OR name LIKE '%정보보안%' OR name LIKE '%컴퓨터활용%'
    OR name LIKE '%사무자동화%' OR name LIKE '%네트워크관리%' OR name LIKE '%리눅스%'
    OR name LIKE '%웹디자인%' OR name LIKE '%컴퓨터그래픽%' OR name LIKE '%멀티미디어%'
    OR name LIKE '%정보기기%' OR name LIKE '%데이터분석%' OR name LIKE '%SQL%'
    OR name LIKE '%ADsP%' OR name LIKE '%SQLD%' OR name LIKE '%정보통신%'
);

UPDATE certifications SET category = '전기/전자/에너지' WHERE category = '기타' AND (
    name LIKE '%전기기사%' OR name LIKE '%전기기능사%' OR name LIKE '%전기산업기사%'
    OR name LIKE '%전기공사%' OR name LIKE '%전자기사%' OR name LIKE '%전자기능사%'
    OR name LIKE '%전자산업기사%' OR name LIKE '%무선설비%' OR name LIKE '%방송통신%'
    OR name LIKE '%신재생에너지%' OR name LIKE '%전기철도%' OR name LIKE '%반도체%'
    OR name LIKE '%전기%'
);

UPDATE certifications SET category = '안전/소방/환경' WHERE category = '기타' AND (
    name LIKE '%산업안전%' OR name LIKE '%소방설비%' OR name LIKE '%가스기사%'
    OR name LIKE '%가스산업기사%' OR name LIKE '%가스기능사%' OR name LIKE '%수질환경%'
    OR name LIKE '%대기환경%' OR name LIKE '%폐기물%' OR name LIKE '%위험물%'
    OR name LIKE '%산업위생%' OR name LIKE '%화재감식%' OR name LIKE '%소방%'
);

UPDATE certifications SET category = '기계/건설/토목' WHERE category = '기타' AND (
    name LIKE '%일반기계%' OR name LIKE '%자동차정비%' OR name LIKE '%자동차기사%'
    OR name LIKE '%건축기사%' OR name LIKE '%건축산업기사%' OR name LIKE '%실내건축%'
    OR name LIKE '%토목%' OR name LIKE '%조경%' OR name LIKE '%지적%'
    OR name LIKE '%승강기%' OR name LIKE '%공조냉동%' OR name LIKE '%기계%'
);

UPDATE certifications SET category = '경영/금융/사무' WHERE category = '기타' AND (
    name LIKE '%공인중개사%' OR name LIKE '%주택관리사%' OR name LIKE '%전산회계%'
    OR name LIKE '%전산세무%' OR name LIKE '%FAT%' OR name LIKE '%TAT%'
    OR name LIKE '%ERP%' OR name LIKE '%직업상담%' OR name LIKE '%물류관리%'
    OR name LIKE '%유통관리%' OR name LIKE '%사회조사분석%' OR name LIKE '%비서%'
    OR name LIKE '%회계%' OR name LIKE '%세무%'
);

UPDATE certifications SET category = '조리/미용/서비스' WHERE category = '기타' AND (
    name LIKE '%조리%' OR name LIKE '%제과%' OR name LIKE '%제빵%'
    OR name LIKE '%바리스타%' OR name LIKE '%조주%' OR name LIKE '%미용사%'
    OR name LIKE '%지게차%' OR name LIKE '%굴착기%' OR name LIKE '%항공기체%'
);

UPDATE certifications SET category = '공무원/고시' WHERE category = '기타' AND (
    name LIKE '%공무원%' OR name LIKE '%PSAT%' OR name LIKE '%변리사%'
    OR name LIKE '%관세사%' OR name LIKE '%감정평가사%' OR name LIKE '%경찰%'
    OR name LIKE '%계리직%' OR name LIKE '%간호직%'
);

-- 그 외 나머지는 '학술/언어/기타'로 변경
UPDATE certifications SET category = '학술/언어/기타' WHERE category = '기타';

-- 결과 확인
SELECT category, COUNT(*) AS cnt FROM certifications GROUP BY category ORDER BY category;
