// Dashboard, Exam selection, Stats, Wrong Notes
const D = window.EXAM_DATA;

// ============ Dashboard ============
const Dashboard = ({ user, go, startExam }) => {
  const subjectData = D.subjectAccuracy;
  const totalAccuracy = Math.round(subjectData.reduce((s, x) => s + x.accuracy, 0) / subjectData.length);
  return (
    <>
      <div className="main-header">
        <div>
          <div className="main-title">안녕하세요, {user.name}님 👋</div>
          <div className="main-subtitle">목표 시험까지 <b style={{color:'var(--primary)'}}>D-112</b> · 오늘의 목표 30문제 중 18문제 완료</div>
        </div>
        <div className="hstack">
          <button className="btn btn-secondary" onClick={() => go('exams')}><Icon name="book" size={16}/> 시험 선택</button>
          <button className="btn btn-primary" onClick={() => startExam('jpki-2024-1', 'exam')}><Icon name="play" size={16}/> 실전 모의고사 시작</button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-4" style={{marginBottom: 20}}>
        <div className="kpi">
          <div className="kpi-label">📊 전체 정답률</div>
          <div className="kpi-value">{totalAccuracy}%</div>
          <div className="kpi-delta up"><Icon name="arrow_right" size={12}/> 지난주 대비 +4.2%p</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">🔥 연속 학습</div>
          <div className="kpi-value">12<span style={{fontSize:16, color:'var(--text-3)', fontWeight:600}}>일</span></div>
          <div className="kpi-delta up">역대 최장 기록 갱신 중</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">✏️ 누적 풀이</div>
          <div className="kpi-value">1,284<span style={{fontSize:16, color:'var(--text-3)', fontWeight:600}}>문제</span></div>
          <div className="kpi-delta"><span className="muted">오답 노트 {Math.round(1284 * 0.27)}개</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">🎯 예상 합격률</div>
          <div className="kpi-value" style={{color:'var(--success)'}}>78%</div>
          <div className="kpi-delta up">최근 3회 평균 68점 (합격 60점)</div>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'2fr 1fr', gap: 16, marginBottom: 16}}>
        {/* Today's Recommendation */}
        <div className="card" style={{background:'linear-gradient(135deg, #1f6feb 0%, #14489d 100%)', color:'#fff', border:'none'}}>
          <div className="hstack" style={{alignItems:'flex-start'}}>
            <div style={{flex: 1}}>
              <div className="badge" style={{background:'rgba(255,255,255,0.2)', color:'#fff', marginBottom: 10}}>오늘의 추천</div>
              <div style={{fontSize: 20, fontWeight: 800, letterSpacing:'-0.02em', marginBottom: 8}}>
                약점 단원 집중 공략: <span style={{textDecoration:'underline'}}>SQL 응용</span>
              </div>
              <div style={{opacity: 0.88, fontSize: 14, lineHeight:1.6, marginBottom: 16}}>
                최근 이 단원 정답률이 47%로 가장 낮아요.<br/>
                오답 기반 맞춤 20문항을 준비했습니다.
              </div>
              <div className="hstack" style={{gap:8}}>
                <button className="btn" style={{background:'#fff', color:'var(--primary)'}} onClick={() => startExam('jpki-2024-1', 'practice')}>바로 풀기 (20문항)</button>
                <button className="btn" style={{background:'rgba(255,255,255,0.16)', color:'#fff'}}>나중에</button>
              </div>
            </div>
            <Icon name="target" size={88} color="rgba(255,255,255,0.22)"/>
          </div>
        </div>
        {/* Goal progress */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">오늘의 목표</div>
              <div className="card-subtitle">30문제 중 18문제</div>
            </div>
            <div style={{fontSize: 24, fontWeight: 800, color:'var(--primary)'}}>60<span style={{fontSize:14, color:'var(--text-3)', fontWeight:600}}>%</span></div>
          </div>
          <div className="progress" style={{height:10, marginBottom: 14}}>
            <div className="progress-bar" style={{width:'60%'}}></div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:12, color:'var(--text-3)'}}>
            <div><div style={{fontWeight:700, color:'var(--text)', fontSize:18, marginBottom:2}}>18</div>완료</div>
            <div><div style={{fontWeight:700, color:'var(--text)', fontSize:18, marginBottom:2}}>12</div>남음</div>
          </div>
          <div className="divider"></div>
          <div style={{fontSize:12, color:'var(--text-3)', marginBottom: 8}}>이번 주 학습 현황</div>
          <div className="hstack" style={{gap: 4}}>
            {['월','화','수','목','금','토','일'].map((d, i) => (
              <div key={d} style={{flex:1, textAlign:'center'}}>
                <div style={{height: 40, background: i < 5 ? 'var(--primary)' : i === 5 ? 'var(--primary-100)' : 'var(--bg)', borderRadius: 4, marginBottom: 4, opacity: i < 5 ? (0.3 + i*0.14) : 1}}></div>
                <div style={{fontSize:11, color:'var(--text-3)'}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent + Weak */}
      <div className="grid grid-2" style={{gap: 16}}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">최근 응시 기록</div>
            <a style={{fontSize:12, color:'var(--primary)', cursor:'pointer', fontWeight:600}}>전체 보기 →</a>
          </div>
          <table className="table">
            <thead><tr><th>시험</th><th>모드</th><th>점수</th><th>날짜</th></tr></thead>
            <tbody>
              {D.recentAttempts.map(a => (
                <tr key={a.id} style={{cursor:'pointer'}}>
                  <td style={{fontWeight: 500}}>{a.examName.replace('정보처리기사 ','')}</td>
                  <td><span className={`mode-ribbon ${a.mode}`}>{a.mode === 'exam' ? '시험' : '연습'}</span></td>
                  <td>
                    <b style={{color: a.passed ? 'var(--success)' : 'var(--danger)'}}>{a.score}점</b>
                    <span className="muted" style={{fontSize:11, marginLeft:4}}>{a.passed ? '합격' : '불합격'}</span>
                  </td>
                  <td className="muted small">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">🎯 취약 단원 TOP 5</div>
            <a onClick={() => go('stats')} style={{fontSize:12, color:'var(--primary)', cursor:'pointer', fontWeight:600}}>자세히 →</a>
          </div>
          {D.weakUnits.map((u, i) => (
            <div key={u.unit} style={{display:'flex', alignItems:'center', gap: 10, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none'}}>
              <div style={{width: 22, height: 22, borderRadius:'50%', background: i < 3 ? 'var(--danger-50)' : 'var(--bg)', color: i < 3 ? 'var(--danger)' : 'var(--text-3)', display:'grid', placeItems:'center', fontWeight:700, fontSize:11, flexShrink:0}}>{i+1}</div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontWeight: 600, fontSize: 13.5, marginBottom: 4}} className="truncate">{u.unit}</div>
                <div className="progress" style={{height:4}}>
                  <div className={`progress-bar ${u.accuracy < 50 ? 'danger' : 'warning'}`} style={{width: `${u.accuracy}%`}}></div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700, fontSize:14, color: u.accuracy < 50 ? 'var(--danger)' : 'var(--warning)'}}>{u.accuracy}%</div>
                <div className="muted small">{u.wrong}/{u.total}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
window.Dashboard = Dashboard;

// ============ Exam Selection ============
const ExamSelect = ({ go, startExam }) => {
  const [selectedCert, setSelectedCert] = React.useState('jpki');
  const [mode, setMode] = React.useState('exam');
  return (
    <>
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

      {/* Cert filter chips */}
      <div className="hstack" style={{gap: 8, marginBottom: 24, flexWrap:'wrap'}}>
        {D.certifications.map(c => (
          <div key={c.id} className={`chip ${selectedCert === c.id ? 'active' : ''}`} onClick={() => setSelectedCert(c.id)}>
            {c.name}
            {c.popular && <span style={{fontSize:10, opacity:0.7}}>🔥</span>}
          </div>
        ))}
      </div>

      {/* Mode explainer */}
      <div style={{padding:'14px 18px', borderRadius:10, background: mode === 'exam' ? '#fef2f2' : '#f0fdf4', border:`1px solid ${mode === 'exam' ? '#fecaca' : '#bbf7d0'}`, marginBottom: 20, display:'flex', gap:12, alignItems:'center'}}>
        <Icon name={mode === 'exam' ? 'clock' : 'book'} size={22} color={mode === 'exam' ? 'var(--danger)' : 'var(--success)'}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:700, fontSize:13.5}}>
            {mode === 'exam' ? '시험 모드' : '연습 모드'}: {mode === 'exam' ? '실전과 동일한 환경' : '개념 이해에 집중'}
          </div>
          <div style={{fontSize:12.5, color:'var(--text-2)', marginTop:2}}>
            {mode === 'exam'
              ? '150분 타이머가 작동하며, 제출 후에만 정답·해설을 확인할 수 있습니다.'
              : '타이머 없음. 문항별 즉시 채점 + 해설 즉시 공개. 반복 학습에 적합합니다.'}
          </div>
        </div>
      </div>

      {/* Exam grid */}
      <div className="grid grid-3">
        {D.exams.filter(e => e.certId === selectedCert).map(e => (
          <div key={e.id} className="exam-card" onClick={() => startExam(e.id, mode)}>
            <div className="exam-card-header">
              <span className="exam-category">{e.year}년 {e.round}회차</span>
              <span className={`mode-ribbon ${mode}`}>{mode === 'exam' ? '시험' : '연습'}</span>
            </div>
            <div className="exam-card-title">{e.name}</div>
            <div className="exam-card-meta">CBT 기출 · 검수완료</div>
            <div className="exam-stats">
              <div className="exam-stat">문항수<b>{e.qCount}</b></div>
              <div className="exam-stat">시험시간<b>{e.duration}분</b></div>
              <div className="exam-stat">합격률<b>{e.passRate}%</b></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
window.ExamSelect = ExamSelect;

// ============ Stats ============
const Stats = ({ go }) => {
  return (
    <>
      <div className="main-header">
        <div>
          <div className="main-title">성적 통계</div>
          <div className="main-subtitle">내 학습 데이터 기반 약점 분석 · 합격률 예측</div>
        </div>
        <div className="segmented">
          <button className="active">정보처리기사</button>
          <button>전체</button>
        </div>
      </div>

      <div className="grid grid-4" style={{marginBottom: 16}}>
        <div className="kpi">
          <div className="kpi-label">누적 응시</div>
          <div className="kpi-value">24<span style={{fontSize:14, color:'var(--text-3)', fontWeight:600}}>회</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">평균 점수</div>
          <div className="kpi-value">68<span style={{fontSize:14, color:'var(--text-3)', fontWeight:600}}>점</span></div>
          <div className="kpi-delta up">지난달 대비 +6점</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">최고 점수</div>
          <div className="kpi-value">82<span style={{fontSize:14, color:'var(--text-3)', fontWeight:600}}>점</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">예상 합격률</div>
          <div className="kpi-value" style={{color:'var(--success)'}}>78<span style={{fontSize:14, color:'var(--text-3)', fontWeight:600}}>%</span></div>
        </div>
      </div>

      {/* Radar + Line */}
      <div className="grid grid-2" style={{gap: 16, marginBottom: 16}}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">과목별 정답률</div>
            <div className="card-subtitle">최근 3개월</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap: 20, alignItems:'center'}}>
            <RadarChart data={D.subjectAccuracy}/>
            <div>
              {D.subjectAccuracy.map(s => (
                <div key={s.id} style={{padding:'6px 0', borderBottom:'1px dashed var(--border)'}}>
                  <div className="hstack">
                    <span className="dot blue"></span>
                    <span style={{fontSize:13, flex:1}}>{s.name}</span>
                    <b style={{fontSize:13, color: s.accuracy < 60 ? 'var(--danger)' : s.accuracy < 75 ? 'var(--warning)' : 'var(--success)'}}>{s.accuracy}%</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">정답률 추이</div>
            <div className="card-subtitle">최근 7일</div>
          </div>
          <LineChart data={D.userHistory} width={480}/>
        </div>
      </div>

      {/* Weak units detail + time */}
      <div className="grid grid-2" style={{gap: 16}}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">🎯 취약 단원 TOP 5</div>
            <button className="btn btn-secondary btn-sm">오답 재시험</button>
          </div>
          {D.weakUnits.map(u => (
            <HBar key={u.unit} label={u.unit} value={u.accuracy} color={u.accuracy < 50 ? 'var(--danger)' : 'var(--warning)'}/>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">과목별 풀이 분포</div>
            <div className="card-subtitle">정답 / 전체 문항</div>
          </div>
          {D.subjectAccuracy.map(s => (
            <div key={s.id} style={{marginBottom: 14}}>
              <div className="hstack" style={{marginBottom:4}}>
                <span style={{fontSize:13, fontWeight: 600}}>{s.name}</span>
                <span className="spacer"></span>
                <span className="small muted">{s.correct}/{s.total}</span>
                <b style={{fontSize:13, minWidth:40, textAlign:'right'}}>{s.accuracy}%</b>
              </div>
              <div className="progress" style={{height:8}}>
                <div className="progress-bar" style={{width: `${s.accuracy}%`, background: s.accuracy < 60 ? 'var(--danger)' : s.accuracy < 75 ? 'var(--warning)' : 'var(--success)'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
window.Stats = Stats;

// ============ Wrong Notes ============
const WrongNotes = ({ go }) => {
  const [selected, setSelected] = React.useState(D.questions[7]);
  const wrongList = D.questions.slice(0, 10);
  return (
    <>
      <div className="main-header">
        <div>
          <div className="main-title">오답 노트</div>
          <div className="main-subtitle">틀린 문제 자동 저장 · 재풀이로 완벽 숙지</div>
        </div>
        <div className="hstack">
          <button className="btn btn-secondary"><Icon name="filter" size={14}/> 필터</button>
          <button className="btn btn-primary"><Icon name="play" size={14}/> 오답만 재시험</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'380px 1fr', gap: 16}}>
        {/* List */}
        <div className="card" style={{padding: 0, maxHeight: 640, overflowY: 'auto'}}>
          <div style={{padding:'14px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8}}>
            <b style={{fontSize:14}}>전체 {wrongList.length}개</b>
            <span className="spacer"></span>
            <select className="form-input" style={{height: 30, fontSize: 12, padding:'0 8px'}}>
              <option>최신순</option><option>정답률 낮은순</option><option>단원별</option>
            </select>
          </div>
          {wrongList.map((q, i) => {
            const sub = D.subjects.find(s => s.id === q.subject);
            return (
              <div key={q.id} onClick={() => setSelected(q)}
                style={{padding: 14, borderBottom:'1px solid var(--border)', cursor:'pointer', background: selected.id === q.id ? 'var(--primary-50)' : 'transparent', borderLeft: selected.id === q.id ? '3px solid var(--primary)' : '3px solid transparent'}}>
                <div className="hstack" style={{marginBottom:6}}>
                  <span className="badge">{sub?.name}</span>
                  <span className="spacer"></span>
                  <span className="muted small">2회 틀림</span>
                </div>
                <div style={{fontSize:13, lineHeight:1.5, color:'var(--text)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
                  {q.text}
                </div>
                <div className="muted small" style={{marginTop:6}}>{q.unit} · 04.2{i}</div>
              </div>
            );
          })}
        </div>

        {/* Detail */}
        <div className="card">
          <div className="hstack" style={{marginBottom: 14}}>
            <span className="badge primary">{D.subjects.find(s => s.id === selected.subject)?.name}</span>
            <span className="badge">{selected.unit}</span>
            <span className="badge danger">2회 오답</span>
            <span className="spacer"></span>
            <button className="btn btn-ghost btn-sm"><Icon name="star" size={14}/></button>
            <button className="btn btn-ghost btn-sm"><Icon name="trash" size={14}/></button>
          </div>
          <div style={{fontSize:16, lineHeight:1.75, marginBottom: 20, color:'var(--text)'}}>
            <span style={{fontWeight:800, marginRight:8}}>Q.</span>{selected.text}
          </div>
          <div className="cbt-options">
            {selected.options.map((o, i) => (
              <div key={i} className={`cbt-option ${i === selected.answer ? 'correct' : ''}`}>
                <div className="cbt-option-num">{i+1}</div>
                <div className="cbt-option-text">
                  {o}
                  {i === selected.answer && <span className="badge success" style={{marginLeft:10}}><Icon name="check" size={11}/> 정답</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop: 20, padding: 16, background:'#fffbea', border:'1px solid #fde68a', borderRadius: 10}}>
            <div style={{fontSize:12, fontWeight:700, color:'#92400e', letterSpacing:'.04em', marginBottom:8}}>💡 해설</div>
            <div style={{fontSize: 13.5, lineHeight:1.7, color:'#451a03'}}>{selected.explanation}</div>
          </div>

          <div style={{marginTop: 16}}>
            <div style={{fontSize:12, fontWeight:700, color:'var(--text-3)', marginBottom:8}}>📝 내 메모</div>
            <textarea className="form-input" style={{width:'100%', minHeight: 80, padding: 12, resize:'vertical'}} defaultValue="정규화는 매번 헷갈린다. 2NF는 '부분 함수 종속 제거', 3NF는 '이행적 종속 제거'로 외우자."/>
          </div>

          <div className="hstack" style={{marginTop: 16, justifyContent:'flex-end', gap: 8}}>
            <button className="btn btn-secondary">이전 오답</button>
            <button className="btn btn-primary">다시 풀기 <Icon name="arrow_right" size={14}/></button>
          </div>
        </div>
      </div>
    </>
  );
};
window.WrongNotes = WrongNotes;
