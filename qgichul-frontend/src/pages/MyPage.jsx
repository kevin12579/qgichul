import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import Icon from '../components/common/Icon';
import { authApi } from '../api/authApi';

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자', name: '학습자', email: '' }));
  }, []);

  const handleLogout = () => { localStorage.removeItem('accessToken'); navigate('/login'); };

  const name = user?.nickname || user?.name || '학습자';

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="main-header">
        <div>
          <div className="main-title">마이페이지</div>
          <div className="main-subtitle">내 계정 정보 관리</div>
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
