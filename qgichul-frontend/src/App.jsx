import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ExamSelectPage from './pages/ExamSelectPage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import NotePage from './pages/NotePage';
import StatsPage from './pages/StatsPage';
import AiPage from './pages/AiPage';
import MyPage from './pages/MyPage';

const isAuth = () => !!localStorage.getItem('accessToken');

const PublicRoute = ({ children }) =>
  isAuth() ? <Navigate to="/dashboard" replace /> : children;

const PrivateRoute = ({ children }) =>
  isAuth() ? children : <Navigate to="/login" replace />;

const RootRoute = () =>
  isAuth() ? <Navigate to="/dashboard" replace /> : <LandingPage />;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRoute />} />

        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/exams" element={<PrivateRoute><ExamSelectPage /></PrivateRoute>} />
        <Route path="/exam/:examId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
        <Route path="/result/:sessionId" element={<PrivateRoute><ResultPage /></PrivateRoute>} />
        <Route path="/notes" element={<PrivateRoute><NotePage /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
        <Route path="/ai" element={<PrivateRoute><AiPage /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
