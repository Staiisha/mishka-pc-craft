import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReadyBuilds from './pages/ReadyBuilds';
import Components from './pages/Components';
import Peripherals from './pages/Peripherals';
import BuildsInProgress from './pages/BuildsInProgress';
import Clients from './pages/Clients';
import './styles/global.scss';


const App: React.FC = () => {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<ReadyBuilds />} /> {/* Страница по умолчанию */}
        <Route path="/ready-builds" element={<ReadyBuilds />} />
        <Route path="/components" element={<Components />} />
        <Route path="/peripherals" element={<Peripherals />} />
        <Route path="/builds-in-progress" element={<BuildsInProgress />} />
        <Route path="/clients" element={<Clients />} />
      </Routes>
    </>
  );
};

export default App;
