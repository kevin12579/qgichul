import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import Icon from '../components/common/Icon';
import { authApi } from '../api/authApi';
import { noteApi } from '../api/noteApi';

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function NotePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [memo, setMemo] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filterSubject, setFilterSubject] = useState('');
  const [memoSaved, setMemoSaved] = useState(false);

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자' }));
    noteApi.getNotes()
      .then(data => {
        const list = data || [];
        setNotes(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => setNotes([]));
  }, []);

  useEffect(() => {
    if (!selected) { setMemo(''); return; }
    noteApi.getNoteDetail(selected.id)
      .then(d => setMemo(typeof d.memo === 'string' ? d.memo : (d.memo?.memo || '')))
      .catch(() => setMemo(''));
  }, [selected]);

  const handleLogout = () => { localStorage.removeItem('accessToken'); navigate('/login'); };

  const saveMemo = async () => {
    if (!selected) return;
    try {
      await noteApi.saveMemo(selected.id, memo);
      setMemoSaved(true);
      setTimeout(() => setMemoSaved(false), 1500);
    } catch {
      try {
        await noteApi.updateMemo(selected.id, memo);
        setMemoSaved(true);
        setTimeout(() => setMemoSaved(false), 1500);
      } catch {}
    }
  };

  const subjects = [...new Set(notes.map(n => n.subjectName).filter(Boolean))].sort();

  const filteredNotes = filterSubject
    ? notes.filter(n => n.subjectName === filterSubject)
    : notes;

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.lastWrongAt || 0) - new Date(a.lastWrongAt || 0);
    if (sortBy === 'wrong') return (b.wrongCount || 0) - (a.wrongCount || 0);
    return 0;
  });

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="main-header">
        <div>
          <div className="main-title">오답 노트</div>
          <div className="main-subtitle">틀린 문제 자동 저장 · 재풀이로 완벽 숙지</div>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
          <Icon name="book" size={40} />
          <div style={{ marginTop: 12 }}>오답 노트가 비어 있습니다. 시험을 풀고 오답이 생기면 자동으로 저장됩니다.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 0, maxHeight: 640, overflowY: 'auto' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <b style={{ fontSize: 14 }}>{filterSubject ? `${sortedNotes.length}개` : `전체 ${notes.length}개`}</b>
              <span className="spacer" />
              {subjects.length > 0 && (
                <select className="form-input" style={{ height: 30, fontSize: 12, padding: '0 8px', width: 110 }}
                  value={filterSubject} onChange={e => { setFilterSubject(e.target.value); setSelected(null); }}>
                  <option value="">전체 과목</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
              <select className="form-input" style={{ height: 30, fontSize: 12, padding: '0 8px', width: 110 }}
                value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="latest">최신순</option>
                <option value="wrong">오답 많은순</option>
              </select>
            </div>
            {sortedNotes.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                해당 과목의 오답이 없습니다.
              </div>
            ) : null}
            {sortedNotes.map((n) => (
              <div key={n.id} onClick={() => setSelected(n)}
                style={{ padding: 14, borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected?.id === n.id ? 'var(--primary-50)' : 'transparent', borderLeft: selected?.id === n.id ? '3px solid var(--primary)' : '3px solid transparent' }}>
                <div className="hstack" style={{ marginBottom: 6 }}>
                  {n.subjectName && <span className="badge">{n.subjectName}</span>}
                  <span className="spacer" />
                  <span className="muted small">{n.wrongCount || 1}회 틀림</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {n.content}
                </div>
                <div className="muted small" style={{ marginTop: 6 }}>{n.unit}{n.lastWrongAt && ` · ${formatDate(n.lastWrongAt)}`}</div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="card">
              <div className="hstack" style={{ marginBottom: 14 }}>
                {selected.subjectName && <span className="badge primary">{selected.subjectName}</span>}
                {selected.unit && <span className="badge">{selected.unit}</span>}
                <span className="badge danger">{selected.wrongCount || 1}회 오답</span>
              </div>

              <div style={{ fontSize: 16, lineHeight: 1.75, marginBottom: 20, color: 'var(--text)' }}>
                <span style={{ fontWeight: 800, marginRight: 8 }}>Q.</span>{selected.content}
              </div>

              <div className="cbt-options">
                {(selected.choices || []).map((ch) => (
                  <div key={ch.choiceNum} className={`cbt-option ${ch.choiceNum === selected.correctAnswer ? 'correct' : ''}`}>
                    <div className="cbt-option-num">{ch.choiceNum}</div>
                    <div className="cbt-option-text">
                      {ch.content}
                      {ch.choiceNum === selected.correctAnswer && (
                        <span className="badge success" style={{ marginLeft: 10 }}>
                          <Icon name="check" size={11} /> 정답
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selected.explanation && (
                <div style={{ marginTop: 20, padding: 16, background: '#fffbea', border: '1px solid #fde68a', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', letterSpacing: '.04em', marginBottom: 8 }}>💡 해설</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.7, color: '#451a03' }}>{selected.explanation}</div>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', marginBottom: 8 }}>📝 내 메모</div>
                <textarea
                  className="form-input"
                  style={{ width: '100%', minHeight: 80, padding: 12, resize: 'vertical', height: 'auto' }}
                  placeholder="이 문제에 대한 메모를 남겨보세요..."
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                />
              </div>

              <div className="hstack" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={saveMemo}>
                  {memoSaved ? '✓ 저장됨' : '메모 저장'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
