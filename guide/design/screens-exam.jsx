// Exam runner (시험/연습 모드 공용), Result screen
const D = window.EXAM_DATA;

// ============ ExamRunner ============
// Props: examId, mode ('exam'|'practice'), onExit, onSubmit(state)
const ExamRunner = ({ examId, mode, onExit, onSubmit }) => {
  const exam = D.exams.find(e => e.id === examId);
  const questions = D.questions; // 20 demo questions
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({}); // {qid: optionIdx}
  const [flagged, setFlagged] = React.useState({}); // {qid: true}
  const [timeLeft, setTimeLeft] = React.useState(mode === 'exam' ? 90 * 60 : null); // 90min for exam
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);
  const [showExitModal, setShowExitModal] = React.useState(false);
  const [practiceReveal, setPracticeReveal] = React.useState({}); // {qid: true} - practice mode: shown explanation
  const [startedAt] = React.useState(Date.now());

  // Timer
  React.useEffect(() => {
    if (mode !== 'exam' || timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, mode]);

  const current = questions[currentIdx];
  const formatTime = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const selectOption = (qid, idx) => {
    setAnswers({ ...answers, [qid]: idx });
    if (mode === 'practice') {
      setPracticeReveal({ ...practiceReveal, [qid]: true });
    }
  };
  const toggleFlag = (qid) => setFlagged({ ...flagged, [qid]: !flagged[qid] });
  const go = (i) => setCurrentIdx(Math.max(0, Math.min(questions.length - 1, i)));

  const answeredCount = Object.keys(answers).length;
  const handleSubmit = () => {
    const correctCount = questions.filter(q => answers[q.id] === q.answer).length;
    onSubmit({
      examId, mode, answers, flagged,
      totalQ: questions.length,
      correctCount,
      score: Math.round((correctCount / questions.length) * 100),
      duration: Math.floor((Date.now() - startedAt) / 1000),
    });
  };

  return (
    <div className="cbt-root">
      {/* Header */}
      <div className="cbt-header">
        <span className={`mode-ribbon ${mode}`}>{mode === 'exam' ? '⚡ 시험 모드' : '📖 연습 모드'}</span>
        <div>
          <div className="exam-name">{exam.name}</div>
        </div>
        <span className="exam-info">응시번호 2026042600128 · 홍길동</span>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap: 12}}>
          {mode === 'exam' ? (
            <div className={`cbt-timer ${timeLeft < 300 ? 'warning' : ''}`}>
              <Icon name="clock" size={16}/> {formatTime(timeLeft)}
            </div>
          ) : (
            <div style={{color:'#cbd5e0', fontSize:13, display:'flex', gap:6, alignItems:'center'}}>
              <Icon name="clock" size={14}/> {formatTime(Math.floor((Date.now() - startedAt) / 1000))}
            </div>
          )}
          <button className="cbt-footer-btn" style={{height: 34, padding:'0 12px', fontSize:13}} onClick={() => setShowExitModal(true)}>
            <Icon name="x" size={14}/> 나가기
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="cbt-body">
        <div className="cbt-main">
          <div className="cbt-question-meta">
            <div className="cbt-qnum">문제 {currentIdx + 1}번</div>
            <span className="cbt-subject-tag">{D.subjects.find(s => s.id === current.subject)?.name}</span>
            <span className="cbt-subject-tag" style={{background:'#fef3c7', color:'#92400e'}}>{current.unit}</span>
            <span style={{marginLeft:'auto', display:'flex', gap:6}}>
              <button className="btn btn-ghost btn-sm" onClick={() => toggleFlag(current.id)}
                style={{color: flagged[current.id] ? 'var(--warning)' : 'var(--text-3)', fontWeight: 600}}>
                <Icon name="flag" size={15}/> {flagged[current.id] ? '체크됨' : '나중에'}
              </button>
            </span>
          </div>

          <div className="cbt-qtext">{current.text}</div>

          <div className="cbt-options">
            {current.options.map((o, i) => {
              const selected = answers[current.id] === i;
              const revealed = mode === 'practice' && practiceReveal[current.id];
              let cls = '';
              if (revealed) {
                if (i === current.answer) cls = 'correct';
                else if (selected) cls = 'wrong';
              } else if (selected) cls = 'selected';
              return (
                <div key={i} className={`cbt-option ${cls}`} onClick={() => !revealed && selectOption(current.id, i)}>
                  <div className="cbt-option-num">{i+1}</div>
                  <div className="cbt-option-text">{o}</div>
                  {revealed && i === current.answer && <span style={{color:'var(--success)', fontWeight:700, fontSize:13}}>정답</span>}
                  {revealed && selected && i !== current.answer && <span style={{color:'var(--danger)', fontWeight:700, fontSize:13}}>오답</span>}
                </div>
              );
            })}
          </div>

          {/* Practice mode: inline explanation */}
          {mode === 'practice' && practiceReveal[current.id] && (
            <div style={{marginTop: 20, padding: 16, background:'#fffbea', border:'1px solid #fde68a', borderRadius: 8}}>
              <div style={{fontSize:12, fontWeight:700, color:'#92400e', letterSpacing:'.04em', marginBottom:8}}>💡 해설</div>
              <div style={{fontSize: 14, lineHeight:1.7, color:'#451a03'}}>{current.explanation}</div>
              <div className="hstack" style={{marginTop:12, justifyContent:'flex-end'}}>
                <button className="cbt-footer-btn" style={{height: 32, fontSize:12, background:'var(--warning)'}}>
                  <Icon name="note" size={13}/> 오답 노트에 추가됨
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side */}
        <div className="cbt-side">
          <div className="cbt-sidecard">
            <h4>응시 현황</h4>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom: 12, fontSize:12}}>
              <div><div style={{fontSize:20, fontWeight:800, color:'#2d3748'}}>{answeredCount}</div>답안완료</div>
              <div><div style={{fontSize:20, fontWeight:800, color:'#4a5568'}}>{questions.length - answeredCount}</div>미응시</div>
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
                  <div key={q.id} className={`qgrid-cell ${cls}`} onClick={() => go(i)}>{i+1}</div>
                );
              })}
            </div>
            <div style={{marginTop: 12, fontSize: 11, color:'#6b7280', display:'grid', gap:4}}>
              <div className="hstack" style={{gap:6}}><span style={{width:10, height:10, background:'var(--primary)', borderRadius:2}}></span>답안완료</div>
              <div className="hstack" style={{gap:6}}><span style={{width:10, height:10, background:'var(--warning)', borderRadius:2}}></span>체크(나중에)</div>
              <div className="hstack" style={{gap:6}}><span style={{width:10, height:10, background:'#fff', border:'1.5px solid #9ca3af', borderRadius:2}}></span>미응시</div>
            </div>
          </div>
          <button className="cbt-footer-btn" style={{background:'var(--danger)', justifyContent:'center'}} onClick={() => setShowSubmitModal(true)}>
            <Icon name="check" size={15}/> 답안 제출
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="cbt-footer">
        <div className="hstack" style={{gap:8}}>
          <button className="cbt-footer-btn" disabled={currentIdx === 0} onClick={() => go(currentIdx - 1)}>
            <Icon name="arrow_left" size={14}/> 이전 문제
          </button>
          <button className="cbt-footer-btn primary" disabled={currentIdx === questions.length - 1} onClick={() => go(currentIdx + 1)}>
            다음 문제 <Icon name="arrow_right" size={14}/>
          </button>
        </div>
        <div className="hstack" style={{gap: 16, color:'#cbd5e0', fontSize: 13}}>
          <span>풀이 진행률</span>
          <div style={{width: 200, height: 8, background:'#1a202c', borderRadius: 4, overflow:'hidden'}}>
            <div style={{width: `${(answeredCount/questions.length)*100}%`, height:'100%', background:'var(--primary)'}}></div>
          </div>
          <span style={{fontWeight:700, color:'#fff'}}>{answeredCount} / {questions.length}</span>
        </div>
        <div className="hstack" style={{gap:8}}>
          <button className="cbt-footer-btn" onClick={() => toggleFlag(current.id)}>
            <Icon name="flag" size={14}/> 체크
          </button>
          <button className="cbt-footer-btn danger" onClick={() => setShowSubmitModal(true)}>
            <Icon name="check" size={14}/> 답안 제출
          </button>
        </div>
      </div>

      {showSubmitModal && (
        <Modal title="답안을 제출하시겠습니까?" onClose={() => setShowSubmitModal(false)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>더 풀기</button>
            <button className="btn btn-primary" onClick={handleSubmit}>제출하기</button>
          </>}>
          <div style={{fontSize:14, lineHeight:1.7}}>
            현재까지 <b>{answeredCount}개</b> 문항에 답하셨습니다.<br/>
            {questions.length - answeredCount > 0 && (
              <span style={{color:'var(--danger)'}}>미응시 문항 <b>{questions.length - answeredCount}개</b>가 남아있어요.<br/></span>
            )}
            제출하면 수정할 수 없습니다.
          </div>
        </Modal>
      )}
      {showExitModal && (
        <Modal title="시험을 중단하시겠습니까?" onClose={() => setShowExitModal(false)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowExitModal(false)}>계속 풀기</button>
            <button className="btn btn-danger" onClick={onExit}>나가기</button>
          </>}>
          <div style={{fontSize:14, lineHeight:1.7, color:'var(--text-2)'}}>
            {mode === 'exam' ? '시험 모드에서는 중단 시 응시 기록이 저장되지 않습니다.' : '연습 모드 진행 상황은 자동 저장되어 이어서 풀 수 있습니다.'}
          </div>
        </Modal>
      )}
    </div>
  );
};
window.ExamRunner = ExamRunner;

