// src/router/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header';
//import Footer from '../components/Footer/Footer'; // Se você tiver um footer global

// Páginas
import HomePage from '../pages/HomePage/HomePage';
import ForumPage from '../pages/ForumPage/ForumPage';
import OnboardingPage from '../pages/OnboardingPage/OnboardingPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

function AppRouter() {
  return (
    <Router>
      <Header /> {/* O cabeçalho aparece em todas as páginas */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* Rota para 404 */}
        </Routes>
      </main>
      {/* <Footer /> */} {/* Opcional: Se houver um rodapé global */}
    </Router>
  );
}

export default AppRouter;