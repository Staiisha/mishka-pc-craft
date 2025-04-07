import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReadyBuilds from './pages/ReadyBuilds';
import Components from './pages/Components';
import Peripherals from './pages/Peripherals';
import BuildsInProgress from './pages/BuildsInProgress';
import Clients from './pages/Clients';
import './styles/global.scss';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext'; // Добавлен импорт провайдера

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/ready-builds" replace />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider> {/* Обернули приложение в AuthProvider */}
      <Routes>
        {/* Публичные маршруты (только для неавторизованных) */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
        </Route>

        {/* Защищенные маршруты (только для авторизованных) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/ready-builds" element={<ReadyBuilds />} />
          <Route path="/components" element={<Components />} />
          <Route path="/peripherals" element={<Peripherals />} />
          <Route path="/builds-in-progress" element={<BuildsInProgress />} />
          <Route path="/clients" element={<Clients />} />
        </Route>

        {/* Редирект для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;