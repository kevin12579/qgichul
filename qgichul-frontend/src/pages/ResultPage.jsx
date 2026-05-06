import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/common/Icon';

export default function ResultPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  if (!state) {
    navigate('/dashboard');
    return null;
  }

  const { examId, mode, answers = {}, questions = [], correctCount = 0, score = 0, duration = 0 } = state;

  const passed = score >= 60;

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const subjectNames = [...new Set(questions.map(q => q.subjectName))];
  const bySubject = subjectNames.map(name => {
    const qs = questions.filter(q => q.subjectName === name);
    const correct = qs.filter(q => answers[q.id] === q.correctAnswer).length;
    const accuracy = qs.length ? Math.round((correct / qs.length) * 100) : 0;
    return { name, total: qs.length, correct, accuracy };
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: passed
          ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
          : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        padding: '60px 40px', color: '#fff', textAlign: 'center'
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.8 }}>
          {mode === 'exam' ? '시험 모드' : '연습 모드'} 결과
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: '-0.04em', margin: '14px 0' }}>
          {score}<span style={{ fontSize: 28, fontWeight: 700, opacity: 0.8 }}>점</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: 99, fontSize: 16, fontWeight: 700 }}>
          {passed ? <><Icon name="trophy" size={18} /> 합격 예상 🎉</> : <>조금 더 분발해요 💪</>}
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 32, fontSize: 13, opacity: 0.9 }}>
          <div>맞은 문제 <b style={{ fontSize: 16 }}>{correctCount}/{questions.length}</b></div>
          <div>소요 시간 <b style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}>{fmt(duration)}</b></div>
          <div>모드 <b style={{ fontSize: 16 }}>{mode === 'exam' ? '시험' : '연습'}</b></div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '-30px auto 0', padding: '0 24px 40px' }}>
        {/* Action bar */}
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            <Icon name="home" size={14} /> 홈으로
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/exam/${examId}?mode=${mode}`)}>
            다시 풀기
          </button>
          <span className="spacer" />
          <button className="btn btn-primary" onClick={() => navigate('/notes')}>
            <Icon name="eye" size={14} /> 오답 노트 보기
          </button>
        </div>

        <div className="grid grid-2" style={{ gap: 16, marginBottom: 20 }}>
          {/* 과목별 성적 */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">과목별 성적</div>
              <div className="card-subtitle">과목 과락 기준 40점</div>
            </div>
            {bySubject.map(s => (
              <div key={s.name} style={{ marginBottom: 14 }}>
                <div className="hstack" style={{ marginBottom: 4 }}>
                  <b style={{ fontSize: 13 }}>{s.name}</b>
                  <span className="spacer" />
                  <span className="muted small">{s.correct}/{s.total}</span>
                  <b style={{ width: 50, textAlign: 'right', color: s.accuracy < 40 ? 'var(--danger)' : 'var(--text)' }}>{s.accuracy}%</b>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div className={`progress-bar ${s.accuracy < 40 ? 'danger' : s.accuracy < 60 ? 'warning' : 'success'}`} style={{ width: `${s.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI 분석 */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">AI 분석</div>
              <span className="badge primary">AI</span>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--primary-50)', borderRadius: 8, marginBottom: 10, fontSize: 13.5, lineHeight: 1.7, color: 'var(--primary-700)' }}>
              <b>📌 취약 단원:</b> SQL 응용, 데이터 전환<br />
              <b>💡 추천 학습:</b> 이 두 단원 집중 풀이 20문항<br />
              <b>🎯 합격 예상:</b> 현재 수준으로 실제 시험 <b>{Math.min(score + 10, 95)}%</b> 합격 가능
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
              {score >= 70
                ? '좋은 성적입니다! 취약 단원만 보완하면 합격 가능성이 더욱 높아집니다.'
                : '조금 더 학습이 필요합니다. AI가 분석한 취약 단원을 집중 공략하세요.'}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => navigate('/ai')}>
              AI 취약 분석 상세 보기 →
            </button>
          </div>
        </div>

        {/* 답안지 */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">답안지</div>
            <div className="hstack" style={{ gap: 12, fontSize: 12, color: 'var(--text-3)' }}>
              <div className="hstack" style={{ gap: 4 }}><span style={{ width: 10, height: 10, background: 'var(--success)', borderRadius: 2 }} /> 정답</div>
              <div className="hstack" style={{ gap: 4 }}><span style={{ width: 10, height: 10, background: 'var(--danger)', borderRadius: 2 }} /> 오답</div>
              <div className="hstack" style={{ gap: 4 }}><span style={{ width: 10, height: 10, background: '#fff', border: '1.5px solid #9ca3af', borderRadius: 2 }} /> 미응시</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
            {questions.map((q, i) => {
              const sel = answers[q.id];
              const correct = sel === q.correctAnswer;
              const unanswered = sel === undefined;
              return (
                <div key={q.id}
                  style={{ aspectRatio: 1, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', background: unanswered ? '#fff' : correct ? 'var(--success)' : 'var(--danger)', color: unanswered ? 'var(--text-3)' : '#fff', fontWeight: 700, fontSize: 13, display: 'grid', placeItems: 'center' }}>
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
