// Landing page, Auth screens, Dashboard, Exam selection
const D = window.EXAM_DATA;

// ============ Landing Page ============
const Landing = ({ go }) => (
  <div className="app">
    <div className="topnav" style={{padding:'0 40px'}}>
      <Logo/>
      <div className="nav-links" style={{marginLeft: 32}}>
        <div className="nav-link">기능</div>
        <div className="nav-link">가격</div>
        <div className="nav-link">자격증</div>
        <div className="nav-link">고객후기</div>
      </div>
      <div className="nav-right">
        <button className="btn btn-ghost btn-sm" onClick={() => go('login')}>로그인</button>
        <button className="btn btn-primary btn-sm" onClick={() => go('signup')}>무료 시작</button>
      </div>
    </div>

    {/* Hero */}
    <div className="landing-hero">
      <div className="kicker">🎯 합격률 +23% 입증</div>
      <h1>시험 붙는 사람들은<br/>다 쓰는 그 서비스</h1>
      <p className="sub">CBT 실전 환경에서 기출문제를 풀고,<br/>AI가 내 약점을 찾아주는 스마트 학습 플랫폼</p>
      <div className="hstack" style={{justifyContent:'center', gap: 10}}>
        <button className="btn btn-primary btn-lg" onClick={() => go('signup')}>7일 무료 체험 시작</button>
        <button className="btn btn-secondary btn-lg">기능 둘러보기</button>
      </div>
      <div style={{marginTop: 40, color:'var(--text-3)', fontSize:13}}>
        누적 회원 <b style={{color:'var(--text)'}}>128,400명</b>  ·  풀이 문제 수 <b style={{color:'var(--text)'}}>4,820만+</b>  ·  앱스토어 평점 <b style={{color:'var(--text)'}}>4.8</b>
      </div>

      {/* Hero mock */}
      <div style={{maxWidth: 960, margin: '56px auto 0', padding: '0 20px'}}>
        <div style={{background:'#fff', border:'1px solid var(--border)', borderRadius: 16, overflow:'hidden', boxShadow:'var(--shadow-lg)'}}>
          <div style={{background:'#2d3748', height: 44, display:'flex', alignItems:'center', padding: '0 16px', gap:10, color:'#fff', fontSize:12}}>
            <div style={{display:'flex', gap:6}}>
              <div style={{width:10, height:10, background:'#f87171', borderRadius:'50%'}}/>
              <div style={{width:10, height:10, background:'#fbbf24', borderRadius:'50%'}}/>
              <div style={{width:10, height:10, background:'#4ade80', borderRadius:'50%'}}/>
            </div>
            <span style={{marginLeft: 20}}>정보처리기사 2024년 1회 • CBT 실전 모드</span>
            <span style={{marginLeft:'auto', fontFamily:'var(--font-mono)', background:'#1a202c', padding:'4px 10px', borderRadius:4}}>01:23:42</span>
          </div>
          <div style={{padding: 28, textAlign:'left', display:'grid', gridTemplateColumns:'1fr 240px', gap: 24}}>
            <div>
              <div style={{fontSize:12, color:'var(--text-3)', fontWeight:600, marginBottom:8}}>문제 7 / 100 · 데이터베이스 구축</div>
              <div style={{fontSize: 15, color:'var(--text)', lineHeight:1.7, marginBottom: 16}}>관계형 데이터베이스에서 한 릴레이션의 기본키를 참조하는 다른 릴레이션의 속성은?</div>
              {['기본키','후보키','외래키','대체키'].map((o,i) => (
                <div key={i} className={`cbt-option ${i === 2 ? 'selected' : ''}`} style={{marginBottom: 6}}>
                  <div className="cbt-option-num">{i+1}</div>
                  <div className="cbt-option-text">{o}</div>
                </div>
              ))}
            </div>
            <div style={{background:'var(--bg-soft)', padding: 14, borderRadius: 8, border:'1px solid var(--border)'}}>
              <div style={{fontSize:11, fontWeight:700, color:'var(--text-3)', letterSpacing:'.04em', marginBottom:10}}>문항 현황</div>
              <div className="qgrid">
                {Array.from({length: 20}).map((_, i) => (
                  <div key={i} className={`qgrid-cell ${i < 6 ? 'answered' : ''} ${i === 6 ? 'current' : ''} ${i === 3 ? 'flagged' : ''}`} style={{fontSize:10}}>{i+1}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="landing-section">
      <h2>왜 큐기출일까요?</h2>
      <p className="section-sub">기출을 푸는 것에서 끝나지 않습니다. 합격까지 이끌어 드립니다.</p>
      <div className="grid grid-3">
        {[
          { icon: 'target', title: '실전 CBT UI 재현', desc: '실제 큐넷 시험장과 동일한 환경으로 시험 당일 적응 시간을 0으로 만듭니다.' },
          { icon: 'chart', title: 'AI 약점 분석', desc: '과목별·단원별 정답률을 실시간 집계. 취약 단원 TOP 5를 자동으로 알려드립니다.' },
          { icon: 'note', title: '스마트 오답 노트', desc: '틀린 문제 자동 저장. 오답만 모아 재시험. 같은 실수 반복은 이제 그만.' },
          { icon: 'upload', title: 'PDF 자동 DB화', desc: '내 기출 PDF를 업로드하면 AI가 문제·보기·정답을 구조화해 개인 문제집을 만듭니다.' },
          { icon: 'fire', title: '실전 타이머', desc: '서버 기반 타이머로 새로고침해도 시간이 유지. 이탈·복귀까지 기록됩니다.' },
          { icon: 'trophy', title: '합격률 예측', desc: '최근 3회 응시 결과로 합격 가능성을 예측. 목표 점수까지 남은 학습량을 시각화.' },
        ].map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon"><Icon name={f.icon} size={22}/></div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Pricing */}
    <div className="landing-section" style={{background:'var(--bg-soft)', maxWidth:'none', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
      <div style={{maxWidth: 1200, margin:'0 auto', padding: '0 24px'}}>
        <h2>합리적인 가격</h2>
        <p className="section-sub">필요한 만큼만. 언제든 변경·해지 가능합니다.</p>
        <div className="grid grid-3">
          {[
            { name:'Free', price:0, features:['일 20문제 풀이','기본 성적 통계','커뮤니티 해설','광고 포함'], cta:'무료로 시작'},
            { name:'Basic', price:9900, features:['무제한 문제 풀이','전체 오답 노트','과목별 약점 분석','광고 없음','모바일 앱'], cta:'Basic 시작', popular:true},
            { name:'Pro', price:19900, features:['Basic 전체 포함','AI 약점 맞춤 추천','PDF 업로드 (내 문제집)','합격률 예측','팀/단체 계정'], cta:'Pro 시작'},
          ].map(p => (
            <div key={p.name} className={`pricing-card ${p.popular ? 'popular' : ''}`}>
              {p.popular && <div className="popular-tag">가장 인기</div>}
              <div style={{fontSize:14, fontWeight:700, color:'var(--text-3)'}}>{p.name}</div>
              <div className="price" style={{marginTop:8}}>
                {p.price === 0 ? '무료' : `₩${p.price.toLocaleString()}`}
                {p.price > 0 && <small> /월</small>}
              </div>
              <ul className="pricing-features">
                {p.features.map(f => (
                  <li key={f}><Icon name="check" size={16} color="#16a34a"/> {f}</li>
                ))}
              </ul>
              <button className={`btn btn-lg ${p.popular ? 'btn-primary' : 'btn-secondary'}`} onClick={() => go('signup')}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="landing-section" style={{textAlign:'center'}}>
      <h2>지금 바로 합격 루틴을 시작하세요</h2>
      <p className="section-sub">신용카드 등록 없이 7일간 모든 기능을 무료로 체험해보세요</p>
      <button className="btn btn-primary btn-lg" onClick={() => go('signup')}>무료로 시작하기 →</button>
    </div>

    <footer style={{background:'#1a202c', color:'#cbd5e0', padding:'40px 24px', textAlign:'center', fontSize:13}}>
      <Logo/>
      <div style={{marginTop: 12}}>© 2026 큐기출 · 대표 홍길동 · 사업자등록번호 123-45-67890</div>
      <div style={{marginTop: 6, color:'#718096'}}>이용약관 · 개인정보처리방침 · 고객센터 · 제휴문의</div>
    </footer>
  </div>
);
window.Landing = Landing;

// ============ Login ============
const Login = ({ go, onLogin }) => {
  const [email, setEmail] = React.useState('test@test.com');
  const [pw, setPw] = React.useState('••••••••');
  return (
    <div style={{minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', background:'var(--bg)'}}>
      <div style={{background:'linear-gradient(135deg, #1f6feb 0%, #14489d 100%)', padding:'80px 60px', display:'flex', flexDirection:'column', justifyContent:'space-between', color:'#fff'}}>
        <div className="logo" style={{color:'#fff', fontSize:22}}>
          <div className="logo-mark" style={{background:'rgba(255,255,255,0.18)'}}>CB</div>
          큐기출
        </div>
        <div>
          <div style={{fontSize: 36, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.2}}>
            합격까지 가장<br/>짧은 길
          </div>
          <div style={{marginTop: 16, opacity: 0.85, fontSize: 15, lineHeight:1.6, maxWidth: 420}}>
            실전 CBT 환경에서 풀고, AI 분석으로 내 약점을 찾고,<br/>
            오답 노트로 완벽히 숙지하세요.
          </div>
        </div>
        <div style={{fontSize:12, opacity:0.65}}>© 2026 큐기출</div>
      </div>

      <div style={{display:'grid', placeItems:'center', padding: 40}}>
        <div style={{width: 360}}>
          <div style={{fontSize: 26, fontWeight: 800, letterSpacing:'-0.02em', marginBottom: 6}}>로그인</div>
          <div style={{color:'var(--text-3)', fontSize:14, marginBottom: 28}}>오랜만이에요. 학습을 이어가볼까요?</div>

          <div className="form-row">
            <label className="form-label">이메일</label>
            <input className="form-input" value={email} onChange={e => setEmail(e.target.value)}/>
          </div>
          <div className="form-row">
            <label className="form-label">비밀번호</label>
            <input type="password" className="form-input" value={pw} onChange={e => setPw(e.target.value)}/>
          </div>
          <div className="hstack" style={{justifyContent:'space-between', marginBottom: 20, fontSize:13}}>
            <label style={{display:'flex', alignItems:'center', gap:6, color:'var(--text-2)'}}>
              <input type="checkbox" defaultChecked/> 자동 로그인
            </label>
            <a style={{color:'var(--primary)', fontWeight:500, cursor:'pointer'}}>비밀번호 찾기</a>
          </div>
          <button className="btn btn-primary btn-lg" style={{width:'100%'}} onClick={onLogin}>로그인</button>

          <div className="hstack" style={{margin:'24px 0', color:'var(--text-4)', fontSize:12}}>
            <div style={{flex:1, height:1, background:'var(--border)'}}></div>
            <span>또는</span>
            <div style={{flex:1, height:1, background:'var(--border)'}}></div>
          </div>

          <button className="btn btn-lg" style={{width:'100%', background:'#FEE500', color:'#1a1a1a', marginBottom: 8}}>
            <Icon name="kakao" size={18} color="#1a1a1a"/> 카카오로 3초 로그인
          </button>
          <button className="btn btn-secondary btn-lg" style={{width:'100%'}}>
            <span style={{fontWeight:700, color:'#4285F4'}}>G</span> Google 로그인
          </button>

          <div style={{textAlign:'center', marginTop: 24, fontSize:13, color:'var(--text-3)'}}>
            아직 계정이 없으신가요? <a onClick={() => go('signup')} style={{color:'var(--primary)', fontWeight:600, cursor:'pointer'}}>회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
};
window.Login = Login;

// ============ Signup ============
const Signup = ({ go, onLogin }) => {
  const [step, setStep] = React.useState(1);
  const [cert, setCert] = React.useState('jpki');
  return (
    <div style={{minHeight:'100vh', background:'var(--bg)', padding:'48px 24px'}}>
      <div style={{textAlign:'center', marginBottom: 32}}>
        <div style={{display:'inline-block', cursor:'pointer'}} onClick={() => go('landing')}><Logo size="lg"/></div>
      </div>
      <div style={{maxWidth: 480, margin:'0 auto', background:'#fff', border:'1px solid var(--border)', borderRadius: 16, padding: 36, boxShadow:'var(--shadow-sm)'}}>
        <div className="hstack" style={{gap:8, marginBottom: 28}}>
          {[1,2,3].map(s => (
            <React.Fragment key={s}>
              <div style={{width:28, height:28, borderRadius:'50%', display:'grid', placeItems:'center', fontWeight:700, fontSize:13, background: step >= s ? 'var(--primary)' : 'var(--bg)', color: step >= s ? '#fff' : 'var(--text-3)'}}>{s}</div>
              {s < 3 && <div style={{flex:1, height:2, background: step > s ? 'var(--primary)' : 'var(--border)'}}/>}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{fontSize: 22, fontWeight: 800, letterSpacing:'-0.02em'}}>계정 만들기</div>
            <div style={{color:'var(--text-3)', fontSize:13, marginTop: 4, marginBottom: 24}}>이메일로 시작할게요</div>
            <div className="form-row">
              <label className="form-label">이메일</label>
              <input className="form-input" placeholder="your@email.com"/>
            </div>
            <div className="form-row">
              <label className="form-label">비밀번호</label>
              <input type="password" className="form-input" placeholder="8자 이상, 숫자·특수문자 포함"/>
              <div className="form-help">영문 + 숫자 + 특수문자 조합, 최소 8자</div>
            </div>
            <div className="form-row">
              <label className="form-label">닉네임</label>
              <input className="form-input" placeholder="수험생 닉네임"/>
            </div>
            <div style={{marginTop: 12}}>
              <label style={{display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'var(--text-2)', marginBottom: 6}}>
                <input type="checkbox" defaultChecked/> <span>(필수) 이용약관 및 개인정보처리방침 동의</span>
              </label>
              <label style={{display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'var(--text-2)'}}>
                <input type="checkbox"/> <span>(선택) 학습 리포트·합격 소식 메일 수신</span>
              </label>
            </div>
            <button className="btn btn-primary btn-lg" style={{width:'100%', marginTop: 20}} onClick={() => setStep(2)}>다음</button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{fontSize: 22, fontWeight: 800, letterSpacing:'-0.02em'}}>관심 자격증 선택</div>
            <div style={{color:'var(--text-3)', fontSize:13, marginTop: 4, marginBottom: 24}}>가장 많이 풀고 싶은 시험을 고르세요 (나중에 변경 가능)</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
              {D.certifications.map(c => (
                <div key={c.id} onClick={() => setCert(c.id)}
                  style={{padding: 16, border: `2px solid ${cert === c.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor:'pointer', background: cert === c.id ? 'var(--primary-50)' : '#fff'}}>
                  <div style={{fontSize:11, color:'var(--text-3)', fontWeight:600}}>{c.category}</div>
                  <div style={{fontSize:14, fontWeight:700, marginTop: 4}}>{c.name}</div>
                  {c.popular && <span className="badge primary" style={{marginTop:8}}>인기</span>}
                </div>
              ))}
            </div>
            <div className="hstack" style={{gap:8, marginTop: 24}}>
              <button className="btn btn-secondary btn-lg" style={{flex:1}} onClick={() => setStep(1)}>이전</button>
              <button className="btn btn-primary btn-lg" style={{flex:2}} onClick={() => setStep(3)}>다음</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{fontSize: 22, fontWeight: 800, letterSpacing:'-0.02em'}}>목표 설정</div>
            <div style={{color:'var(--text-3)', fontSize:13, marginTop: 4, marginBottom: 24}}>합격 목표일과 일일 학습량을 알려주세요</div>
            <div className="form-row">
              <label className="form-label">목표 시험일</label>
              <input type="date" className="form-input" defaultValue="2026-08-15"/>
            </div>
            <div className="form-row">
              <label className="form-label">일일 목표 문제 수</label>
              <input type="number" className="form-input" defaultValue="30"/>
              <div className="form-help">하루 30문제 × 남은 100일 = 3,000문제 풀이 목표</div>
            </div>
            <div style={{padding: 14, background:'var(--primary-50)', borderRadius: 10, marginTop: 12, fontSize:13, color:'var(--primary-700)', lineHeight:1.6}}>
              🎉 회원가입 축하 선물!<br/>
              <b>Pro 플랜 7일 무료 체험</b>이 자동으로 시작됩니다.
            </div>
            <div className="hstack" style={{gap:8, marginTop: 24}}>
              <button className="btn btn-secondary btn-lg" style={{flex:1}} onClick={() => setStep(2)}>이전</button>
              <button className="btn btn-primary btn-lg" style={{flex:2}} onClick={onLogin}>시작하기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
window.Signup = Signup;
