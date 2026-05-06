import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/common/Icon';

function Logo({ size = 'md', white = false }) {
  return (
    <div className="logo" style={{ fontSize: size === 'lg' ? 20 : 17, color: white ? '#fff' : 'var(--text)' }}>
      <div className="logo-mark" style={{ width: size === 'lg' ? 30 : 26, height: size === 'lg' ? 30 : 26, background: white ? 'rgba(255,255,255,0.18)' : undefined }}>CB</div>
      <span>큐기출</span>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      handleLogin(data.token || data.accessToken);
    } catch {
      alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{ background: 'linear-gradient(135deg, #1f6feb 0%, #14489d 100%)', padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
        <Logo size="lg" white />
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            합격까지 가장<br />짧은 길
          </div>
          <div style={{ marginTop: 16, opacity: 0.85, fontSize: 15, lineHeight: 1.6, maxWidth: 420 }}>
            실전 CBT 환경에서 풀고, AI 분석으로 내 약점을 찾고,<br />
            오답 노트로 완벽히 숙지하세요.
          </div>
        </div>
        <div style={{ fontSize: 12, opacity: 0.65 }}>© 2026 큐기출</div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 40 }}>
        <div style={{ width: 360 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>로그인</div>
          <div style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 28 }}>오랜만이에요. 학습을 이어가볼까요?</div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">이메일</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-row">
              <label className="form-label">비밀번호</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                required
              />
            </div>
            <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 20, fontSize: 13 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)' }}>
                <input type="checkbox" defaultChecked /> 자동 로그인
              </label>
              <a style={{ color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }}>비밀번호 찾기</a>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="hstack" style={{ margin: '24px 0', color: 'var(--text-4)', fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span>또는</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button className="btn btn-lg" style={{ width: '100%', background: '#FEE500', color: '#1a1a1a', marginBottom: 8 }}>
            <Icon name="kakao" size={18} color="#1a1a1a" /> 카카오로 3초 로그인
          </button>
          <button className="btn btn-secondary btn-lg" style={{ width: '100%' }}>
            <span style={{ fontWeight: 700, color: '#4285F4' }}>G</span> Google 로그인
          </button>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-3)' }}>
            아직 계정이 없으신가요?{' '}
            <a onClick={() => navigate('/signup')} style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
}
