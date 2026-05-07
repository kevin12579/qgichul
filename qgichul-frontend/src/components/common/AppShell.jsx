import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';

function Logo({ size = 'md' }) {
  return (
    <div className="logo" style={{ fontSize: size === 'lg' ? 20 : 17 }}>
      <div className="logo-mark" style={{ width: size === 'lg' ? 30 : 26, height: size === 'lg' ? 30 : 26 }}>CB</div>
      <span>큐기출</span>
    </div>
  );
}

function TopNav({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname.split('/')[1] || 'dashboard';
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/exams?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const links = [
    { id: 'dashboard', label: '홈' },
    { id: 'exams', label: '시험선택' },
    { id: 'notes', label: '오답노트' },
    { id: 'stats', label: '통계' },
    { id: 'ai', label: 'AI 분석' },
  ];

  return (
    <div className="topnav">
      <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <Logo />
      </div>
      <div className="nav-links">
        {links.map(l => (
          <div
            key={l.id}
            className={`nav-link ${current === l.id ? 'active' : ''}`}
            onClick={() => navigate(`/${l.id}`)}
          >
            {l.label}
          </div>
        ))}
      </div>
      <div className="nav-right">
        <div className="nav-search">
          <span className="search-icon"><Icon name="search" size={16} color="var(--text-4)" /></span>
          <input
            placeholder="자격증·시험·단원 검색"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <span className="nav-plan-badge free">FREE</span>
        <div className="avatar" onClick={() => navigate('/mypage')} title={user?.nickname || '내 정보'}>
          {(user?.nickname || user?.name || 'U')[0]}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout} title="로그아웃">
          <Icon name="logout" size={16} />
        </button>
      </div>
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname.split('/')[1] || 'dashboard';

  const sections = [
    {
      title: '학습',
      items: [
        { id: 'dashboard', icon: 'home', label: '홈' },
        { id: 'exams', icon: 'book', label: '시험 선택' },
        { id: 'notes', icon: 'note', label: '오답 노트' },
      ],
    },
    {
      title: '분석',
      items: [
        { id: 'stats', icon: 'chart', label: '성적 통계' },
        { id: 'ai', icon: 'brain', label: 'AI 분석' },
      ],
    },
    {
      title: '계정',
      items: [
        { id: 'mypage', icon: 'user', label: '마이페이지' },
      ],
    },
  ];

  return (
    <div className="sidebar">
      {sections.map(s => (
        <div className="sidebar-section" key={s.title}>
          <div className="sidebar-title">{s.title}</div>
          {s.items.map(it => (
            <div
              key={it.id}
              className={`sidebar-item ${current === it.id ? 'active' : ''}`}
              onClick={() => navigate(`/${it.id}`)}
            >
              <span className="icon"><Icon name={it.icon} size={17} /></span>
              {it.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AppShell({ user, onLogout, children }) {
  return (
    <div className="app">
      <TopNav user={user} onLogout={onLogout} />
      <div className="layout">
        <Sidebar />
        <div className="main">{children}</div>
      </div>
    </div>
  );
}

export { Logo };
