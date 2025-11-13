// src/components/MessageDetailsModal/MessageDetailsModal.jsx
import React from 'react';
import styles from './MessageDetailsModal.module.css';

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const MessageDetailsModal = ({ isOpen, onClose, messageData }) => {
    if (!isOpen || !messageData) return null;

    const isDoubt = messageData.classification === 'Dúvida';

    const handleMarkResolved = () => {
        console.log(`Marcando mensagem ${messageData.id} como resolvida...`);
        // Aqui viria a chamada: axios.post('/forum/mark-resolved', { messageId: messageData.id });
        onClose(); 
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                
                <header className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Detalhes da Mensagem</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </header>

                <div className={styles.modalBody}>
                    
                    <div className={styles.messageInfo}>
                        <p className={styles.classificationTag}>
                            Classificação: <strong>{messageData.classification}</strong>
                            {isDoubt}
                        </p>
                        <p className={styles.senderInfo}>Enviado por: {messageData.name}</p>
                    </div>

                    <p className={styles.sectionTitle}>Mensagem enviada pelo usuário:</p>
                    <div className={styles.messageBox}>
                        {messageData.message}
                    </div>

                    {/* Resposta Sugerida RAG (Exibição Condicional para "Dúvida") */}
                    {isDoubt && messageData.suggestedAnswer && (
                        <>
                            <p className={styles.sectionTitle}>Resposta sugerida baseada na documentação:</p>
                            <div className={styles.responseBox}>
                                {messageData.suggestedAnswer}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageDetailsModal;