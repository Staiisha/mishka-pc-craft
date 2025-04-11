import { useEffect, useState } from 'react'; 
import {useAuth} from '../context/AuthContext';
import '../styles/Login.scss';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export const Login = () => {
  const {login, isAuthenticated} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

useEffect(() => {
  if (isAuthenticated) {
    navigate('/');
  }
}, [isAuthenticated, navigate]);

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

 try {
  await login(email, password);
  navigate('/');
 } catch (err) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message ||'Ошибка авторизации' );
  } else {
    setError('Неизвестная ошибка');
  }
 } finally {
  setIsLoading(false);
 }
};

   
  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h1>Вход</h1>
        {error && <div className="error-message">{error}</div>}
     <input 
  type="email"
  placeholder="Email"
  autoComplete="email"  
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
   <input 
  type="password"
  placeholder="Пароль"
  autoComplete="current-password"  
  required
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

        <button type="submit">Войти</button>
      </form>
    </div>
  );
};