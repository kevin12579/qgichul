import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import Icon from '../components/common/Icon';
import { authApi } from '../api/authApi';
import { certApi } from '../api/certApi';
import { sessionApi } from '../api/sessionApi';

export default function ExamSelectPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [certs, setCerts] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [mode, setMode] = useState('exam');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자' }));
    certApi.getCertifications()
      .then(data => {
        setCerts(data || []);
        if (data && data.length > 0) setSelectedCert(data[0].id);
      })
      .catch(() => setCerts([]));
  }, []);

  useEffect(() => {
    if (!selectedCert) { setExams([]); return; }
    certApi.getExamsByCert(selectedCert)
      .then(data => setExams(data || []))
      .catch(() => setExams([]));
  }, [selectedCert]);

  const handleLogout = () => { localStorage.removeItem('accessToken'); navigate('/login'); };

  const startExam = async (examId) => {
    setLoading(true);
    try {
      const session = await sessionApi.startExam(examId);
      navigate(`/exam/${examId}?sessionId=${session.id}&mode=${mode}`);
    } catch {
      navigate(`/exam/${examId}?mode=${mode}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="main-header">
        <div>
          <div className="main-title">시험 선택</div>
          <div className="main-subtitle">자격증을 고르고 회차별로 기출문제를 풀어보세요</div>
        </div>
        <div className="segmented">
          <button className={mode === 'exam' ? 'active' : ''} onClick={() => setMode('exam')}>시험 모드</button>
          <button className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>연습 모드</button>
        </div>
      </div>

      {certs.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
          <Icon name="book" size={40} />
          <div style={{ marginTop: 12 }}>등록된 자격증이 없습니다. 관리자에게 PDF 등록을 요청하세요.</div>
        </div>
      ) : (
        <>
          <div className="hstack" style={{ gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {certs.map(c => (
              <div key={c.id} className={`chip ${selectedCert === c.id ? 'active' : ''}`} onClick={() => setSelectedCert(c.id)}>
                {c.name}
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 18px', borderRadius: 10, background: mode === 'exam' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${mode === 'exam' ? '#fecaca' : '#bbf7d0'}`, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon name={mode === 'exam' ? 'clock' : 'book'} size={22} color={mode === 'exam' ? 'var(--danger)' : 'var(--success)'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                {mode === 'exam' ? '시험 모드' : '연습 모드'}: {mode === 'exam' ? '실전과 동일한 환경' : '개념 이해에 집중'}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 2 }}>
                {mode === 'exam'
                  ? '타이머가 작동하며, 제출 후에만 정답·해설을 확인할 수 있습니다.'
                  : '타이머 없음. 문항별 즉시 채점 + 해설 즉시 공개. 반복 학습에 적합합니다.'}
              </div>
            </div>
          </div>

          {exams.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
              <Icon name="book" size={40} />
              <div style={{ marginTop: 12 }}>해당 자격증의 시험 목록이 없습니다.</div>
            </div>
          ) : (
            <div className="grid grid-3">
              {exams.map(e => (
                <div key={e.id} className="exam-card" onClick={() => !loading && startExam(e.id)}>
                  <div className="exam-card-header">
                    <span className="exam-category">{e.year}년 {e.session}회차</span>
                    <span className={`mode-ribbon ${mode}`}>{mode === 'exam' ? '시험' : '연습'}</span>
                  </div>
                  <div className="exam-card-title">{e.title}</div>
                  <div className="exam-card-meta">CBT 기출</div>
                  <div className="exam-stats">
                    <div className="exam-stat">문항수<b>{e.totalQuestions}</b></div>
                    <div className="exam-stat">시험시간<b>{e.durationMin}분</b></div>
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
