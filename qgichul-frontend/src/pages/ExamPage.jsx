import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icon';
import Modal from '../components/common/Modal';
import { certApi } from '../api/certApi';
import { sessionApi } from '../api/sessionApi';

const MOCK_QUESTIONS = [
  { id: 1, subjectName: '소프트웨어 설계', unit: '요구사항 확인', content: '다음 중 애자일(Agile) 개발 방법론의 특징으로 가장 거리가 먼 것은?', choices: [{ choiceNum: 1, content: '변화하는 요구사항에 빠르게 대응한다' }, { choiceNum: 2, content: '짧은 주기(Sprint)로 반복 개발을 진행한다' }, { choiceNum: 3, content: '고객과의 지속적인 협력을 중요시한다' }, { choiceNum: 4, content: '초기에 모든 요구사항을 확정하고 변경을 최소화한다' }], correctAnswer: 4, explanation: '애자일은 변화에 유연하게 대응하는 방법론입니다.' },
  { id: 2, subjectName: '소프트웨어 설계', unit: '화면 설계', content: 'UI 설계 원칙 중 "사용자가 서비스를 쉽게 이해하고 사용할 수 있어야 한다"는 원칙은?', choices: [{ choiceNum: 1, content: '직관성' }, { choiceNum: 2, content: '유효성' }, { choiceNum: 3, content: '학습성' }, { choiceNum: 4, content: '유연성' }], correctAnswer: 1, explanation: '직관성(Intuitiveness)은 누구나 쉽게 이해하고 사용할 수 있어야 한다는 원칙입니다.' },
  { id: 3, subjectName: '소프트웨어 설계', unit: '애플리케이션 설계', content: '디자인 패턴 중 객체의 생성을 서브클래스에서 결정하도록 하는 생성 패턴은?', choices: [{ choiceNum: 1, content: 'Singleton' }, { choiceNum: 2, content: 'Factory Method' }, { choiceNum: 3, content: 'Observer' }, { choiceNum: 4, content: 'Adapter' }], correctAnswer: 2, explanation: 'Factory Method 패턴은 객체 생성 코드를 서브클래스로 캡슐화합니다.' },
  { id: 4, subjectName: '소프트웨어 개발', unit: '통합 구현', content: '소프트웨어 통합 테스트 방법 중 상위 모듈부터 하위 모듈 방향으로 테스트를 진행하는 방식은?', choices: [{ choiceNum: 1, content: '상향식 통합' }, { choiceNum: 2, content: '하향식 통합' }, { choiceNum: 3, content: '빅뱅 통합' }, { choiceNum: 4, content: '샌드위치 통합' }], correctAnswer: 2, explanation: '하향식(Top-down) 통합은 상위 → 하위 모듈 순으로 진행합니다.' },
  { id: 5, subjectName: '소프트웨어 개발', unit: '제품 소프트웨어 패키징', content: '소프트웨어 형상관리(Configuration Management)의 활동으로 옳지 않은 것은?', choices: [{ choiceNum: 1, content: '형상 식별' }, { choiceNum: 2, content: '형상 통제' }, { choiceNum: 3, content: '형상 감사' }, { choiceNum: 4, content: '형상 삭제' }], correctAnswer: 4, explanation: '형상관리의 4가지 활동은 식별, 통제, 감사, 기록입니다. "형상 삭제"는 존재하지 않습니다.' },
  { id: 6, subjectName: '데이터베이스 구축', unit: 'SQL 응용', content: 'SQL에서 테이블의 구조를 변경하는 데이터 정의어(DDL)는?', choices: [{ choiceNum: 1, content: 'UPDATE' }, { choiceNum: 2, content: 'ALTER' }, { choiceNum: 3, content: 'INSERT' }, { choiceNum: 4, content: 'SELECT' }], correctAnswer: 2, explanation: 'ALTER TABLE은 DDL로 테이블 구조 변경에 사용됩니다.' },
  { id: 7, subjectName: '데이터베이스 구축', unit: '데이터베이스 기초', content: '관계형 데이터베이스에서 한 릴레이션의 기본키를 참조하는 다른 릴레이션의 속성은?', choices: [{ choiceNum: 1, content: '기본키' }, { choiceNum: 2, content: '후보키' }, { choiceNum: 3, content: '외래키' }, { choiceNum: 4, content: '대체키' }], correctAnswer: 3, explanation: '외래키(Foreign Key)는 다른 릴레이션의 기본키를 참조합니다.' },
  { id: 8, subjectName: '데이터베이스 구축', unit: 'SQL 응용', content: '다음 중 정규화 과정에서 제2정규형의 조건은?', choices: [{ choiceNum: 1, content: '도메인이 원자값만을 갖는다' }, { choiceNum: 2, content: '부분 함수 종속성을 제거한다' }, { choiceNum: 3, content: '이행적 함수 종속성을 제거한다' }, { choiceNum: 4, content: '모든 결정자가 후보키이다' }], correctAnswer: 2, explanation: '제2정규형(2NF)은 제1정규형을 만족하고 부분 함수 종속을 제거한 상태입니다.' },
  { id: 9, subjectName: '프로그래밍 언어 활용', unit: '서버프로그램 구현', content: 'C언어에서 다음 코드의 출력 결과는? int a=5, b=2; printf("%d", a/b);', choices: [{ choiceNum: 1, content: '2' }, { choiceNum: 2, content: '2.5' }, { choiceNum: 3, content: '3' }, { choiceNum: 4, content: '오류' }], correctAnswer: 1, explanation: 'C언어에서 정수끼리의 나눗셈은 몫만 반환합니다. 5/2 = 2' },
  { id: 10, subjectName: '프로그래밍 언어 활용', unit: '프로그래밍 언어 활용', content: '파이썬에서 list의 마지막 요소를 제거하고 반환하는 메서드는?', choices: [{ choiceNum: 1, content: 'append()' }, { choiceNum: 2, content: 'remove()' }, { choiceNum: 3, content: 'pop()' }, { choiceNum: 4, content: 'delete()' }], correctAnswer: 3, explanation: 'pop()은 리스트의 마지막 요소를 제거하고 반환합니다.' },
  { id: 11, subjectName: '프로그래밍 언어 활용', unit: '응용 SW 기초 기술 활용', content: 'OSI 7계층 중 라우팅을 담당하는 계층은?', choices: [{ choiceNum: 1, content: '데이터링크 계층' }, { choiceNum: 2, content: '네트워크 계층' }, { choiceNum: 3, content: '전송 계층' }, { choiceNum: 4, content: '세션 계층' }], correctAnswer: 2, explanation: '네트워크 계층(3계층)은 라우팅과 IP 주소 지정을 담당합니다.' },
  { id: 12, subjectName: '정보시스템 구축관리', unit: '소프트웨어 개발 보안 구축', content: '다음 중 SQL Injection 공격의 방어 방법으로 가장 적절한 것은?', choices: [{ choiceNum: 1, content: '입력값에 대한 특수문자 필터링' }, { choiceNum: 2, content: '파라미터화된 쿼리(Prepared Statement) 사용' }, { choiceNum: 3, content: '웹 방화벽 설치' }, { choiceNum: 4, content: '모든 방법을 조합하여 사용' }], correctAnswer: 4, explanation: 'SQL Injection 방어는 입력 검증, Prepared Statement, WAF 등을 다층으로 조합하는 것이 효과적입니다.' },
  { id: 13, subjectName: '정보시스템 구축관리', unit: '시스템 보안 구축', content: '대칭키 암호화 알고리즘이 아닌 것은?', choices: [{ choiceNum: 1, content: 'AES' }, { choiceNum: 2, content: 'DES' }, { choiceNum: 3, content: 'SEED' }, { choiceNum: 4, content: 'RSA' }], correctAnswer: 4, explanation: 'RSA는 공개키(비대칭키) 암호화 알고리즘입니다.' },
  { id: 14, subjectName: '정보시스템 구축관리', unit: 'IT 프로젝트 정보시스템 구축관리', content: 'RAID 5에 대한 설명으로 옳은 것은?', choices: [{ choiceNum: 1, content: 'RAID 0은 디스크 미러링으로 안정성을 높인다' }, { choiceNum: 2, content: 'RAID 1은 스트라이핑으로 속도를 향상시킨다' }, { choiceNum: 3, content: 'RAID 5는 분산 패리티를 사용한다' }, { choiceNum: 4, content: 'RAID 10은 RAID 1만 사용한다' }], correctAnswer: 3, explanation: 'RAID 5는 블록 단위 스트라이핑과 분산 패리티로 성능과 안정성을 제공합니다.' },
  { id: 15, subjectName: '소프트웨어 설계', unit: '인터페이스 설계', content: 'REST API 설계 원칙 중 올바르지 않은 것은?', choices: [{ choiceNum: 1, content: 'URI는 명사를 사용한다' }, { choiceNum: 2, content: '자원에 대한 행위는 HTTP 메서드로 표현한다' }, { choiceNum: 3, content: '동사형 URI를 사용한다' }, { choiceNum: 4, content: '상태 정보를 서버에 저장하지 않는다(무상태)' }], correctAnswer: 3, explanation: 'REST는 URI에 명사를, 행위는 HTTP 메서드로 표현합니다.' },
  { id: 16, subjectName: '소프트웨어 개발', unit: '애플리케이션 테스트', content: '블랙박스 테스트 기법이 아닌 것은?', choices: [{ choiceNum: 1, content: '동등 분할' }, { choiceNum: 2, content: '경계값 분석' }, { choiceNum: 3, content: '원인-결과 그래프' }, { choiceNum: 4, content: '기본 경로 테스트' }], correctAnswer: 4, explanation: '기본 경로 테스트(Basis Path)는 화이트박스 테스트 기법입니다.' },
  { id: 17, subjectName: '데이터베이스 구축', unit: '데이터 전환', content: '트랜잭션의 ACID 속성에 해당하지 않는 것은?', choices: [{ choiceNum: 1, content: '원자성(Atomicity)' }, { choiceNum: 2, content: '일관성(Consistency)' }, { choiceNum: 3, content: '격리성(Isolation)' }, { choiceNum: 4, content: '가용성(Availability)' }], correctAnswer: 4, explanation: 'ACID는 원자성, 일관성, 격리성, 지속성(Durability)입니다.' },
  { id: 18, subjectName: '프로그래밍 언어 활용', unit: '서버프로그램 구현', content: '다음 자바 코드의 출력은? String s = "Hello"; System.out.println(s.length());', choices: [{ choiceNum: 1, content: '4' }, { choiceNum: 2, content: '5' }, { choiceNum: 3, content: '6' }, { choiceNum: 4, content: '오류' }], correctAnswer: 2, explanation: 'String.length()는 문자열의 문자 수를 반환합니다. "Hello"는 5글자.' },
  { id: 19, subjectName: '정보시스템 구축관리', unit: '소프트웨어 개발 보안 구축', content: '해시 함수의 특성이 아닌 것은?', choices: [{ choiceNum: 1, content: '일방향성' }, { choiceNum: 2, content: '충돌 회피성' }, { choiceNum: 3, content: '가역성' }, { choiceNum: 4, content: '고정된 출력 길이' }], correctAnswer: 3, explanation: '해시 함수는 "일방향성"이 핵심 — 원문을 역산할 수 없어야 합니다.' },
  { id: 20, subjectName: '소프트웨어 개발', unit: '애플리케이션 테스트', content: '소프트웨어 테스트 중 사용자의 요구사항 충족 여부를 확인하는 테스트는?', choices: [{ choiceNum: 1, content: '단위 테스트' }, { choiceNum: 2, content: '통합 테스트' }, { choiceNum: 3, content: '시스템 테스트' }, { choiceNum: 4, content: '인수 테스트' }], correctAnswer: 4, explanation: '인수 테스트(Acceptance Test)는 최종 사용자가 요구사항 충족 여부를 확인하는 단계입니다.' },
];

