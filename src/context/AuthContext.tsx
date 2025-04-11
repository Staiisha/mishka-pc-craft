import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Функция проверки токенов
  const checkAuth = (): boolean => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    return !!access && !!refresh;
  };

  // Проверка токенов при изменении маршрута и инициализации
  useEffect(() => {
    const hasTokens = checkAuth();
    setIsAuthenticated(hasTokens);

    // Если токенов нет и не на странице логина - перенаправляем
    if (!hasTokens && location.pathname !== '/login') {
      navigate('/login');
    }

    // Если токены есть и на странице логина - перенаправляем на главную
    if (hasTokens && location.pathname === '/login') {
      navigate('/');
    }
  }, [location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', {
          status: error.response?.status,
          data: error.response?.data
        });
        throw new Error(error.response?.data?.message || 'Ошибка авторизации');
      }
      console.error('Unknown error:', error);
      throw new Error('Неизвестная ошибка');
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};