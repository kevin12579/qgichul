// Main App — wires all screens + routing + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "defaultMode": "exam",
  "userPlan": "pro"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState('landing');
  const [examState, setExamState] = React.useState(null); // { examId, mode }
  const [resultState, setResultState] = React.useState(null);
  const [toast, setToast] = React.useState('');

  const user = { name: '홍길동', plan: tweaks.userPlan || 'pro' };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const go = (r) => setRoute(r);
  const startExam = (examId, mode) => {
    const m = mode || tweaks.defaultMode || 'exam';
    setExamState({ examId, mode: m });
    setRoute('exam_run');
  };
  const onSubmitExam = (state) => {
    setResultState(state);
    setRoute('exam_result');
  };

  // Render routes
  if (route === 'landing') return <>
    <Landing go={go}/>
    <Toast msg={toast}/>
  </>;

  if (route === 'login') return <Login go={go} onLogin={() => { showToast('로그인 완료 · 환영합니다!'); go('dashboard'); }}/>;
  if (route === 'signup') return <Signup go={go} onLogin={() => { showToast('가입 완료! Pro 7일 체험이 시작됐어요'); go('dashboard'); }}/>;

  if (route === 'exam_run' && examState) {
    return <ExamRunner
      examId={examState.examId}
      mode={examState.mode}
      onExit={() => go('dashboard')}
      onSubmit={onSubmitExam}/>;
  }
  if (route === 'exam_result' && resultState) {
    return <ExamResult
      state={resultState}
      onRetry={() => startExam(resultState.examId, resultState.mode)}
      onHome={() => go('dashboard')}
      onReview={() => { showToast('해설 보기 모드로 이동'); go('notes'); }}/>;
  }

  // Shell screens
  return (
    <>
      <AppShell current={route} go={go} user={user}>
        {route === 'dashboard' && <Dashboard user={user} go={go} startExam={startExam}/>}
        {route === 'exams' && <ExamSelect go={go} startExam={startExam}/>}
        {route === 'stats' && <Stats go={go}/>}
        {route === 'notes' && <WrongNotes go={go}/>}
        {route === 'pdf' && <PdfUpload go={go} user={user}/>}
        {route === 'admin' && <Admin go={go}/>}
        {route === 'mypage' && <MyPage go={go} user={user}/>}
        {route === 'settings' && <Settings go={go} user={user}/>}
      </AppShell>
      <Toast msg={toast}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="기본 모드">
          <TweakRadio
            label="문제 풀이 기본 모드"
            value={tweaks.defaultMode}
            options={[{value:'exam', label:'시험 모드'}, {value:'practice', label:'연습 모드'}]}
            onChange={v => setTweaks({ defaultMode: v })}/>
          <div style={{fontSize:12, color:'var(--text-3)', lineHeight:1.6, marginTop:6}}>
            {tweaks.defaultMode === 'exam'
              ? '⚡ 시험 모드: 타이머 동작, 제출 후 채점'
              : '📖 연습 모드: 문항별 즉시 채점 + 해설 즉시 공개'}
          </div>
        </TweakSection>
        <TweakSection title="사용자 플랜">
          <TweakRadio
            label="Plan"
            value={tweaks.userPlan}
            options={[
              {value:'free', label:'Free'},
              {value:'basic', label:'Basic'},
              {value:'pro', label:'Pro'}
            ]}
            onChange={v => setTweaks({ userPlan: v })}/>
          <div style={{fontSize:12, color:'var(--text-3)', lineHeight:1.6, marginTop:6}}>
            Pro만 PDF 업로드 접근 가능
          </div>
        </TweakSection>
        <TweakSection title="바로가기">
          <TweakButton label="🔥 시험 모드로 바로 풀이 시작" onClick={() => startExam('jpki-2024-1', 'exam')}/>
          <TweakButton label="📖 연습 모드로 바로 풀이 시작" onClick={() => startExam('jpki-2024-1', 'practice')}/>
          <TweakButton label="🏆 결과 화면 미리보기" onClick={() => {
            setResultState({
              examId: 'jpki-2024-1', mode: 'exam',
              answers: Object.fromEntries(window.EXAM_DATA.questions.map((q,i) => [q.id, i % 3 === 0 ? q.answer : (q.answer + 1) % 4])),
              flagged: {}, totalQ: 20, correctCount: 14, score: 72, duration: 4842,
            });
            setRoute('exam_result');
          }}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
