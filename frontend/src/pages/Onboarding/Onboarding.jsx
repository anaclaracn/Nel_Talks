// src/pages/Onboarding/Onboarding.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Importa o axios
import styles from './Onboarding.module.css';

// Ícone de lâmpada/ideia para o resultado
import lightbulbIcon from '../../assets/icons/lightbulb_icon.png'; 

// Define a URL base do seu API Gateway
const GATEWAY_URL = 'http://localhost:8000'; // Ajuste conforme a porta que o Gateway expõe!

function Onboarding() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Novo estado de carregamento
    const [response, setResponse] = useState(null);    // Novo estado para a resposta
    const [error, setError] = useState(null);          // Novo estado para erro

    // Função que agora faz a chamada real à API Gateway
    const handleSearch = async (e) => {
        e.preventDefault();
        
        const question = searchTerm.trim();
        if (!question) return;

        setIsLoading(true);
        setResponse(null);
        setError(null);

        try {
            // Requisição POST para o endpoint do Onboarding no Gateway
            // O Gateway roteia /onboarding/query para o Agente DocsIA (Mistral)
            const res = await axios.post(`${GATEWAY_URL}/onboarding/query`, {
                query: question
            });

            // Resposta de sucesso (O Agente DocsIA deve retornar { answer: string, sources: array })
            setResponse({
                query: question,
                answer: res.data.answer || "O Agente não pôde gerar uma resposta clara.",
                sources: res.data.sources || [] // Array de fontes/citações
            });

        } catch (err) {
            console.error('Erro na comunicação com o backend:', err);
            setError(
                err.response?.data?.error || 
                'Falha na busca. Verifique se os microserviços estão ativos.'
            );
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Remova os dados estáticos antigos: simulatedQuestion, simulatedAnswer, simulatedSource
    // O JSX usará 'response.question', 'response.answer', etc.

    return (
        <div className={styles.onboardingPage}>
            
            {/* 1. Seção Superior: Banner de Busca */}
            <header className={styles.searchBanner}>
                <div className={styles.bannerContent}>
                    <h1 className={styles.bannerTitle}>Sua Base de Conhecimento NEL</h1>
                    <p className={styles.bannerSubtitle}>Tire todas as suas dúvidas relacionadas ao nosso núcleo, nossa IA irá consultar nossas documentações e te retornar a melhor resposta possível!</p>
                    
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchInputContainer}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14c-2.49 0-4.5-2.01-4.5-4.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 10 14z"/>
                            </svg>

                            <input
                                type="text"
                                placeholder="O que você gostaria de saber sobre o NEL?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                                disabled={isLoading} // Desabilita input durante o carregamento
                            />
                            <button type="submit" className={styles.searchButton} disabled={isLoading}>
                                {isLoading ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                    </form>
                </div>
            </header>

            {/* 2. Seção de Resultados da Busca */}
            <section className={styles.resultsSection}>
                <h2 className={styles.resultsTitle}>Resultado da sua Busca</h2>
                
                {/* 3. Exibição de Estados (Carregamento, Erro, Resultado) */}

                {/* Estado de Carregamento */}
                {isLoading && (
                    <div className={styles.loadingMessage}>
                        Consultando a Base de Documentos...
                        {/* Você pode adicionar um spinner CSS aqui */}
                    </div>
                )}

                {/* Estado de Erro */}
                {error && (
                    <div className={styles.errorMessage}>
                        ❌ Erro de Comunicação: {error}
                    </div>
                )}
                
                {/* Estado de Resultado (Sucesso) */}
                {response && (
                    <div className={styles.resultCard}>
                        {/* Título da Pergunta com Ícone */}
                        <div className={styles.resultHeader}>
                            <img src={lightbulbIcon} alt="Ícone de Ideia" className={styles.resultIcon} />
                            <h3 className={styles.resultQuestion}>{response.question}</h3>
                        </div>
                        
                        {/* Corpo da Resposta RAG */}
                        <p className={styles.resultAnswer}>{response.answer}</p>
                        
                        {/* Citação da Fonte (Crucial para o RAG) */}
                        {response.sources && response.sources.length > 0 && (
                            <div className={styles.resultSourceContainer}>
                                <p className={styles.resultSource}>
                                    {/* Mapeia todas as fontes retornadas pelo Agente DocsIA */}
                                    <strong>Fontes:</strong> {response.sources.map(s => s.source || s).join('; ')} 
                                </p>
                            </div>
                        )}
                        
                        {/* Feedback (Opcional) */}
                        <div className={styles.feedbackContainer}>
                            <span className={styles.feedbackLabel}>Esta resposta foi útil?</span>
                            <button className={styles.feedbackButton}>👍 Sim</button>
                            <button className={styles.feedbackButton}>👎 Não</button>
                        </div>

                    </div>
                )}
                
                {/* Mensagem de Estado Inicial */}
                {!isLoading && !error && !response && (
                    <p className={styles.initialMessage}>Faça sua primeira busca para consultar nossa base de conhecimento.</p>
                )}
            </section>
        </div>
    );
}

export default Onboarding;