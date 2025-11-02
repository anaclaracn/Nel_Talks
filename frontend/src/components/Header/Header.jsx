// src/components/Header/Header.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Importa NavLink para links ativos e Link para o logo
import styles from './Header.module.css'; // Importa os estilos CSS Modules
import nelLogo from '../../assets/images/nel_logo.png'; // Importa o logo do NEL

function Header() {
  return (
    <header className={styles.header}>
      {/* Container do Logo */}
      <div className={styles.logoContainer}>
        <Link to="/"> {/* Usamos Link aqui pois o logo sempre vai para a página inicial */}
          <img src={nelLogo} alt="NEL Logo" className={styles.logo} />
        </Link>
      </div>

      {/* Navegação Principal */}
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink 
              to="/" 
              // A função className é chamada com um objeto { isActive } que indica se a rota atual corresponde a este NavLink
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Início
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/forum" 
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Fórum
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/onboarding" 
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Onboarding
            </NavLink>
          </li>
          {/* Você pode adicionar mais itens de navegação aqui se precisar */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;