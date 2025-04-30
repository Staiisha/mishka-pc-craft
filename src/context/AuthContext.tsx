import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
import axios, {isAxiosError} from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  isTokenValid: (token: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Проверка валидности токена по сроку действия
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }, []);

  // Комплексная проверка аутентификации
  const checkAuth = useCallback((): boolean => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    
    if (!access || !refresh) return false;
    
    // Дополнительная проверка срока действия access-токена
    return isTokenValid(access);
  }, [isTokenValid]);

  // Обновление состояния аутентификации при изменении маршрута
  useEffect(() => {
    const verifyAuth = () => {
      const authStatus = checkAuth();
      setIsAuthenticated(authStatus);

      if (!authStatus && location.pathname !== '/login') {
        navigate('/login', { replace: true });
      } else if (authStatus && location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    };

    verifyAuth();
  }, [location.pathname, checkAuth, navigate]);

  // Логин с обработкой ошибок и сохранением токенов
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/', { email, password });
      
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Ошибка авторизации';
        console.error('Auth error:', {
          status: error.response?.status,
          data: error.response?.data
        });
        throw new Error(errorMessage);
      }
      throw new Error('Неизвестная ошибка');
    }
  };

  // Выход с очисткой данных
  const logout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  // Периодическая проверка токенов (каждые 5 минут)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkAuth() && isAuthenticated) {
        logout();
      }
    }, 300000); // 5 минут

    return () => clearInterval(interval);
  }, [checkAuth, isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      login,
      logout,
      checkAuth,
      isTokenValid
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};