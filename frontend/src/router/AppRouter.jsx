// src/router/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
//import Footer from '../components/Footer/Footer'; // Se você tiver um footer global

// Páginas
import HomePage from '../pages/Home/Home.jsx';
import ForumPage from '../pages/Forum/Forum.jsx';
import ChatPage from '../pages/Chat/Chat.jsx';
import OnboardingPage from '../pages/Onboarding/Onboarding.jsx';
//import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
// <Route path="*" element={<NotFoundPage />} /> {/* Rota para 404 */}
// <Route path="/onboarding" element={<OnboardingPage />} />

function AppRouter() {
  return (
    <Router>
      <Header /> 
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default AppRouter;