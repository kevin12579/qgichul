import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import RadarChart from '../components/chart/RadarChart';
import LineChart from '../components/chart/LineChart';
import HBar from '../components/chart/HBar';
import { authApi } from '../api/authApi';
import { statsApi } from '../api/statsApi';

const PASS_SCORE = 60;

const formatShortDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

export default function StatsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [certs, setCerts] = useState([]);
  const [certId, setCertId] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [weakUnits, setWeakUnits] = useState([]);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ totalExamsTaken: 0, overallCorrectRate: 0 });

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자' }));
    statsApi.getCertsTaken().then(data => setCerts(data || [])).catch(() => setCerts([]));
  }, []);

  useEffect(() => {
    statsApi.getSummary(certId).then(setSummary).catch(() => {});
    statsApi.getSubjectStats(certId).then(data => setSubjectData(data || [])).catch(() => setSubjectData([]));
    statsApi.getUnitStats(certId).then(data => setWeakUnits(data || [])).catch(() => setWeakUnits([]));
    statsApi.getHistory(certId).then(data => setHistory(data || [])).catch(() => setHistory([]));
  }, [certId]);

  const handleLogout = () => { localStorage.removeItem('accessToken'); navigate('/login'); };

  const radarData = subjectData.map(s => ({ name: s.subjectName, accuracy: Math.round(s.correctRate ?? 0) }));
  const historyData = [...history]
    .reverse()
    .map(h => ({ date: formatShortDate(h.submittedAt), accuracy: Math.round(h.score ?? 0) }));
  const topWeak = [...weakUnits]
    .filter(u => u.totalQuestions > 0)
    .sort((a, b) => a.correctRate - b.correctRate)
    .slice(0, 5);
  const passCount = history.filter(h => (h.score ?? 0) >= PASS_SCORE).length;
  const passRate = history.length > 0 ? Math.round((passCount / history.length) * 100) : 0;
  const maxScore = history.length > 0 ? Math.round(Math.max(...history.map(h => h.score ?? 0))) : 0;

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="main-header">
        <div>
          <div className="main-title">성적 통계</div>
          <div className="main-subtitle">내 학습 데이터 기반 약점 분석 · 합격률 예측</div>
        </div>
        <div className="segmented">
          <button className={certId === null ? 'active' : ''} onClick={() => setCertId(null)}>전체</button>
          {certs.map(c => (
            <button key={c.id} className={certId === c.id ? 'active' : ''} onClick={() => setCertId(c.id)}>{c.name}</button>
          ))}
        </div>
      </div>

      {summary.totalExamsTaken === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
          {certId === null
            ? '아직 응시한 시험이 없습니다. 시험을 풀고 다시 확인해 주세요.'
            : '선택한 자격증의 응시 기록이 없습니다.'}
        </div>
      ) : (
        <>
          <div className="grid grid-4" style={{ marginBottom: 16 }}>
            <div className="kpi">
              <div className="kpi-label">누적 응시</div>
              <div className="kpi-value">{summary.totalExamsTaken}<span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 600 }}>회</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-label">평균 점수</div>
              <div className="kpi-value">{Math.round(summary.overallCorrectRate ?? 0)}<span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 600 }}>점</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-label">최고 점수</div>
              <div className="kpi-value">{maxScore}<span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 600 }}>점</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-label">합격률 (60점 기준)</div>
              <div className="kpi-value" style={{ color: 'var(--success)' }}>{passRate}<span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 600 }}>%</span></div>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 16, marginBottom: 16 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">과목별 정답률</div>
              </div>
              {radarData.length < 3 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                  3개 이상 과목의 풀이 데이터가 쌓이면 차트가 표시됩니다.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'center' }}>
                  <RadarChart data={radarData} />
                  <div>
                    {subjectData.map(s => {
                      const acc = Math.round(s.correctRate ?? 0);
                      return (
                        <div key={s.subjectName} style={{ padding: '6px 0', borderBottom: '1px dashed var(--border)' }}>
                          <div className="hstack">
                            <span className="dot blue" />
                            <span style={{ fontSize: 13, flex: 1 }}>{s.subjectName}</span>
                            <b style={{ fontSize: 13, color: acc < 60 ? 'var(--danger)' : acc < 75 ? 'var(--warning)' : 'var(--success)' }}>{acc}%</b>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">점수 추이</div>
                <div className="card-subtitle">최근 응시 순</div>
              </div>
              {historyData.length < 2 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                  2회 이상 응시하면 추이가 표시됩니다.
                </div>
              ) : (
                <LineChart data={historyData} width={480} />
              )}
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">🎯 취약 단원 TOP 5</div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/notes')}>오답 재시험</button>
              </div>
              {topWeak.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                  단원별 데이터가 부족합니다.
                </div>
              ) : topWeak.map(u => {
                const acc = Math.round(u.correctRate ?? 0);
                return (
                  <HBar key={u.unitName} label={u.unitName} value={acc} color={acc < 50 ? 'var(--danger)' : 'var(--warning)'} />
                );
              })}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">과목별 풀이 분포</div>
                <div className="card-subtitle">정답 / 전체 문항</div>
              </div>
              {subjectData.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                  과목별 데이터가 없습니다.
                </div>
              ) : subjectData.map(s => {
                const acc = Math.round(s.correctRate ?? 0);
                return (
                  <div key={s.subjectName} style={{ marginBottom: 14 }}>
                    <div className="hstack" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.subjectName}</span>
                      <span className="spacer" />
                      <span className="small muted">{s.correctCount}/{s.totalCount}</span>
                      <b style={{ fontSize: 13, minWidth: 40, textAlign: 'right' }}>{acc}%</b>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div className="progress-bar" style={{ width: `${acc}%`, background: acc < 60 ? 'var(--danger)' : acc < 75 ? 'var(--warning)' : 'var(--success)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
