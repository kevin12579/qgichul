// PDF Upload, Admin, MyPage/Settings
const D = window.EXAM_DATA;

// ============ PDF Upload (Pro) ============
const PdfUpload = ({ go, user }) => {
  const [step, setStep] = React.useState(user.plan === 'pro' ? 1 : 0);
  return (
    <>
      <div className="main-header">
        <div>
          <div className="main-title">PDF 업로드 <span className="badge" style={{background:'linear-gradient(135deg,#fff4e0,#ffe0b3)',color:'#8a5a00',marginLeft:8}}>PRO</span></div>
          <div className="main-subtitle">기출 PDF를 올리면 AI가 문제·보기·정답을 자동으로 구조화해 개인 문제집을 만들어요</div>
        </div>
      </div>

      {step === 0 && (
        <div className="card" style={{textAlign:'center', padding: '60px 40px'}}>
          <div style={{width: 72, height: 72, borderRadius: 18, background:'linear-gradient(135deg,#fff4e0,#ffe0b3)', display:'grid', placeItems:'center', margin:'0 auto 20px'}}>
            <Icon name="upload" size={36} color="#8a5a00"/>
          </div>
          <div style={{fontSize:20, fontWeight:800, letterSpacing:'-0.02em', marginBottom:8}}>Pro 플랜 전용 기능입니다</div>
          <div style={{color:'var(--text-3)', fontSize:14, marginBottom:24, lineHeight:1.6}}>
            PDF 업로드와 AI 구조화는 Pro 플랜에서 무제한으로 이용할 수 있습니다.<br/>
            월 19,900원으로 내 기출을 개인 문제집으로 바꿔보세요.
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => go('settings')}>Pro로 업그레이드 →</button>
        </div>
      )}

      {step === 1 && (
        <>
          {/* Dropzone */}
          <div style={{border:'2px dashed var(--border-strong)', borderRadius: 14, padding: 48, textAlign:'center', background:'var(--bg-soft)', marginBottom: 20, cursor:'pointer'}}
            onClick={() => setStep(2)}>
            <Icon name="upload" size={44} color="var(--primary)"/>
            <div style={{fontSize: 17, fontWeight: 700, marginTop: 14}}>PDF 파일을 끌어다 놓거나 클릭하세요</div>
            <div style={{fontSize:13, color:'var(--text-3)', marginTop: 6}}>최대 20MB · PDF만 지원 · 한 번에 최대 5개 파일</div>
            <button className="btn btn-secondary" style={{marginTop: 20}}>파일 선택</button>
          </div>

          {/* Upload history */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">내 업로드 이력</div>
              <div className="card-subtitle">최근 업로드 10개</div>
            </div>
            <table className="table">
              <thead><tr><th>파일명</th><th>상태</th><th>추출 문항</th><th>업로드</th><th>작업</th></tr></thead>
              <tbody>
                {[
                  { n:'정보처리기사_2024_1회_기출.pdf', s:'완료', q:100, d:'04.26', m:'text'},
                  { n:'전기기사_필기_2023_실전모의.pdf', s:'검수 대기', q:80, d:'04.25', m:'ocr'},
                  { n:'편입수학_2024_주요대학.pdf', s:'파싱 중 (42%)', q:0, d:'04.24', m:'ocr'},
                  { n:'정보처리기사_2023_3회.pdf', s:'완료', q:100, d:'04.20', m:'text'},
                ].map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div className="hstack" style={{gap:10}}>
                        <Icon name="folder" size={16} color="var(--text-3)"/>
                        <div>
                          <div style={{fontWeight:500}}>{r.n}</div>
                          <div className="muted small">{r.m === 'text' ? 'PyMuPDF 텍스트 추출' : 'Tesseract OCR'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {r.s === '완료' && <span className="badge success"><Icon name="check" size={10}/> 완료</span>}
                      {r.s.includes('파싱') && <span className="badge info">⏳ {r.s}</span>}
                      {r.s.includes('검수') && <span className="badge warning">⚠ 검수 필요</span>}
                    </td>
                    <td>{r.q > 0 ? <b>{r.q}문항</b> : <span className="muted">-</span>}</td>
                    <td className="muted small">{r.d}</td>
                    <td>
                      <div className="hstack" style={{gap:4}}>
                        <button className="btn btn-ghost btn-sm"><Icon name="eye" size={14}/></button>
                        <button className="btn btn-ghost btn-sm"><Icon name="edit" size={14}/></button>
                        <button className="btn btn-ghost btn-sm" style={{color:'var(--danger)'}}><Icon name="trash" size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="card" style={{marginBottom: 20}}>
            <div className="hstack" style={{gap: 16, marginBottom: 16}}>
              <Icon name="folder" size={28} color="var(--primary)"/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700}}>정보처리기사_2024_1회_기출.pdf</div>
                <div className="muted small">3.2MB · 52페이지 · 업로드 완료</div>
              </div>
              <span className="badge success"><Icon name="check" size={10}/> 파싱 완료</span>
            </div>
            <div className="progress"><div className="progress-bar success" style={{width:'100%'}}></div></div>
            <div style={{marginTop:14, padding: 14, background:'var(--bg-soft)', borderRadius: 8, fontSize: 13, lineHeight: 1.7}}>
              <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
                <div><div className="muted small">추출 모드</div><b>PyMuPDF 텍스트</b></div>
                <div><div className="muted small">추출 문항</div><b>100 / 100</b></div>
                <div><div className="muted small">이미지 OCR</div><b>14개</b></div>
                <div><div className="muted small">예상 정확도</div><b style={{color:'var(--success)'}}>98.2%</b></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">추출된 문항 검수</div>
              <div className="hstack" style={{gap:8}}>
                <button className="btn btn-secondary btn-sm">전체 승인</button>
                <button className="btn btn-primary btn-sm">문제집으로 저장</button>
              </div>
            </div>
            {D.questions.slice(0, 3).map((q, i) => (
              <div key={q.id} style={{border:'1px solid var(--border)', borderRadius:10, padding:16, marginBottom: 12}}>
                <div className="hstack" style={{marginBottom:8}}>
                  <b style={{fontSize:13}}>문항 {i+1}</b>
                  <span className="badge">{D.subjects.find(s=>s.id===q.subject)?.name}</span>
                  <span className="badge">{q.unit}</span>
                  <span className="spacer"></span>
                  <span className="badge success">자동 추출</span>
                  <button className="btn btn-ghost btn-sm"><Icon name="edit" size={13}/></button>
                </div>
                <div style={{fontSize: 14, marginBottom: 10, lineHeight:1.6}}>{q.text}</div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
                  {q.options.map((o, oi) => (
                    <div key={oi} style={{padding:'8px 10px', border:'1px solid var(--border)', borderRadius:6, fontSize:13, background: oi === q.answer ? 'var(--success-50)' : '#fff'}}>
                      <span className="mono" style={{marginRight:6, color:'var(--text-3)'}}>{oi+1}.</span>{o}
                      {oi === q.answer && <span style={{marginLeft:6, color:'var(--success)', fontWeight:700}}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{textAlign:'center', padding: 16}}>
              <button className="btn btn-secondary">문항 97개 더보기</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
window.PdfUpload = PdfUpload;

// ============ Admin ============
const Admin = ({ go }) => {
  const [tab, setTab] = React.useState('questions');
  return (
    <>
      <div className="main-header">
        <div>
          <div className="main-title">관리자 <span className="badge danger" style={{marginLeft:8}}>ADMIN</span></div>
          <div className="main-subtitle">문제 등록·수정·검수 · 사용자 관리</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> 새 문항 등록</button>
      </div>

      <div className="grid grid-4" style={{marginBottom: 20}}>
        <div className="kpi"><div className="kpi-label">총 문항</div><div className="kpi-value">18,420</div><div className="kpi-delta up">+248 이번 주</div></div>
        <div className="kpi"><div className="kpi-label">검수 대기</div><div className="kpi-value" style={{color:'var(--warning)'}}>32</div><div className="kpi-delta"><span className="muted">검수 필요</span></div></div>
        <div className="kpi"><div className="kpi-label">누적 사용자</div><div className="kpi-value">128,402</div><div className="kpi-delta up">+1,240 이번 주</div></div>
        <div className="kpi"><div className="kpi-label">유료 전환율</div><div className="kpi-value">8.4<span style={{fontSize:14, color:'var(--text-3)', fontWeight:600}}>%</span></div><div className="kpi-delta up">+0.6%p</div></div>
      </div>

      <div className="segmented" style={{marginBottom: 16}}>
        <button className={tab==='questions'?'active':''} onClick={()=>setTab('questions')}>문제 관리</button>
        <button className={tab==='exams'?'active':''} onClick={()=>setTab('exams')}>시험 회차</button>
        <button className={tab==='users'?'active':''} onClick={()=>setTab('users')}>사용자</button>
        <button className={tab==='reports'?'active':''} onClick={()=>setTab('reports')}>신고 처리</button>
      </div>

      {tab === 'questions' && (
        <div className="card" style={{padding:0}}>
          <div style={{padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', gap:8, alignItems:'center'}}>
            <select className="form-input" style={{height:34, fontSize:13, width:160}}><option>정보처리기사</option></select>
            <select className="form-input" style={{height:34, fontSize:13, width:140}}><option>전체 과목</option></select>
            <select className="form-input" style={{height:34, fontSize:13, width:130}}><option>전체 상태</option></select>
            <div style={{position:'relative', flex:1, maxWidth:300}}>
              <input className="form-input" style={{height:34, paddingLeft:32}} placeholder="문항 검색"/>
              <Icon name="search" size={14}/>
            </div>
          </div>
          <table className="table">
            <thead><tr><th style={{width:60}}>ID</th><th>문항</th><th>과목</th><th>단원</th><th>난이도</th><th>상태</th><th>작성자</th><th>작업</th></tr></thead>
            <tbody>
              {D.questions.slice(0, 10).map(q => {
                const sub = D.subjects.find(s=>s.id===q.subject);
                return (
                  <tr key={q.id}>
                    <td className="mono muted">#{String(q.id).padStart(5,'0')}</td>
                    <td style={{maxWidth:380}}><div className="truncate">{q.text}</div></td>
                    <td><span className="badge">{sub?.name}</span></td>
                    <td className="muted small">{q.unit}</td>
                    <td>{'★'.repeat(q.difficulty)}<span className="muted">{'★'.repeat(5-q.difficulty).replace(/★/g,'☆')}</span></td>
                    <td>{q.id % 5 === 0 ? <span className="badge warning">검수대기</span> : <span className="badge success">공개</span>}</td>
                    <td className="muted small">admin</td>
                    <td>
                      <div className="hstack" style={{gap:4}}>
                        <button className="btn btn-ghost btn-sm"><Icon name="edit" size={13}/></button>
                        <button className="btn btn-ghost btn-sm" style={{color:'var(--danger)'}}><Icon name="trash" size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{padding:14, borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--text-3)'}}>
            <span>총 18,420개 중 1–10</span>
            <div className="hstack" style={{gap:4}}>
              <button className="btn btn-secondary btn-sm" disabled>이전</button>
              <button className="btn btn-primary btn-sm">1</button>
              <button className="btn btn-secondary btn-sm">2</button>
              <button className="btn btn-secondary btn-sm">3</button>
              <button className="btn btn-secondary btn-sm">다음</button>
            </div>
          </div>
        </div>
      )}

      {tab !== 'questions' && (
        <div className="card" style={{padding: 60, textAlign:'center', color:'var(--text-3)'}}>
          <Icon name="folder" size={40}/>
          <div style={{marginTop: 12}}>해당 탭 콘텐츠 준비 중</div>
        </div>
      )}
    </>
  );
};
window.Admin = Admin;

// ============ MyPage & Settings ============
const MyPage = ({ go, user }) => (
  <>
    <div className="main-header">
      <div>
        <div className="main-title">마이페이지</div>
        <div className="main-subtitle">내 학습 요약 · 목표 관리</div>
      </div>
    </div>

    <div className="card" style={{marginBottom: 16, display:'flex', alignItems:'center', gap:20, padding: 28}}>
      <div className="avatar" style={{width:72, height:72, fontSize:28}}>{user.name[0]}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:22, fontWeight:800, letterSpacing:'-0.02em'}}>{user.name}</div>
        <div style={{color:'var(--text-3)', fontSize:13, marginTop:2}}>hong@example.com · 가입일 2025.12.03</div>
        <div className="hstack" style={{gap:8, marginTop:10}}>
          <span className={`nav-plan-badge ${user.plan}`}>{user.plan.toUpperCase()}</span>
          <span className="muted small">남은 이용 기간 24일</span>
        </div>
      </div>
      <button className="btn btn-secondary"><Icon name="edit" size={14}/> 프로필 수정</button>
    </div>

    <div className="grid grid-2" style={{gap:16}}>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>학습 목표</div>
        <div className="form-row">
          <label className="form-label">관심 자격증</label>
          <div className="hstack" style={{gap:6, flexWrap:'wrap'}}>
            <span className="chip active">정보처리기사</span>
            <span className="chip">SQLD</span>
            <span className="chip">+ 추가</span>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">목표 시험일</label>
          <input type="date" className="form-input" defaultValue="2026-08-15"/>
          <div className="form-help">D-112</div>
        </div>
        <div className="form-row">
          <label className="form-label">일일 목표 문제 수</label>
          <input type="number" className="form-input" defaultValue="30"/>
        </div>
        <button className="btn btn-primary" style={{marginTop:8}}>저장</button>
      </div>

      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>학습 요약</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14}}>
          <div style={{padding:16, background:'var(--bg-soft)', borderRadius:10}}><div className="muted small">누적 풀이</div><div style={{fontSize:22, fontWeight:800}}>1,284</div></div>
          <div style={{padding:16, background:'var(--bg-soft)', borderRadius:10}}><div className="muted small">오답 노트</div><div style={{fontSize:22, fontWeight:800}}>348</div></div>
          <div style={{padding:16, background:'var(--bg-soft)', borderRadius:10}}><div className="muted small">응시 횟수</div><div style={{fontSize:22, fontWeight:800}}>24</div></div>
          <div style={{padding:16, background:'var(--bg-soft)', borderRadius:10}}><div className="muted small">연속 학습</div><div style={{fontSize:22, fontWeight:800}}>12일 🔥</div></div>
        </div>
        <div className="divider"></div>
        <div style={{fontSize:13, color:'var(--text-3)', marginBottom:10}}>월별 학습 히트맵</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(26, 1fr)', gap:3}}>
          {Array.from({length: 182}).map((_,i)=>{
            const v = Math.random();
            const bg = v < 0.3 ? 'var(--bg)' : v < 0.5 ? '#c6dcfd' : v < 0.75 ? '#75a8f7' : 'var(--primary)';
            return <div key={i} style={{aspectRatio:1, background:bg, borderRadius:2}}></div>;
          })}
        </div>
      </div>
    </div>
  </>
);
window.MyPage = MyPage;

const Settings = ({ go, user }) => (
  <>
    <div className="main-header">
      <div>
        <div className="main-title">설정 / 결제</div>
        <div className="main-subtitle">플랜 관리 · 알림 · 계정</div>
      </div>
    </div>

    {/* Plan */}
    <div className="card" style={{marginBottom:16, padding: 24, background: 'linear-gradient(135deg, #1f6feb 0%, #14489d 100%)', color:'#fff', border:'none'}}>
      <div className="hstack">
        <div style={{flex:1}}>
          <div style={{fontSize:12, opacity:0.85, fontWeight:700, letterSpacing:'.08em'}}>현재 플랜</div>
          <div style={{fontSize:26, fontWeight:800, letterSpacing:'-0.02em', marginTop:4}}>
            {user.plan.toUpperCase()} <span style={{fontSize:16, opacity:0.7}}>· {user.plan==='pro'?'₩19,900':'무료'}/월</span>
          </div>
          <div style={{marginTop:6, opacity:0.85, fontSize:13}}>다음 결제일 2026.05.26 · 남은 체험 기간 24일</div>
        </div>
        <button className="btn" style={{background:'rgba(255,255,255,0.2)', color:'#fff'}}>결제 수단 변경</button>
      </div>
    </div>

    <div className="grid grid-3" style={{marginBottom: 20}}>
      {[
        { n:'Free', price:0, features:['일 20문제','기본 통계','광고 포함']},
        { n:'Basic', price:9900, features:['무제한 풀이','오답 노트','과목별 분석','광고 없음']},
        { n:'Pro', price:19900, features:['Basic 전체','AI 약점 추천','PDF 업로드','합격률 예측'], popular: true},
      ].map(p => (
        <div key={p.n} className={`pricing-card ${p.popular?'popular':''}`}>
          {p.popular && <div className="popular-tag">Pro 체험 중</div>}
          <div style={{fontSize:14, fontWeight:700, color:'var(--text-3)'}}>{p.n}</div>
          <div className="price" style={{marginTop:8}}>
            {p.price === 0 ? '무료' : `₩${p.price.toLocaleString()}`}
            {p.price > 0 && <small> /월</small>}
          </div>
          <ul className="pricing-features">
            {p.features.map(f => <li key={f}><Icon name="check" size={14} color="#16a34a"/>{f}</li>)}
          </ul>
          <button className={`btn ${p.popular?'btn-secondary':'btn-secondary'}`} disabled={p.popular}>{p.popular?'현재 플랜':'변경'}</button>
        </div>
      ))}
    </div>

    <div className="grid grid-2" style={{gap:16}}>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>알림 설정</div>
        {['일일 학습 리마인더 (오후 8시)','목표 달성 축하 알림','오답 재풀이 추천','새 기출 업데이트','마케팅 정보 수신'].map((l,i) => (
          <div key={l} style={{display:'flex', alignItems:'center', padding:'10px 0', borderBottom: i<4 ? '1px solid var(--border)' : 'none'}}>
            <span style={{flex:1, fontSize:14}}>{l}</span>
            <label style={{display:'inline-block', position:'relative', width:40, height:22}}>
              <input type="checkbox" defaultChecked={i<3} style={{opacity:0, width:0, height:0}}/>
              <span style={{position:'absolute', inset:0, background: i<3 ? 'var(--primary)' : 'var(--border-strong)', borderRadius:11, cursor:'pointer', transition:'.2s'}}></span>
              <span style={{position:'absolute', top:3, left: i<3 ? 21 : 3, width:16, height:16, background:'#fff', borderRadius:'50%', transition:'.2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}></span>
            </label>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>결제 내역</div>
        <table className="table">
          <thead><tr><th>날짜</th><th>플랜</th><th>금액</th><th>상태</th></tr></thead>
          <tbody>
            <tr><td className="muted small">2026.04.26</td><td>Pro (무료체험)</td><td>₩0</td><td><span className="badge success">체험</span></td></tr>
            <tr><td className="muted small">2026.03.26</td><td>Basic</td><td>₩9,900</td><td><span className="badge success">결제완료</span></td></tr>
            <tr><td className="muted small">2026.02.26</td><td>Basic</td><td>₩9,900</td><td><span className="badge success">결제완료</span></td></tr>
            <tr><td className="muted small">2026.01.26</td><td>Basic</td><td>₩9,900</td><td><span className="badge success">결제완료</span></td></tr>
          </tbody>
        </table>
        <div className="divider"></div>
        <div className="hstack">
          <button className="btn btn-secondary btn-sm">영수증 다운로드</button>
          <span className="spacer"></span>
          <button className="btn btn-ghost btn-sm" style={{color:'var(--danger)'}}>구독 해지</button>
        </div>
      </div>
    </div>
  </>
);
window.Settings = Settings;
