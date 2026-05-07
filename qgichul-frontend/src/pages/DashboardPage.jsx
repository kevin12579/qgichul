import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import Icon from '../components/common/Icon';
import Toast from '../components/common/Toast';
import { authApi } from '../api/authApi';
import { statsApi } from '../api/statsApi';

const PASS_SCORE = 60;

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState('');
  const [summary, setSummary] = useState({ totalExamsTaken: 0, overallCorrectRate: 0 });
  const [weakUnits, setWeakUnits] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자', name: '학습자' }));
    statsApi.getSummary().then(setSummary).catch(() => {});
    statsApi.getUnitStats().then(setWeakUnits).catch(() => {});
    statsApi.getHistory().then(setRecentAttempts).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const topWeakUnits = [...weakUnits]
    .filter(u => u.totalQuestions > 0)
    .sort((a, b) => a.correctRate - b.correctRate)
    .slice(0, 5);

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="main-header">
        <div>
          <div className="main-title">안녕하세요, {user?.nickname || user?.name || '학습자'}님</div>
          <div className="main-subtitle">실제 응시 데이터 기반 학습 현황</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/exams')}>
          <Icon name="play" size={16} /> 실전 모의고사 시작
        </button>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="kpi">
          <div className="kpi-label">📊 전체 정답률</div>
          <div className="kpi-value">{summary.overallCorrectRate || 0}%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">누적 응시 횟수</div>
          <div className="kpi-value">{summary.totalExamsTaken || 0}<span style={{ fontSize: 16, color: 'var(--text-3)', fontWeight: 600 }}>회</span></div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">최근 응시 기록</div>
          </div>
          {recentAttempts.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              아직 응시 기록이 없습니다.
            </div>
          ) : (
            <table className="table">
              <thead><tr><th>시험</th><th>점수</th><th>날짜</th></tr></thead>
              <tbody>
                {recentAttempts.map(a => {
                  const passed = (a.score ?? 0) >= PASS_SCORE;
                  return (
                    <tr key={a.sessionId}>
                      <td style={{ fontWeight: 500 }}>{a.examTitle}</td>
                      <td>
                        <b style={{ color: passed ? 'var(--success)' : 'var(--danger)' }}>{Math.round(a.score ?? 0)}점</b>
                        <span className="muted" style={{ fontSize: 11, marginLeft: 4 }}>{passed ? '합격' : '불합격'}</span>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{a.correctCount ?? 0}/{a.totalCount ?? 0}문항</div>
                      </td>
                      <td className="muted small">{formatDate(a.submittedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">🎯 취약 단원 TOP 5</div>
            <a onClick={() => navigate('/stats')} style={{ fontSize: 12, color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>자세히 →</a>
          </div>
          {topWeakUnits.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              응시 데이터가 쌓이면 취약 단원을 분석해 드립니다.
            </div>
          ) : topWeakUnits.map((u, i) => {
            const accuracy = Math.round(u.correctRate ?? 0);
            return (
              <div key={u.unitName} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < topWeakUnits.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < 3 ? 'var(--danger-50)' : 'var(--bg)', color: i < 3 ? 'var(--danger)' : 'var(--text-3)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }} className="truncate">{u.unitName}</div>
                  <div className="progress" style={{ height: 4 }}>
                    <div className={`progress-bar ${accuracy < 50 ? 'danger' : 'warning'}`} style={{ width: `${accuracy}%` }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: accuracy < 50 ? 'var(--danger)' : 'var(--warning)' }}>{accuracy}%</div>
                  <div className="muted small">{u.totalQuestions}문항</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Toast msg={toast} />
    </AppShell>
  );
}
