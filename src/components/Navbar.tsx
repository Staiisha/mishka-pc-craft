import React from 'react';
import { Link } from 'react-router-dom';
import '@/styles/Navbar.scss'; 

const Navbar: React.FC = () => {
  return (
    <nav className='navbar'>
    <h1 className='navbar-title'>Mishka PC Craft</h1>
    <div className='navbar-links'>
    
      <Link to="/ready-builds">Готовые сборки</Link>
      <Link to="/components">Комплектующие</Link>
      <Link to="/peripherals">Периферия</Link>
      <Link to="/builds-in-progress">Сборки в работе</Link>
      <Link to="/clients">Клиенты</Link>
      </div>
    </nav>
  );
};

export default Navbar;