import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import Icon from '../components/common/Icon';
import { authApi } from '../api/authApi';
import { aiApi } from '../api/aiApi';

export default function AiPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('weakness');

  const [analysis, setAnalysis] = useState(null);
  const [generated, setGenerated] = useState([]);
  const [recommend, setRecommend] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [revealed, setRevealed] = useState({});

  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const loadAnalysis = () => {
    setAnalyzing(true);
    setError('');
    aiApi.getAnalysis()
      .then(data => setAnalysis(data || null))
      .catch(e => setError(e?.response?.data?.message || 'AI 분석 호출에 실패했습니다.'))
      .finally(() => setAnalyzing(false));
  };

  const loadGenerated = () => {
    aiApi.getGeneratedQuestions().then(data => setGenerated(data || [])).catch(() => setGenerated([]));
  };

  const loadRecommend = () => {
    aiApi.getHomeRecommend()
      .then(data => setRecommend(data || null))
      .catch(() => setRecommend(null));
  };

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자' }));
    loadAnalysis();
    loadGenerated();
    loadRecommend();
  }, []);

  const handleLogout = () => { localStorage.removeItem('accessToken'); navigate('/login'); };

  const handleAnswer = async (qId, choiceNum) => {
    setSelectedAnswer(prev => ({ ...prev, [qId]: choiceNum }));
    setRevealed(prev => ({ ...prev, [qId]: true }));
    try {
      await aiApi.answerGeneratedQuestion(qId, choiceNum);
    } catch {}
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      await aiApi.generateQuestions(3);
      loadGenerated();
    } catch (e) {
      setError(e?.response?.data?.message || 'AI 문제 생성에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const weakUnits = analysis?.weakUnits || analysis?.weak_units || [];
  const overallFeedback = analysis?.overallFeedback || analysis?.overall_feedback || analysis?.summary || '';
  const recommendedCerts = recommend?.recommended_certifications || [];
  const aiMessage = recommend?.ai_message || '';

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="main-header">
        <div>
          <div className="main-title">AI 분석</div>
          <div className="main-subtitle">풀이 데이터 기반 취약 단원 분석 · AI 문제 생성</div>
        </div>
        <button className="btn btn-primary" onClick={loadAnalysis} disabled={analyzing}>
          <Icon name="brain" size={16} />
          {analyzing ? '분석 중...' : 'AI 재분석'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 14, background: 'var(--danger-50)', color: 'var(--danger)', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="segmented" style={{ marginBottom: 20 }}>
        <button className={tab === 'weakness' ? 'active' : ''} onClick={() => setTab('weakness')}>취약 단원 분석</button>
        <button className={tab === 'practice' ? 'active' : ''} onClick={() => setTab('practice')}>AI 생성 문제</button>
        <button className={tab === 'recommend' ? 'active' : ''} onClick={() => setTab('recommend')}>자격증 추천</button>
      </div>

      {tab === 'weakness' && (
        <>
          {overallFeedback && (
            <div style={{ padding: '16px 20px', background: 'var(--primary-50)', borderRadius: 12, border: '1px solid var(--primary-100)', marginBottom: 20, fontSize: 14, lineHeight: 1.7, color: 'var(--primary-700)' }}>
              <b>🤖 AI 분석 요약</b><br />
              {overallFeedback}
            </div>
          )}

          {weakUnits.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
              {analyzing ? '분석 중...' : '오답 데이터가 쌓이면 AI가 취약 단원을 분석해 드립니다.'}
            </div>
          ) : (
            <div className="vstack" style={{ gap: 16 }}>
              {weakUnits.map((w, i) => (
                <div key={`${w.unit}-${i}`} className="card">
                  <div className="hstack" style={{ marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: i < 2 ? 'var(--danger-50)' : 'var(--warning-50)', color: i < 2 ? 'var(--danger)' : 'var(--warning)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{w.unit}</div>
                      <div className="muted small">{w.subjectName || w.subject_name}</div>
                    </div>
                    {(w.wrongCount || w.wrong_count) != null && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--danger)' }}>{w.wrongCount ?? w.wrong_count}<span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 4 }}>회 오답</span></div>
                      </div>
                    )}
                  </div>
                  {(w.errorPattern || w.error_pattern) && (
                    <div style={{ padding: '10px 14px', background: 'var(--bg-soft)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
                      🔍 <b>오류 패턴:</b> {w.errorPattern || w.error_pattern}
                    </div>
                  )}
                  {(w.improvementTip || w.improvement_tip) && (
                    <div style={{ padding: '10px 14px', background: 'var(--bg-soft)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)' }}>
                      💡 <b>학습 팁:</b> {w.improvementTip || w.improvement_tip}
                    </div>
                  )}
                  <div className="hstack" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setTab('practice')}>
                      AI 문제 풀기 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'practice' && (
        <>
          <div style={{ padding: '12px 16px', background: 'var(--bg-soft)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, fontSize: 13, color: 'var(--text-2)' }}>
              🤖 직전 오답을 시드로 AI가 유사 문제를 생성합니다. 틀린 문제는 오답 노트에 자동 저장됩니다.
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleGenerate} disabled={generating}>
              {generating ? '생성 중...' : 'AI 문제 생성'}
            </button>
          </div>

          {generated.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
              아직 생성된 AI 문제가 없습니다. 위 "AI 문제 생성" 버튼을 눌러보세요.
            </div>
          ) : (
            <div className="vstack" style={{ gap: 16 }}>
              {generated.map((q, idx) => {
                const sel = selectedAnswer[q.id];
                const isReveal = revealed[q.id] || q.userAnswer != null;
                const choices = [
                  { num: 1, content: q.choice1 },
                  { num: 2, content: q.choice2 },
                  { num: 3, content: q.choice3 },
                  { num: 4, content: q.choice4 },
                ];
                return (
                  <div key={q.id} className="card">
                    <div className="hstack" style={{ marginBottom: 14 }}>
                      <span className="badge primary">AI 생성</span>
                      {q.unit && <span className="badge">{q.unit}</span>}
                      {isReveal && (
                        <span className={`badge ${(sel || q.userAnswer) === q.correctAnswer ? 'success' : 'danger'}`}>
                          {(sel || q.userAnswer) === q.correctAnswer ? '✓ 정답' : '✗ 오답'}
                        </span>
                      )}
                      <span className="muted small" style={{ marginLeft: 'auto' }}>문제 {idx + 1}</span>
                    </div>

                    <div style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 16, color: 'var(--text)' }}>
                      <span style={{ fontWeight: 800, marginRight: 8 }}>Q.</span>{q.content}
                    </div>

                    <div className="cbt-options">
                      {choices.map((ch) => {
                        const userSel = sel || q.userAnswer;
                        const isSelected = userSel === ch.num;
                        let cls = '';
                        if (isReveal) {
                          if (ch.num === q.correctAnswer) cls = 'correct';
                          else if (isSelected) cls = 'wrong';
                        } else if (isSelected) cls = 'selected';
                        return (
                          <div key={ch.num} className={`cbt-option ${cls}`}
                            onClick={() => !isReveal && handleAnswer(q.id, ch.num)}>
                            <div className="cbt-option-num">{ch.num}</div>
                            <div className="cbt-option-text">{ch.content}</div>
                            {isReveal && ch.num === q.correctAnswer && (
                              <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: 13 }}>정답</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {isReveal && q.explanation && (
                      <div style={{ marginTop: 16, padding: 14, background: '#fffbea', border: '1px solid #fde68a', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 6 }}>💡 해설</div>
                        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: '#451a03' }}>{q.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'recommend' && (
        <>
          {aiMessage && (
            <div style={{ padding: '16px 20px', background: 'var(--primary-50)', borderRadius: 12, border: '1px solid var(--primary-100)', marginBottom: 20, fontSize: 14, lineHeight: 1.7, color: 'var(--primary-700)' }}>
              🤖 {aiMessage}
            </div>
          )}

          {recommendedCerts.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--primary-50)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
                <Icon name="award" size={36} color="var(--primary)" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>추천 데이터 준비 중</div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                회원가입 시 입력한 학력·전공을 기반으로 자격증을 추천합니다. AI 서버 응답을 기다려주세요.
              </div>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gap: 16 }}>
              {recommendedCerts.map((c, i) => (
                <div key={`${c.name}-${i}`} className="card">
                  <div className="hstack" style={{ marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-50)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}>{c.priority || i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-2)' }}>
                    {c.reason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
