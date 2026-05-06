import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const handleLogin = (token) => {
    localStorage.setItem('accessToken', token);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('accessToken');

  return { isLoggedIn, handleLogin, handleLogout };
};
