// src/pages/Onboarding/Onboarding.jsx
import React, { useState } from 'react';
import styles from './Onboarding.module.css';

// Ícone de lâmpada/ideia para o resultado
import lightbulbIcon from '../../assets/icons/lightbulb_icon.png'; 

function Onboarding() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResult, setShowResult] = useState(false);

    // Função que simula a busca (aqui você fará a chamada para a API Gateway/RAG)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Lógica de chamada ao backend RAG viria aqui
            console.log('Buscando por:', searchTerm);
            setShowResult(true); // Exibe o resultado simulado
            // Após a busca real, você resetaria o searchTerm, mas mantemos para visualização
        }
    };

    // Dados Simulados da Resposta RAG
    const simulatedQuestion = "O que deve ser feito nas reuniões semanais do núcleo?";
    const simulatedAnswer = "Você deve pesquisar sobre o assunto da última RG, entender, trazer alguma curiosidade, algo que complemente nosso assunto. O que vale é continuar estudando e crescendo com a gente.";

    // ATENÇÃO: Adicione a Citação da Fonte aqui para cumprir o requisito RAG!
    const simulatedSource = "Fonte: Regimento Interno do NEL, Seção 4.1.2";


    return (
        <div className={styles.onboardingPage}>
            
            {/* 1. Seção Superior: Banner de Busca */}
            <header className={styles.searchBanner}>
                <div className={styles.bannerContent}>
                    <h1 className={styles.bannerTitle}>Sua Base de Conhecimento NEL</h1>
                    <p className={styles.bannerSubtitle}>Tire todas as suas dúvidas relacionadas ao nosso núcleo, nossa IA irá consultar nossas documentações e te retornar a melhor resposta possível!</p>
                    
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchInputContainer}>
                            {/* Ícone de Lupa dentro do Input (Apenas para fins de design, estilizado via CSS) */}
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14c-2.49 0-4.5-2.01-4.5-4.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 10 14z"/>
                            </svg>

                            <input
                                type="text"
                                placeholder="O que você gostaria de saber sobre o NEL?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchButton}>
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>
            </header>

            {/* 2. Seção de Resultados da Busca */}
            <section className={styles.resultsSection}>
                <h2 className={styles.resultsTitle}>Resultado da sua Busca</h2>
                
                {/* Exibe o card de resultado apenas se uma busca foi realizada */}
                {showResult && (
                    <div className={styles.resultCard}>
                        {/* Título da Pergunta com Ícone */}
                        <div className={styles.resultHeader}>
                            <img src={lightbulbIcon} alt="Ícone de Ideia" className={styles.resultIcon} />
                            <h3 className={styles.resultQuestion}>{simulatedQuestion}</h3>
                        </div>
                        
                        {/* Corpo da Resposta RAG */}
                        <p className={styles.resultAnswer}>{simulatedAnswer}</p>

                    </div>
                )}
                
                {/* Mensagem de Estado Inicial */}
                {!showResult && (
                    <p className={styles.initialMessage}>Faça sua primeira busca para consultar nossa base de conhecimento.</p>
                )}
            </section>
        </div>
    );
}

export default Onboarding;