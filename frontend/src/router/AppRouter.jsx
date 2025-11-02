// src/router/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
//import Footer from '../components/Footer/Footer'; // Se você tiver um footer global

// Páginas
import HomePage from '../pages/Home/Home.jsx';
//import ForumPage from '../pages/Forum/Forum.jsx';
//import OnboardingPage from '../pages/Onboarding/Onboarding.jsx';
//import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
// <Route path="*" element={<NotFoundPage />} /> {/* Rota para 404 */}
// <Route path="/forum" element={<ForumPage />} />
// <Route path="/onboarding" element={<OnboardingPage />} />

function AppRouter() {
  return (
    <Router>
      <Header /> {/* O cabeçalho aparece em todas as páginas */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      {/* <Footer /> */} {/* Opcional: Se houver um rodapé global */}
    </Router>
  );
}

export default AppRouter;