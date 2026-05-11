import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import Icon from '../components/common/Icon';
import { authApi } from '../api/authApi';
import { certApi } from '../api/certApi';
import { sessionApi } from '../api/sessionApi';

const CATEGORY_ICONS = {
  '공무원/고시':    'building',
  'IT/정보통신':    'cpu',
  '전기/전자/에너지': 'zap',
  '안전/소방/환경':  'shield',
  '기계/건설/토목':  'tool',
  '경영/금융/사무':  'briefcase',
  '조리/미용/서비스': 'scissors',
  '학술/언어/기타':  'book',
};

const GRADE_ORDER = ['기사', '산업기사', '기능사', '기타'];

const GRADE_COLORS = {
  '기사':    { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  '산업기사': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  '기능사':  { bg: '#fefce8', color: '#a16207', border: '#fde68a' },
  '기타':    { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
};

export default function ExamSelectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('exam');

  const [categories, setCategories]             = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [grades, setGrades]               = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradesLoading, setGradesLoading] = useState(false);

  const [certs, setCerts]               = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [certsLoading, setCertsLoading] = useState(false);

  const [exams, setExams]               = useState([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [starting, setStarting]         = useState(false);

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser({ nickname: '학습자' }));
    certApi.getCategories()
      .then(data => setCategories(data || []))
      .catch(() => {
        certApi.getCertifications().then(all => {
          const cats = [...new Set((all || []).map(c => c.category))].sort();
          setCategories(cats);
        });
      });
  }, []);

  const handleCategorySelect = async (cat) => {
    if (selectedCategory === cat) return;
    setSelectedCategory(cat);
    setSelectedGrade(null);
    setCerts([]);
    setSelectedCert(null);
    setExams([]);
    setGradesLoading(true);
    try {
      const data = await certApi.getGradesByCategory(cat);
      setGrades(GRADE_ORDER.filter(g => (data || []).includes(g)));
    } catch {
      setGrades([]);
    } finally {
      setGradesLoading(false);
    }
  };

  const handleGradeSelect = async (grade) => {
    if (selectedGrade === grade) return;
    setSelectedGrade(grade);
    setSelectedCert(null);
    setExams([]);
    setCertsLoading(true);
    try {
      let data = await certApi.getCertsByGrade(selectedCategory, grade);
      if (searchQuery) data = data.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setCerts(data || []);
    } catch {
      setCerts([]);
    } finally {
      setCertsLoading(false);
    }
  };

  const handleCertSelect = async (cert) => {
    if (selectedCert === cert.id) return;
    setSelectedCert(cert.id);
    setExams([]);
    setExamsLoading(true);
    try {
      const data = await certApi.getExamsByCert(cert.id);
      setExams(data || []);
    } catch {
      setExams([]);
    } finally {
      setExamsLoading(false);
    }
  };

  const startExam = async (examId) => {
    setStarting(true);
    try {
      const session = await sessionApi.startExam(examId);
      navigate(`/exam/${examId}?sessionId=${session.sessionId}&mode=${mode}`);
    } catch {
      navigate(`/exam/${examId}?mode=${mode}`);
    } finally {
      setStarting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const selectedCertName = certs.find(c => c.id === selectedCert)?.name;

  return (
    <AppShell user={user} onLogout={handleLogout}>

      {/* 헤더 */}
      <div className="main-header">
        <div>
          <div className="main-title">시험 선택</div>
          <div className="main-subtitle">자격증을 고르고 회차별로 기출문제를 풀어보세요</div>
        </div>
        <div className="segmented">
          <button className={mode === 'exam'     ? 'active' : ''} onClick={() => setMode('exam')}>시험 모드</button>
          <button className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>연습 모드</button>
        </div>
      </div>

      {/* 모드 배너 */}
      <div style={{
        padding: '12px 16px', borderRadius: 10, marginBottom: 24,
        background: mode === 'exam' ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${mode === 'exam' ? '#fecaca' : '#bbf7d0'}`,
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <Icon name={mode === 'exam' ? 'clock' : 'book'} size={20}
          color={mode === 'exam' ? 'var(--danger)' : 'var(--success)'} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>
            {mode === 'exam' ? '시험 모드: 실전과 동일한 환경' : '연습 모드: 개념 이해에 집중'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
            {mode === 'exam'
              ? '타이머가 작동하며, 제출 후에만 정답·해설을 확인할 수 있습니다.'
              : '타이머 없음. 문항별 즉시 채점 + 해설 즉시 공개. 반복 학습에 적합합니다.'}
          </div>
        </div>
      </div>

      {/* 3단 패널 브라우저 */}
      <div className="cert-browser">

        {/* 패널 1: 분야 */}
        <div className="cert-panel">
          <div className="cert-panel-title">
            <span className="cert-panel-step">1</span>분야
          </div>
          <div className="cert-panel-body">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cert-panel-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                <Icon
                  name={CATEGORY_ICONS[cat] || 'folder'}
                  size={15}
                  color={selectedCategory === cat ? 'var(--primary)' : 'var(--text-3)'}
                />
                <span>{cat}</span>
                {selectedCategory === cat &&
                  <Icon name="chevron-right" size={13} color="var(--primary)" style={{ marginLeft: 'auto' }} />
                }
              </button>
            ))}
          </div>
        </div>

        {/* 패널 2: 등급 */}
        <div className="cert-panel">
          <div className="cert-panel-title">
            <span className="cert-panel-step">2</span>등급
          </div>
          <div className="cert-panel-body">
            {!selectedCategory ? (
              <div className="cert-panel-empty">분야를 먼저 선택하세요</div>
            ) : gradesLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}><div className="spinner-sm" /></div>
            ) : grades.length === 0 ? (
              <div className="cert-panel-empty">등급 정보 없음</div>
            ) : (
              grades.map(grade => {
                const colors = GRADE_COLORS[grade] || GRADE_COLORS['기타'];
                const isActive = selectedGrade === grade;
                return (
                  <button
                    key={grade}
                    className={`cert-panel-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleGradeSelect(grade)}
                    style={isActive ? {
                      background: colors.bg,
                      borderLeft: `3px solid ${colors.color}`,
                      color: colors.color,
                      paddingLeft: 13,
                    } : {}}
                  >
                    <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                      background: isActive ? colors.color : 'var(--border)',
                      flexShrink: 0,
                    }} />
                    <span>{grade}</span>
                    {isActive &&
                      <Icon name="chevron-right" size={13} color={colors.color} style={{ marginLeft: 'auto' }} />
                    }
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 패널 3: 자격증 */}
        <div className="cert-panel">
          <div className="cert-panel-title">
            <span className="cert-panel-step">3</span>자격증
            {!certsLoading && certs.length > 0 &&
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-4)', marginLeft: 4 }}>
                {certs.length}개
              </span>
            }
          </div>
          <div className="cert-panel-body">
            {!selectedGrade ? (
              <div className="cert-panel-empty">등급을 먼저 선택하세요</div>
            ) : certsLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}><div className="spinner-sm" /></div>
            ) : certs.length === 0 ? (
              <div className="cert-panel-empty">자격증 없음</div>
            ) : (
              certs.map(cert => (
                <button
                  key={cert.id}
                  className={`cert-panel-item ${selectedCert === cert.id ? 'active' : ''}`}
                  onClick={() => handleCertSelect(cert)}
                >
                  <span style={{ flex: 1, textAlign: 'left', lineHeight: 1.4 }}>{cert.name}</span>
                  {selectedCert === cert.id &&
                    <Icon name="chevron-right" size={13} color="var(--primary)" style={{ marginLeft: 'auto' }} />
                  }
                </button>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 시험 목록 (선택 후 아래에 표시) */}
      {selectedCert && (
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedCertName}</div>
            <div style={{
              fontSize: 12, color: 'var(--text-3)',
              background: 'var(--bg-soft)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '2px 8px',
            }}>
              {selectedCategory} · {selectedGrade}
            </div>
            {!examsLoading && exams.length > 0 &&
              <div style={{ fontSize: 12, color: 'var(--text-4)', marginLeft: 'auto' }}>
                총 {exams.length}회차
              </div>
            }
          </div>

          {examsLoading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}><div className="spinner-sm" /></div>
          ) : exams.length === 0 ? (
            <div style={{
              padding: '48px 0', textAlign: 'center', color: 'var(--text-4)', fontSize: 14,
              border: '1px dashed var(--border)', borderRadius: 12,
            }}>
              <Icon name="book" size={32} />
              <div style={{ marginTop: 10 }}>등록된 시험이 없습니다</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>PDF를 업로드하면 시험이 추가됩니다</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {exams.map(e => (
                <div
                  key={e.id}
                  className="exam-card"
                  onClick={() => !starting && startExam(e.id)}
                  style={{ opacity: starting ? 0.6 : 1, cursor: 'pointer' }}
                >
                  <div className="exam-card-header">
                    <span className="exam-category">{e.year}년 {e.session}회차</span>
                    <span className={`mode-ribbon ${mode}`}>
                      {mode === 'exam' ? '시험' : '연습'}
                    </span>
                  </div>
                  <div className="exam-card-title">{e.title}</div>
                  <div className="exam-card-meta">CBT 기출</div>
                  <div className="exam-stats">
                    <div className="exam-stat">문항수<b>{e.totalQuestions}</b></div>
                    <div className="exam-stat">시험시간<b>{e.durationMin}분</b></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </AppShell>
  );
}