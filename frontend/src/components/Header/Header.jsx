// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Para navegação
import styles from './Header.module.css'; // Para estilos CSS Modules
import nelLogo from '../../assets/images/nel_logo.png'; // Caminho para seu logo

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={nelLogo} alt="NEL Logo" className={styles.logo} />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/" className={styles.navLink}>Início</Link></li>
          <li><Link to="/forum" className={styles.navLink}>Fórum</Link></li>
          <li><Link to="/onboarding" className={styles.navLink}>Onboarding</Link></li>
          {/* Adicione outros links como "Sobre o NEL" se houver */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;