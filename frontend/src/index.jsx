// src/index.js (ou src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client'; // Para React 18+
import App from './App'; // Importa o componente principal App

// Importe seus estilos globais, se houver
import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* Garante que o componente App é renderizado */}
  </React.StrictMode>
);

// Para versões mais antigas do React (<=17), seria:
/*
import ReactDOM from 'react-dom';
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/