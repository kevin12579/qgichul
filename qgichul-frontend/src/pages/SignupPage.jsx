import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

const CERTIFICATIONS = [
  { id: 'jpki', name: '정보처리기사', category: 'IT', popular: true },
  { id: 'jpsi', name: '정보처리산업기사', category: 'IT', popular: true },
  { id: 'jeki', name: '전기기사', category: '전기' },
  { id: 'soi', name: '소방설비기사(전기)', category: '소방' },
  { id: 'eng', name: '편입영어', category: '편입' },
  { id: 'math', name: '편입수학', category: '편입' },
];

const EDUCATION_LEVELS = [
  { value: 'HIGH_SCHOOL', label: '고등학교 졸업' },
  { value: 'COLLEGE_2_3', label: '2·3년제 대학' },
  { value: 'COLLEGE_4', label: '4년제 대학' },
  { value: 'GRADUATE', label: '대학원 이상' },
];

function Logo() {
  return (
    <div className="logo" style={{ fontSize: 20, justifyContent: 'center' }}>
      <div className="logo-mark" style={{ width: 30, height: 30 }}>CB</div>
      <span>큐기출</span>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    nickname: '',
    educationLevel: 'COLLEGE_4',
    major: '',
    termsAgree: false,
  });
  const [selectedCert, setSelectedCert] = useState('jpki');
  const [targetDate, setTargetDate] = useState('2026-08-15');
  const [dailyGoal, setDailyGoal] = useState(30);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.termsAgree) { alert('이용약관에 동의해주세요.'); return; }
    if (form.password !== form.passwordConfirm) { alert('비밀번호가 일치하지 않습니다.'); return; }
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await authApi.signup({
        email: form.email,
        password: form.password,
        name: form.name,
        nickname: form.nickname,
        educationLevel: form.educationLevel,
        major: form.educationLevel === 'HIGH_SCHOOL' ? null : form.major,
      });
      const data = await authApi.login({ email: form.email, password: form.password });
      handleLogin(data.token || data.accessToken);
    } catch (err) {
      alert(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Logo />
      </div>
      <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 36, boxShadow: 'var(--shadow-sm)' }}>
        {/* Step indicator */}
        <div className="hstack" style={{ gap: 8, marginBottom: 28 }}>
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, background: step >= s ? 'var(--primary)' : 'var(--bg)', color: step >= s ? '#fff' : 'var(--text-3)' }}>{s}</div>
              {s < 3 && <div style={{ flex: 1, height: 2, background: step > s ? 'var(--primary)' : 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>계정 만들기</div>
            <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4, marginBottom: 24 }}>이메일로 시작할게요</div>

            <div className="form-row">
              <label className="form-label">이름</label>
              <input className="form-input" placeholder="홍길동" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-row">
              <label className="form-label">닉네임</label>
              <input className="form-input" placeholder="수험생 닉네임" value={form.nickname} onChange={e => set('nickname', e.target.value)} required />
            </div>
            <div className="form-row">
              <label className="form-label">이메일</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-row">
              <label className="form-label">비밀번호</label>
              <input className="form-input" type="password" placeholder="8자 이상, 숫자·특수문자 포함" value={form.password} onChange={e => set('password', e.target.value)} required />
              <div className="form-help">영문 + 숫자 + 특수문자 조합, 최소 8자</div>
            </div>
            <div className="form-row">
              <label className="form-label">비밀번호 확인</label>
              <input className="form-input" type="password" placeholder="비밀번호 재입력" value={form.passwordConfirm} onChange={e => set('passwordConfirm', e.target.value)} required />
            </div>
            <div className="form-row">
              <label className="form-label">학력</label>
              <select className="form-input" value={form.educationLevel} onChange={e => set('educationLevel', e.target.value)}>
                {EDUCATION_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            {form.educationLevel !== 'HIGH_SCHOOL' && (
              <div className="form-row">
                <label className="form-label">전공</label>
                <input className="form-input" placeholder="예: 컴퓨터공학" value={form.major} onChange={e => set('major', e.target.value)} />
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>
                <input type="checkbox" checked={form.termsAgree} onChange={e => set('termsAgree', e.target.checked)} />
                <span>(필수) 이용약관 및 개인정보처리방침 동의</span>
              </label>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }} type="submit">다음</button>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-3)' }}>
              이미 계정이 있으신가요?{' '}
              <a onClick={() => navigate('/login')} style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>로그인</a>
            </div>
          </form>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>관심 자격증 선택</div>
            <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4, marginBottom: 24 }}>가장 많이 풀고 싶은 시험을 고르세요 (나중에 변경 가능)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CERTIFICATIONS.map(c => (
                <div key={c.id} onClick={() => setSelectedCert(c.id)}
                  style={{ padding: 16, border: `2px solid ${selectedCert === c.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', background: selectedCert === c.id ? 'var(--primary-50)' : '#fff' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{c.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{c.name}</div>
                  {c.popular && <span className="badge primary" style={{ marginTop: 8 }}>인기</span>}
                </div>
              ))}
            </div>
            <div className="hstack" style={{ gap: 8, marginTop: 24 }}>
              <button className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => setStep(1)}>이전</button>
              <button className="btn btn-primary btn-lg" style={{ flex: 2 }} onClick={() => setStep(3)}>다음</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>목표 설정</div>
            <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4, marginBottom: 24 }}>합격 목표일과 일일 학습량을 알려주세요</div>
            <div className="form-row">
              <label className="form-label">목표 시험일</label>
              <input type="date" className="form-input" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">일일 목표 문제 수</label>
              <input type="number" className="form-input" value={dailyGoal} onChange={e => setDailyGoal(e.target.value)} min={5} max={200} />
              <div className="form-help">하루 {dailyGoal}문제 × 매일 꾸준히 학습</div>
            </div>
            <div style={{ padding: 14, background: 'var(--primary-50)', borderRadius: 10, marginTop: 12, fontSize: 13, color: 'var(--primary-700)', lineHeight: 1.6 }}>
              🎉 회원가입 축하 선물!<br />
              <b>Pro 플랜 7일 무료 체험</b>이 자동으로 시작됩니다.
            </div>
            <div className="hstack" style={{ gap: 8, marginTop: 24 }}>
              <button className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => setStep(2)}>이전</button>
              <button className="btn btn-primary btn-lg" style={{ flex: 2 }} onClick={handleFinish} disabled={loading}>
                {loading ? '처리 중...' : '시작하기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
