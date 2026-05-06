import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import Icon from '../components/common/Icon';
import { authApi } from '../api/authApi';

const CERTS = ['정보처리기사', 'SQLD'];

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [targetDate, setTargetDate] = useState('2026-08-15');
  const [dailyGoal, setDailyGoal] = useState(30);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자', name: '학습자', email: '' }));
  }, []);

  const handleLogout = () => { localStorage.removeItem('accessToken'); navigate('/login'); };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const name = user?.nickname || user?.name || '학습자';
  const dDay = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="main-header">
        <div>
          <div className="main-title">마이페이지</div>
          <div className="main-subtitle">내 학습 요약 · 목표 관리</div>
        </div>
      </div>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, padding: 28 }}>
        <div className="avatar" style={{ width: 72, height: 72, fontSize: 28 }}>{name[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{name}</div>
          <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>
            {user?.email || ''} · 가입일 2025.12.03
          </div>
          <div className="hstack" style={{ gap: 8, marginTop: 10 }}>
            <span className="nav-plan-badge free">FREE</span>
            <span className="muted small">무료 플랜 이용 중</span>
          </div>
        </div>
        <button className="btn btn-secondary"><Icon name="edit" size={14} /> 프로필 수정</button>
      </div>

      <div className="grid grid-2" style={{ gap: 16 }}>
        {/* 학습 목표 */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>학습 목표</div>
          <div className="form-row">
            <label className="form-label">관심 자격증</label>
            <div className="hstack" style={{ gap: 6, flexWrap: 'wrap' }}>
              {CERTS.map(c => <span key={c} className="chip active">{c}</span>)}
              <span className="chip">+ 추가</span>
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">목표 시험일</label>
            <input type="date" className="form-input" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
            <div className="form-help">D-{dDay > 0 ? dDay : '종료'}</div>
          </div>
          <div className="form-row">
            <label className="form-label">일일 목표 문제 수</label>
            <input type="number" className="form-input" value={dailyGoal} onChange={e => setDailyGoal(e.target.value)} min={5} max={200} />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={handleSave}>
            {saved ? '✓ 저장됨' : '저장'}
          </button>
        </div>

        {/* 학습 요약 */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>학습 요약</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: '누적 풀이', value: '1,284' },
              { label: '오답 노트', value: '348' },
              { label: '응시 횟수', value: '24' },
              { label: '연속 학습', value: '12일 🔥' },
            ].map(item => (
              <div key={item.label} style={{ padding: 16, background: 'var(--bg-soft)', borderRadius: 10 }}>
                <div className="muted small">{item.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 10 }}>월별 학습 히트맵</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: 3 }}>
            {Array.from({ length: 182 }).map((_, i) => {
              const v = Math.random();
              const bg = v < 0.3 ? 'var(--bg)' : v < 0.5 ? '#c6dcfd' : v < 0.75 ? '#75a8f7' : 'var(--primary)';
              return <div key={i} style={{ aspectRatio: 1, background: bg, borderRadius: 2 }} />;
            })}
          </div>
        </div>
      </div>

      {/* 계정 관리 */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title" style={{ marginBottom: 14 }}>계정 관리</div>
        <div className="hstack" style={{ gap: 12 }}>
          <button className="btn btn-secondary btn-sm">비밀번호 변경</button>
          <button className="btn btn-secondary btn-sm">알림 설정</button>
          <span className="spacer" />
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={handleLogout}>
            <Icon name="logout" size={14} /> 로그아웃
          </button>
        </div>
      </div>
    </AppShell>
  );
}
