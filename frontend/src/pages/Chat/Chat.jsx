/* eslint-disable no-unused-vars */
/* eslint-disable no-irregular-whitespace */
// src/pages/Chat/Chat.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Chat.module.css';
import { Link } from 'react-router-dom';

// Importe o ícone do robô e do usuário
import robotIcon from '../../assets/icons/robot_icon.png';
import userIcon from '../../assets/icons/user_icon.png';

// --- Configuração da URL do Gateway ---
// URL que o Gateway expõe (ex: localhost:8000)
const GATEWAY_URL = 'http://localhost:8000'; 
// Endpoint do chat (Gateway roteia /chat para a NELIA Service Layer)
const CHAT_ENDPOINT = `${GATEWAY_URL}/chat`; 

// Dados iniciais para garantir que o chat SEMPRE renderize
const initialMessages = [
    { 
      id: 1, 
      sender: 'Agente', 
      text: "Olá membro do NEL, seja bem-vindo!! Me conte aqui sobre seus pensamentos, sugestões, ideias, feedbacks, ou qualquer coisa relacionada ao núcleo",
      status: 'welcome'
    },
    { 
      id: 2, 
      sender: 'Agente', 
      text: "Ah, caso não queira fazer o comentário de forma anônima, só me dizer seu nome que irei registrar!",
      status: 'tip'
    }
];

function Chat() {
    // Usa os dados estáticos para inicializar o estado
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    // Estado simples para anonimato
    const [isAnonymous] = useState(false); 

    // Função para lidar com o envio da mensagem
    const handleSend = async (e) => {
        e.preventDefault();
        
        const userMessage = input.trim();
        if (!userMessage || isSending) return;

        // 1. Prepara e exibe a mensagem do usuário imediatamente
        setIsSending(true);
        setInput('');
        
        const newUserMessage = { 
            id: Date.now(), 
            sender: 'User', 
            text: userMessage, 
            status: 'sent' 
        };
        setMessages(prev => [...prev, newUserMessage]); 

        try {
            // 2. Chamada REAL à API Gateway (que vai para o NELIA Service Layer)
            const response = await axios.post(CHAT_ENDPOINT, {
                message: userMessage,
                userId: 'user-123', // ID de usuário simulado
                isAnonymous: isAnonymous
            });

            // 3. Processa a resposta da NELIA Service Layer
            // NELIA retorna: { message: string, classification: string, origin: string, sources?: [] }
            const { message, classification, origin, sources } = response.data;

            let responseText = `Classificação: ${classification}. ${message}`;

// eslint-disable-next-line no-irregular-whitespace
            if (sources && sources.length > 0) {
                const sourceNames = sources.map(s => s.source || s).join(', ');
                responseText += `\n\n(Fontes Consultadas: ${sourceNames})`;
            }
            
            const aiResponse = { 
                id: Date.now() + 1, 
                sender: 'Agente', 
                text: responseText, 
                status: 'received' 
            };
            
            setMessages(prev => [...prev, aiResponse]);

        } catch (error) {
            console.error('Erro na integração do chat:', error);
            let errorMessage = "🔴 Erro de Conexão: Serviço indisponível. Verifique o backend/Docker.";
            
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = `🔴 Erro: ${error.response.data.error}`;
            }

            // Adiciona uma mensagem de erro ao chat para o usuário ver
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'Agente', 
                text: errorMessage, 
                status: 'error' 
            }]);
        } finally {
            setIsSending(false);
        }
    };

    // Efeito para rolar automaticamente para a última mensagem
    useEffect(() => {
        const chatWindow = document.getElementById('chat-messages');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={styles.chatPage}>
            
            {/* Seção Superior: Título e Foguete (Fundo Azul) */}
            <header className={styles.chatHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.headerTitle}>Conte-nos o que está pensando sobre o Núcleo</h1>
                    <p className={styles.headerSubtitle}>Deixe seu comentário, sugestão de melhoria, feedbacks, ideias, entre outras coisas que acredita que agregará para nosso núcleo</p>
                </div>
                {/* O foguete é estilizado via CSS de fundo ou pode ser uma imagem aqui */}
            </header>

            {/* Container Principal do Chat (Card Branco) */}
            <div className={styles.chatContainer}>
                
                <div className={styles.messagesWindow} id="chat-messages">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            // Verifica 'error' para adicionar estilo de erro
                            className={`${styles.messageBubble} ${styles[msg.sender.toLowerCase()]} ${msg.status === 'error' ? styles.error : ''}`} 
                        >
                            <img 
                                src={msg.sender === 'Agente' ? robotIcon : userIcon} 
                                alt={msg.sender} 
                                className={styles.avatar} 
                            />
                            <p className={styles.messageText}>{msg.text}</p>
                        </div>
                    ))}
                    {/* Indicador de Digitação (Opcional) */}
                    {isSending && (
                        <div className={`${styles.messageBubble} ${styles.agente} ${styles.typing}`}>
                            <img src={robotIcon} alt="Agente" className={styles.avatar} />
                            <p className={styles.messageText}>Agente NelTalks digitando...</p>
                        </div>
                    )}
                </div>

                {/* Área de Input */}
                <form onSubmit={handleSend} className={styles.inputArea}>
                    <input
                        type="text"
                        placeholder="Enviar comentário..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={styles.inputField}
                        disabled={isSending}
                    />
                    <button type="submit" className={styles.sendButton} disabled={isSending}>
                        {/* Ícone de Envio (seta) */}
                        <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="currentColor">
                           <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;