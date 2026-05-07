import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icon';
import Modal from '../components/common/Modal';
import { certApi } from '../api/certApi';
import { sessionApi } from '../api/sessionApi';

export default function ExamPage() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'exam';
  const sessionId = searchParams.get('sessionId');

  const [questions, setQuestions] = useState([]);
  const [examInfo, setExamInfo] = useState(null);
  const [loadError, setLoadError] = useState(false);
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
    certApi.getExamQuestions(examId)
      .then(data => {
        if (!data || data.length === 0) { setLoadError(true); setQuestions([]); }
        else setQuestions(data);
      })
      .catch(() => { setLoadError(true); setQuestions([]); });
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
        await Promise.all(
          Object.entries(answers).map(([qId, choiceNum]) =>
            sessionApi.saveAnswer(sessionId, Number(qId), choiceNum).catch(() => {})
          )
        );
        const result = await sessionApi.submitExam(sessionId);
        const finalScore = result?.score != null ? Math.round(result.score) : score;
        const finalCorrect = result?.correctCount != null ? result.correctCount : correctCount;
        navigate(`/result/${sessionId}`, { state: { examId, mode, answers, questions, correctCount: finalCorrect, score: finalScore, duration } });
        return;
      } catch {}
    }
    navigate(`/result/0`, { state: { examId, mode, answers, questions, correctCount, score, duration } });
  };

  if (loadError) {
    return (
      <div className="cbt-root" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: '#fc8181', fontSize: 18, fontWeight: 700 }}>문제를 불러올 수 없습니다.</div>
        <button className="cbt-footer-btn" onClick={() => navigate('/exams')}>시험 목록으로</button>
      </div>
    );
  }

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
