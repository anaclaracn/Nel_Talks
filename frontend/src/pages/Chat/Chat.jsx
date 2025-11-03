// src/pages/Chat/Chat.jsx
import React, { useState, useEffect } from 'react';
import styles from './Chat.module.css';
import { Link } from 'react-router-dom'; // Se precisar de um botão de voltar

// Importe o ícone do robô e do usuário
import robotIcon from '../../assets/icons/robot_icon.png'; // Ícone do Agente IA (Gemini)
import userIcon from '../../assets/icons/user_icon.png';   // Ícone do Usuário

// Dados iniciais para simular a conversa
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
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Função que simula o envio de uma mensagem para o Agente Gemini
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const userMessage = input.trim();
        setIsSending(true);
        setInput('');

        // 1. Adiciona a mensagem do usuário ao chat
        const newUserMessage = { 
            id: Date.now(), 
            sender: 'User', 
            text: userMessage, 
            status: 'sent' 
        };
        setMessages(prev => [...prev, newUserMessage]);

        // 2. Simulação da Resposta do Agente Gemini e Classificação
        // OBS: Aqui é onde você fará a chamada real à API Gateway (backend)
        setTimeout(() => {
            let classification = 'Parceria'; // Exemplo baseado no seu mock
            let name = 'Alessandra'; // Exemplo de nome se o usuário se identificou

            const aiResponseText = `Perfeito!! Seu comentário foi salvo no "Painel de Interações do NEL" e classificado como "${classification}".`;
            
            const aiResponse = { 
                id: Date.now() + 1, 
                sender: 'Agente', 
                text: aiResponseText, 
                status: 'received' 
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsSending(false);
        }, 1500); // Simula um pequeno atraso da API

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
                            className={`${styles.messageBubble} ${styles[msg.sender.toLowerCase()]}`}
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
                            <p className={styles.messageText}>Agente Gemini digitando...</p>
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
            
            {/* Adicionar a opção de Anonimato aqui (pode ser um modal ou um checkbox na área de input) */}

        </div>
    );
}

export default Chat;