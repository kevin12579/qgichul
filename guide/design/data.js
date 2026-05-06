// Sample data — 정보처리기사 기출 (originally paraphrased for design showcase)

window.EXAM_DATA = {
  certifications: [
    { id: 'jpki', name: '정보처리기사', category: 'IT', popular: true },
    { id: 'jpsi', name: '정보처리산업기사', category: 'IT', popular: true },
    { id: 'jeki', name: '전기기사', category: '전기' },
    { id: 'soi',  name: '소방설비기사(전기)', category: '소방' },
    { id: 'eng',  name: '편입영어', category: '편입' },
    { id: 'math', name: '편입수학', category: '편입' },
  ],

  // 시험회차 목록
  exams: [
    { id: 'jpki-2024-1', certId: 'jpki', name: '정보처리기사 2024년 1회', year: 2024, round: 1, qCount: 100, duration: 150, passRate: 42 },
    { id: 'jpki-2023-3', certId: 'jpki', name: '정보처리기사 2023년 3회', year: 2023, round: 3, qCount: 100, duration: 150, passRate: 38 },
    { id: 'jpki-2023-2', certId: 'jpki', name: '정보처리기사 2023년 2회', year: 2023, round: 2, qCount: 100, duration: 150, passRate: 45 },
    { id: 'jpki-2023-1', certId: 'jpki', name: '정보처리기사 2023년 1회', year: 2023, round: 1, qCount: 100, duration: 150, passRate: 41 },
    { id: 'jpki-2022-3', certId: 'jpki', name: '정보처리기사 2022년 3회', year: 2022, round: 3, qCount: 100, duration: 150, passRate: 39 },
    { id: 'jpki-2022-2', certId: 'jpki', name: '정보처리기사 2022년 2회', year: 2022, round: 2, qCount: 100, duration: 150, passRate: 44 },
  ],

  subjects: [
    { id: 'sub1', name: '소프트웨어 설계' },
    { id: 'sub2', name: '소프트웨어 개발' },
    { id: 'sub3', name: '데이터베이스 구축' },
    { id: 'sub4', name: '프로그래밍 언어 활용' },
    { id: 'sub5', name: '정보시스템 구축관리' },
  ],

  // Questions — full demo uses 20 sample; exam mode shows 20 for speed
  questions: [
    { id: 1, subject: 'sub1', unit: '요구사항 확인',
      text: '다음 중 애자일(Agile) 개발 방법론의 특징으로 가장 거리가 먼 것은?',
      options: [
        '변화하는 요구사항에 빠르게 대응한다',
        '짧은 주기(Sprint)로 반복 개발을 진행한다',
        '고객과의 지속적인 협력을 중요시한다',
        '초기에 모든 요구사항을 확정하고 변경을 최소화한다'
      ],
      answer: 3,
      explanation: '애자일은 변화에 유연하게 대응하는 방법론으로, 초기에 모든 요구사항을 확정하는 것은 전통적인 폭포수(Waterfall) 방식의 특징입니다. 애자일은 오히려 "변화에 대한 대응"을 계획 고수보다 우선합니다.',
      difficulty: 2
    },
    { id: 2, subject: 'sub1', unit: '화면 설계',
      text: 'UI 설계 원칙 중 "사용자가 서비스를 쉽게 이해하고 사용할 수 있어야 한다"는 원칙은?',
      options: ['직관성', '유효성', '학습성', '유연성'],
      answer: 0,
      explanation: '직관성(Intuitiveness)은 누구나 쉽게 이해하고 사용할 수 있어야 한다는 원칙입니다. UI 설계의 4대 원칙: 직관성, 유효성, 학습성, 유연성.',
      difficulty: 1
    },
    { id: 3, subject: 'sub1', unit: '애플리케이션 설계',
      text: '디자인 패턴 중 객체의 생성을 서브클래스에서 결정하도록 하는 생성 패턴은?',
      options: ['Singleton', 'Factory Method', 'Observer', 'Adapter'],
      answer: 1,
      explanation: 'Factory Method 패턴은 객체 생성 코드를 서브클래스로 캡슐화합니다. Singleton은 단일 인스턴스, Observer는 행위 패턴, Adapter는 구조 패턴입니다.',
      difficulty: 2
    },
    { id: 4, subject: 'sub2', unit: '통합 구현',
      text: '소프트웨어 통합 테스트 방법 중 상위 모듈부터 하위 모듈 방향으로 테스트를 진행하는 방식은?',
      options: ['상향식 통합', '하향식 통합', '빅뱅 통합', '샌드위치 통합'],
      answer: 1,
      explanation: '하향식(Top-down) 통합은 상위 → 하위 모듈 순으로 진행하며, 아직 구현되지 않은 하위 모듈 대신 스텁(Stub)을 사용합니다.',
      difficulty: 2
    },
    { id: 5, subject: 'sub2', unit: '제품 소프트웨어 패키징',
      text: '소프트웨어 형상관리(Configuration Management)의 활동으로 옳지 않은 것은?',
      options: ['형상 식별', '형상 통제', '형상 감사', '형상 삭제'],
      answer: 3,
      explanation: '형상관리의 4가지 활동은 식별, 통제, 감사, 기록입니다. "형상 삭제"는 존재하지 않습니다.',
      difficulty: 3
    },
    { id: 6, subject: 'sub3', unit: 'SQL 응용',
      text: 'SQL에서 테이블의 구조를 변경하는 데이터 정의어(DDL)는?',
      options: ['UPDATE', 'ALTER', 'INSERT', 'SELECT'],
      answer: 1,
      explanation: 'ALTER TABLE은 DDL로 테이블 구조 변경에 사용됩니다. UPDATE/INSERT는 DML, SELECT는 DQL입니다.',
      difficulty: 1
    },
    { id: 7, subject: 'sub3', unit: '데이터베이스 기초',
      text: '관계형 데이터베이스에서 한 릴레이션의 기본키를 참조하는 다른 릴레이션의 속성은?',
      options: ['기본키', '후보키', '외래키', '대체키'],
      answer: 2,
      explanation: '외래키(Foreign Key)는 다른 릴레이션의 기본키를 참조하여 참조 무결성을 유지합니다.',
      difficulty: 1
    },
    { id: 8, subject: 'sub3', unit: 'SQL 응용',
      text: '다음 중 정규화 과정에서 제2정규형의 조건은?',
      options: [
        '도메인이 원자값만을 갖는다',
        '부분 함수 종속성을 제거한다',
        '이행적 함수 종속성을 제거한다',
        '모든 결정자가 후보키이다'
      ],
      answer: 1,
      explanation: '제2정규형(2NF)은 제1정규형을 만족하고 부분 함수 종속을 제거한 상태입니다. 3NF는 이행적 종속, BCNF는 결정자/후보키 조건.',
      difficulty: 3
    },
    { id: 9, subject: 'sub4', unit: '서버프로그램 구현',
      text: 'C언어에서 다음 코드의 출력 결과는? int a=5, b=2; printf("%d", a/b);',
      options: ['2', '2.5', '3', '오류'],
      answer: 0,
      explanation: 'C언어에서 정수끼리의 나눗셈은 몫만 반환합니다. 5/2 = 2 (정수 나눗셈).',
      difficulty: 1
    },
    { id: 10, subject: 'sub4', unit: '프로그래밍 언어 활용',
      text: '파이썬에서 list의 마지막 요소를 제거하고 반환하는 메서드는?',
      options: ['append()', 'remove()', 'pop()', 'delete()'],
      answer: 2,
      explanation: 'pop()은 리스트의 마지막 요소를 제거하고 반환합니다. remove()는 값으로 찾아 제거, delete()는 존재하지 않습니다.',
      difficulty: 1
    },
    { id: 11, subject: 'sub4', unit: '응용 SW 기초 기술 활용',
      text: 'OSI 7계층 중 라우팅을 담당하는 계층은?',
      options: ['데이터링크 계층', '네트워크 계층', '전송 계층', '세션 계층'],
      answer: 1,
      explanation: '네트워크 계층(3계층)은 라우팅과 IP 주소 지정을 담당합니다. 주요 프로토콜은 IP, ICMP.',
      difficulty: 2
    },
    { id: 12, subject: 'sub5', unit: '소프트웨어 개발 보안 구축',
      text: '다음 중 SQL Injection 공격의 방어 방법으로 가장 적절한 것은?',
      options: [
        '입력값에 대한 특수문자 필터링',
        '파라미터화된 쿼리(Prepared Statement) 사용',
        '웹 방화벽 설치',
        '모든 방법을 조합하여 사용'
      ],
      answer: 3,
      explanation: 'SQL Injection 방어는 입력 검증, Prepared Statement, WAF 등을 다층으로 조합(Defense in Depth)하는 것이 가장 효과적입니다.',
      difficulty: 2
    },
    { id: 13, subject: 'sub5', unit: '시스템 보안 구축',
      text: '대칭키 암호화 알고리즘이 아닌 것은?',
      options: ['AES', 'DES', 'SEED', 'RSA'],
      answer: 3,
      explanation: 'RSA는 공개키(비대칭키) 암호화 알고리즘입니다. AES/DES/SEED는 대칭키 알고리즘.',
      difficulty: 2
    },
    { id: 14, subject: 'sub5', unit: 'IT 프로젝트 정보시스템 구축관리',
      text: '다음 중 RAID 레벨에 대한 설명으로 옳은 것은?',
      options: [
        'RAID 0은 디스크 미러링으로 데이터 안정성을 높인다',
        'RAID 1은 스트라이핑으로 속도를 향상시킨다',
        'RAID 5는 분산 패리티를 사용한다',
        'RAID 10은 RAID 1만 사용한다'
      ],
      answer: 2,
      explanation: 'RAID 5는 블록 단위 스트라이핑과 분산 패리티로 성능과 안정성을 모두 제공합니다. RAID 0=스트라이핑, RAID 1=미러링.',
      difficulty: 3
    },
    { id: 15, subject: 'sub1', unit: '인터페이스 설계',
      text: 'REST API 설계 원칙 중 올바르지 않은 것은?',
      options: [
        'URI는 명사를 사용한다',
        '자원에 대한 행위는 HTTP 메서드로 표현한다',
        '동사형 URI를 사용한다',
        '상태 정보를 서버에 저장하지 않는다(무상태)'
      ],
      answer: 2,
      explanation: 'REST는 URI에 명사를, 행위는 HTTP 메서드(GET/POST/PUT/DELETE)로 표현합니다. 동사형 URI는 REST 원칙에 위배.',
      difficulty: 2
    },
    { id: 16, subject: 'sub2', unit: '애플리케이션 테스트',
      text: '블랙박스 테스트 기법이 아닌 것은?',
      options: ['동등 분할', '경계값 분석', '원인-결과 그래프', '기본 경로 테스트'],
      answer: 3,
      explanation: '기본 경로 테스트(Basis Path)는 화이트박스 테스트 기법입니다. 코드 내부 구조를 분석해야 합니다.',
      difficulty: 2
    },
    { id: 17, subject: 'sub3', unit: '데이터 전환',
      text: '트랜잭션의 ACID 속성에 해당하지 않는 것은?',
      options: ['원자성(Atomicity)', '일관성(Consistency)', '격리성(Isolation)', '가용성(Availability)'],
      answer: 3,
      explanation: 'ACID는 원자성, 일관성, 격리성, 지속성(Durability)입니다. 가용성은 CAP 정리의 요소.',
      difficulty: 1
    },
    { id: 18, subject: 'sub4', unit: '서버프로그램 구현',
      text: '다음 자바 코드의 출력은? String s = "Hello"; System.out.println(s.length());',
      options: ['4', '5', '6', '오류'],
      answer: 1,
      explanation: 'String.length()는 문자열의 문자 수를 반환합니다. "Hello"는 5글자.',
      difficulty: 1
    },
    { id: 19, subject: 'sub5', unit: '소프트웨어 개발 보안 구축',
      text: '해시 함수의 특성이 아닌 것은?',
      options: ['일방향성', '충돌 회피성', '가역성', '고정된 출력 길이'],
      answer: 2,
      explanation: '해시 함수는 "일방향성"이 핵심 — 원문을 역산할 수 없어야 합니다. 가역성은 암호화에서는 특징일 수 있으나 해시에서는 존재하지 않음.',
      difficulty: 2
    },
    { id: 20, subject: 'sub2', unit: '애플리케이션 테스트',
      text: '소프트웨어 테스트 중 사용자의 요구사항 충족 여부를 확인하는 테스트는?',
      options: ['단위 테스트', '통합 테스트', '시스템 테스트', '인수 테스트'],
      answer: 3,
      explanation: '인수 테스트(Acceptance Test)는 최종 사용자가 요구사항 충족 여부를 확인하는 단계입니다.',
      difficulty: 1
    },
  ],

  // 사용자 풀이 기록 (dashboard용)
  userHistory: [
    { date: '04/20', attempts: 2, correct: 80, accuracy: 80 },
    { date: '04/21', attempts: 3, correct: 120, accuracy: 75 },
    { date: '04/22', attempts: 1, correct: 45, accuracy: 82 },
    { date: '04/23', attempts: 4, correct: 180, accuracy: 78 },
    { date: '04/24', attempts: 2, correct: 100, accuracy: 85 },
    { date: '04/25', attempts: 0, correct: 0, accuracy: 0 },
    { date: '04/26', attempts: 3, correct: 150, accuracy: 88 },
  ],

  subjectAccuracy: [
    { id: 'sub1', name: '소프트웨어 설계', total: 120, correct: 96, accuracy: 80 },
    { id: 'sub2', name: '소프트웨어 개발', total: 118, correct: 82, accuracy: 69 },
    { id: 'sub3', name: '데이터베이스 구축', total: 115, correct: 59, accuracy: 51 },
    { id: 'sub4', name: '프로그래밍 언어 활용', total: 124, correct: 102, accuracy: 82 },
    { id: 'sub5', name: '정보시스템 구축관리', total: 110, correct: 68, accuracy: 62 },
  ],

  weakUnits: [
    { unit: 'SQL 응용', subject: 'sub3', wrong: 18, total: 34, accuracy: 47 },
    { unit: '데이터 전환', subject: 'sub3', wrong: 12, total: 24, accuracy: 50 },
    { unit: '시스템 보안 구축', subject: 'sub5', wrong: 11, total: 22, accuracy: 50 },
    { unit: '애플리케이션 테스트', subject: 'sub2', wrong: 14, total: 29, accuracy: 52 },
    { unit: '응용 SW 기초 기술', subject: 'sub4', wrong: 9, total: 20, accuracy: 55 },
  ],

  recentAttempts: [
    { id: 'a1', examName: '정보처리기사 2024년 1회', mode: 'exam', date: '2026.04.26', score: 72, duration: '01:42:18', passed: true },
    { id: 'a2', examName: '정보처리기사 2023년 3회', mode: 'practice', date: '2026.04.25', score: 68, duration: '02:08:00', passed: true },
    { id: 'a3', examName: '정보처리기사 2023년 2회', mode: 'exam', date: '2026.04.23', score: 58, duration: '02:30:00', passed: false },
    { id: 'a4', examName: '정보처리기사 2023년 1회', mode: 'practice', date: '2026.04.21', score: 64, duration: '01:55:10', passed: true },
  ],
};