export default function ExamPage() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'exam';
  const sessionId = searchParams.get('sessionId');

  const [questions, setQuestions] = useState([]);
  const [examInfo, setExamInfo] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(mode === 'exam' ? 90 * 60 : null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [practiceReveal, setPracticeReveal] = useState({});
  const [startedAt] = useState(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    certApi.getExam(examId).then(setExamInfo).catch(() => {
      setExamInfo({ title: `시험 #${examId}`, durationMin: 150 });
    });
    certApi.getExamQuestions(examId).then(data => setQuestions(data)).catch(() => {
      setQuestions(MOCK_QUESTIONS);
    });
  }, [examId]);

  useEffect(() => {
    if (mode !== 'exam' || timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, mode]);

  const current = questions[currentIdx];
  const formatTime = (s) => {
    if (s == null) {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      s = elapsed;
    }
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const selectOption = (qId, choiceNum) => {
    setAnswers(prev => ({ ...prev, [qId]: choiceNum }));
    if (mode === 'practice') {
      setPracticeReveal(prev => ({ ...prev, [qId]: true }));
    }
    if (sessionId) {
      sessionApi.saveAnswer(sessionId, qId, choiceNum).catch(() => {});
    }
  };

  const toggleFlag = (qId) => setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
  const goTo = (i) => setCurrentIdx(Math.max(0, Math.min(questions.length - 1, i)));

  const answeredCount = Object.keys(answers).length;

  const handleSubmit = async () => {
    clearTimeout(timerRef.current);
    const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const duration = Math.floor((Date.now() - startedAt) / 1000);
    const score = Math.round((correctCount / questions.length) * 100);

    if (sessionId) {
      try {
        await sessionApi.submitExam(sessionId);
        navigate(`/result/${sessionId}`, { state: { examId, mode, answers, questions, correctCount, score, duration } });
        return;
      } catch {}
    }
    navigate(`/result/0`, { state: { examId, mode, answers, questions, correctCount, score, duration } });
  };

  if (!current) {
    return (
      <div className="cbt-root" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: 18 }}>문제를 불러오는 중...</div>
      </div>
    );
  }

  const revealed = mode === 'practice' && practiceReveal[current.id];

  return (
    <div className="cbt-root">
      {/* Header */}
      <div className="cbt-header">
        <span className={`mode-ribbon ${mode}`}>{mode === 'exam' ? '⚡ 시험 모드' : '📖 연습 모드'}</span>
        <div className="exam-name">{examInfo?.title || `시험 #${examId}`}</div>
        <span className="exam-info">CBT 실전 풀이</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {mode === 'exam' ? (
            <div className={`cbt-timer ${timeLeft < 300 ? 'warning' : ''}`}>
              <Icon name="clock" size={16} /> {formatTime(timeLeft)}
            </div>
          ) : (
            <div style={{ color: '#cbd5e0', fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="clock" size={14} /> 연습 모드
            </div>
          )}
          <button className="cbt-footer-btn" style={{ height: 34, padding: '0 12px', fontSize: 13 }} onClick={() => setShowExitModal(true)}>
            <Icon name="x" size={14} /> 나가기
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="cbt-body">
        <div className="cbt-main">
          <div className="cbt-question-meta">
            <div className="cbt-qnum">문제 {currentIdx + 1}번</div>
            <span className="cbt-subject-tag">{current.subjectName}</span>
            <span className="cbt-subject-tag" style={{ background: '#fef3c7', color: '#92400e' }}>{current.unit}</span>
            <span style={{ marginLeft: 'auto' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => toggleFlag(current.id)}
                style={{ color: flagged[current.id] ? 'var(--warning)' : 'var(--text-3)', fontWeight: 600 }}>
                <Icon name="flag" size={15} /> {flagged[current.id] ? '체크됨' : '나중에'}
              </button>
            </span>
          </div>

          <div className="cbt-qtext">{current.content}</div>

          <div className="cbt-options">
            {current.choices.map((ch) => {
              const selected = answers[current.id] === ch.choiceNum;
              let cls = '';
              if (revealed) {
                if (ch.choiceNum === current.correctAnswer) cls = 'correct';
                else if (selected) cls = 'wrong';
              } else if (selected) cls = 'selected';
              return (
                <div key={ch.choiceNum} className={`cbt-option ${cls}`}
                  onClick={() => !revealed && selectOption(current.id, ch.choiceNum)}>
                  <div className="cbt-option-num">{ch.choiceNum}</div>
                  <div className="cbt-option-text">{ch.content}</div>
                  {revealed && ch.choiceNum === current.correctAnswer && (
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: 13 }}>정답</span>
                  )}
                  {revealed && selected && ch.choiceNum !== current.correctAnswer && (
                    <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>오답</span>
                  )}
                </div>
              );
            })}
          </div>

          {mode === 'practice' && revealed && (
            <div style={{ marginTop: 20, padding: 16, background: '#fffbea', border: '1px solid #fde68a', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', letterSpacing: '.04em', marginBottom: 8 }}>💡 해설</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: '#451a03' }}>{current.explanation}</div>
            </div>
          )}
        </div>

        {/* Side */}
        <div className="cbt-side">
          <div className="cbt-sidecard">
            <h4>응시 현황</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12, fontSize: 12 }}>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: '#2d3748' }}>{answeredCount}</div>답안완료</div>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: '#4a5568' }}>{questions.length - answeredCount}</div>미응시</div>
            </div>
          </div>
          <div className="cbt-sidecard">
            <h4>문항 바로가기</h4>
            <div className="qgrid">
              {questions.map((q, i) => {
                let cls = '';
                if (i === currentIdx) cls += ' current';
                if (flagged[q.id]) cls += ' flagged';
                else if (answers[q.id] !== undefined) cls += ' answered';
                return (
                  <div key={q.id} className={`qgrid-cell ${cls}`} onClick={() => goTo(i)}>{i + 1}</div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#6b7280', display: 'grid', gap: 4 }}>
              <div className="hstack" style={{ gap: 6 }}><span style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: 2 }} />답안완료</div>
              <div className="hstack" style={{ gap: 6 }}><span style={{ width: 10, height: 10, background: 'var(--warning)', borderRadius: 2 }} />체크(나중에)</div>
              <div className="hstack" style={{ gap: 6 }}><span style={{ width: 10, height: 10, background: '#fff', border: '1.5px solid #9ca3af', borderRadius: 2 }} />미응시</div>
            </div>
          </div>
          <button className="cbt-footer-btn" style={{ background: 'var(--danger)', justifyContent: 'center' }} onClick={() => setShowSubmitModal(true)}>
            <Icon name="check" size={15} /> 답안 제출
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="cbt-footer">
        <div className="hstack" style={{ gap: 8 }}>
          <button className="cbt-footer-btn" disabled={currentIdx === 0} onClick={() => goTo(currentIdx - 1)}>
            <Icon name="arrow_left" size={14} /> 이전 문제
          </button>
          <button className="cbt-footer-btn primary" disabled={currentIdx === questions.length - 1} onClick={() => goTo(currentIdx + 1)}>
            다음 문제 <Icon name="arrow_right" size={14} />
          </button>
        </div>
        <div className="hstack" style={{ gap: 16, color: '#cbd5e0', fontSize: 13 }}>
          <span>풀이 진행률</span>
          <div style={{ width: 200, height: 8, background: '#1a202c', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(answeredCount / questions.length) * 100}%`, height: '100%', background: 'var(--primary)' }} />
          </div>
          <span style={{ fontWeight: 700, color: '#fff' }}>{answeredCount} / {questions.length}</span>
        </div>
        <div className="hstack" style={{ gap: 8 }}>
          <button className="cbt-footer-btn" onClick={() => toggleFlag(current.id)}>
            <Icon name="flag" size={14} /> 체크
          </button>
          <button className="cbt-footer-btn danger" onClick={() => setShowSubmitModal(true)}>
            <Icon name="check" size={14} /> 답안 제출
          </button>
        </div>
      </div>

      {showSubmitModal && (
        <Modal title="답안을 제출하시겠습니까?" onClose={() => setShowSubmitModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>더 풀기</button>
              <button className="btn btn-primary" onClick={handleSubmit}>제출하기</button>
            </>
          }>
          <div style={{ fontSize: 14, lineHeight: 1.7 }}>
            현재까지 <b>{answeredCount}개</b> 문항에 답하셨습니다.<br />
            {questions.length - answeredCount > 0 && (
              <span style={{ color: 'var(--danger)' }}>미응시 문항 <b>{questions.length - answeredCount}개</b>가 남아있어요.<br /></span>
            )}
            제출하면 수정할 수 없습니다.
          </div>
        </Modal>
      )}
      {showExitModal && (
        <Modal title="시험을 중단하시겠습니까?" onClose={() => setShowExitModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowExitModal(false)}>계속 풀기</button>
              <button className="btn btn-danger" onClick={() => navigate('/exams')}>나가기</button>
            </>
          }>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            {mode === 'exam' ? '시험 모드에서는 중단 시 응시 기록이 저장되지 않습니다.' : '연습 모드 진행 상황은 자동 저장됩니다.'}
          </div>
        </Modal>
      )}
    </div>
  );
}