// ============ Result ============
const ExamResult = ({ state, onRetry, onHome, onReview }) => {
  const questions = D.questions;
  const exam = D.exams.find(e => e.id === state.examId);
  const passed = state.score >= 60;
  const fmt = (s) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  // per-subject score
  const bySubject = D.subjects.map(s => {
    const qs = questions.filter(q => q.subject === s.id);
    const correct = qs.filter(q => state.answers[q.id] === q.answer).length;
    return { ...s, total: qs.length, correct, accuracy: qs.length ? Math.round((correct/qs.length)*100) : 0 };
  });

  return (
    <div style={{background:'var(--bg)', minHeight:'100vh'}}>
      {/* Hero */}
      <div style={{background: passed ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : 'linear-gradient(135deg, #64748b 0%, #475569 100%)', padding:'60px 40px', color:'#fff', textAlign:'center'}}>
        <div style={{fontSize: 14, fontWeight: 700, letterSpacing:'0.1em', opacity: 0.8}}>{exam?.name}</div>
        <div style={{fontSize: 60, fontWeight: 900, letterSpacing:'-0.04em', margin:'14px 0'}}>
          {state.score}<span style={{fontSize:28, fontWeight:700, opacity:0.8}}>점</span>
        </div>
        <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'8px 20px', background:'rgba(255,255,255,0.2)', borderRadius:99, fontSize:16, fontWeight:700}}>
          {passed ? <><Icon name="trophy" size={18}/> 합격 예상 🎉</> : <>조금 더 분발해요</>}
        </div>
        <div style={{marginTop: 20, display:'flex', justifyContent:'center', gap: 32, fontSize: 13, opacity: 0.9}}>
          <div>맞은 문제 <b style={{fontSize:16}}>{state.correctCount}/{state.totalQ}</b></div>
          <div>소요 시간 <b style={{fontSize:16, fontFamily:'var(--font-mono)'}}>{fmt(state.duration)}</b></div>
          <div>모드 <b style={{fontSize:16}}>{state.mode === 'exam' ? '시험' : '연습'}</b></div>
        </div>
      </div>

      <div style={{maxWidth: 1100, margin:'-30px auto 0', padding:'0 24px 40px'}}>
        {/* Action bar */}
        <div className="card" style={{padding: 20, display:'flex', alignItems:'center', gap:10, marginBottom:20}}>
          <button className="btn btn-secondary" onClick={onHome}><Icon name="home" size={14}/> 홈으로</button>
          <button className="btn btn-secondary" onClick={onRetry}>다시 풀기</button>
          <span className="spacer"></span>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> 성적표 PDF</button>
          <button className="btn btn-primary" onClick={onReview}><Icon name="eye" size={14}/> 해설 보기</button>
        </div>

        {/* Subject breakdown */}
        <div className="grid grid-2" style={{gap:16, marginBottom: 20}}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">과목별 성적</div>
              <div className="card-subtitle">과목 과락 기준 40점</div>
            </div>
            {bySubject.map(s => (
              <div key={s.id} style={{marginBottom: 14}}>
                <div className="hstack" style={{marginBottom: 4}}>
                  <b style={{fontSize:13}}>{s.name}</b>
                  <span className="spacer"></span>
                  <span className="muted small">{s.correct}/{s.total}</span>
                  <b style={{width:50, textAlign:'right', color: s.accuracy < 40 ? 'var(--danger)' : 'var(--text)'}}>{s.accuracy}%</b>
                </div>
                <div className="progress" style={{height:8}}>
                  <div className={`progress-bar ${s.accuracy < 40 ? 'danger' : s.accuracy < 60 ? 'warning' : 'success'}`} style={{width:`${s.accuracy}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">AI 분석</div>
              <span className="badge primary">Pro 기능</span>
            </div>
            <div style={{padding:'12px 14px', background:'var(--primary-50)', borderRadius:8, marginBottom:10, fontSize:13.5, lineHeight:1.7, color:'var(--primary-700)'}}>
              <b>📌 취약 단원:</b> SQL 응용, 데이터 전환<br/>
              <b>💡 추천 학습:</b> 이 두 단원 집중 풀이 20문항<br/>
              <b>🎯 합격 예상:</b> 현재 수준으로 실제 시험 <b>72%</b> 합격 가능
            </div>
            <div style={{fontSize:12.5, color:'var(--text-2)', lineHeight:1.7}}>
              문제 풀이 시간이 평균보다 <b>18%</b> 빠른 편입니다. 신중하게 읽어보면 1-2개 더 맞출 수 있어요.
            </div>
            <button className="btn btn-primary" style={{width:'100%', marginTop:16}} onClick={onReview}>
              오답 해설 복습하기 →
            </button>
          </div>
        </div>

        {/* Answer sheet */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">답안지</div>
            <div className="hstack" style={{gap:12, fontSize:12, color:'var(--text-3)'}}>
              <div className="hstack" style={{gap:4}}><span style={{width:10,height:10,background:'var(--success)',borderRadius:2}}/> 정답</div>
              <div className="hstack" style={{gap:4}}><span style={{width:10,height:10,background:'var(--danger)',borderRadius:2}}/> 오답</div>
              <div className="hstack" style={{gap:4}}><span style={{width:10,height:10,background:'#fff',border:'1.5px solid #9ca3af',borderRadius:2}}/> 미응시</div>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:6}}>
            {questions.map((q, i) => {
              const sel = state.answers[q.id];
              const correct = sel === q.answer;
              const unanswered = sel === undefined;
              return (
                <div key={q.id} onClick={onReview}
                  style={{aspectRatio:1, border:'1px solid var(--border)', borderRadius:6, cursor:'pointer',
                    background: unanswered ? '#fff' : correct ? 'var(--success)' : 'var(--danger)',
                    color: unanswered ? 'var(--text-3)' : '#fff',
                    fontWeight:700, fontSize:13, display:'grid', placeItems:'center'}}>
                  {i+1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
window.ExamResult = ExamResult;
