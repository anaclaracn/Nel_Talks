// src/pages/Forum/Forum.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Forum.module.css';
import { Link } from 'react-router-dom';
import MessageDetailsModal from '../../components/MessageDetailsModal/MessageDetailsModal';

import chatIcon from '../../assets/icons/chat_icon_simple.png';

// --- Configuração de API ---
const GATEWAY_URL = 'http://localhost:8000';
const FORUM_LIST_ENDPOINT = `${GATEWAY_URL}/api/forum/posts`; // GET para listar posts
const FORUM_STATUS_ENDPOINT = `${GATEWAY_URL}/api/forum/posts/`; // PATCH para atualizar status

function Forum() {
    // Estados para o gerenciamento de dados e UI
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para Filtros e Paginação
    const [filterClassification, setFilterClassification] = useState('Todos');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [filterAnonymity, setFilterAnonymity] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    // --- FUNÇÕES DE BUSCA E PERSISTÊNCIA ---

    // Função para buscar dados da API (usando useCallback para otimização)
    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(FORUM_LIST_ENDPOINT);
            
            // O backend retorna posts com status em minúsculas (visto/não visto)
            const formattedMessages = response.data.map(item => ({
                id: item.id,
                name: item.nome || item.name || (item.isAnonymous ? 'Anônimo' : 'Membro'),
                classification: item.classificacao.charAt(0).toUpperCase() + item.classificacao.slice(1), // Capitaliza
                destination: item.destinadoPara,
                message: item.texto,
                status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitaliza 'Visto'/'Não Visto'
                isAnonymous: item.isAnonymous || (item.name === 'Anônimo')
            }));

            setMessages(formattedMessages);
        } catch (err) {
            console.error('Erro ao buscar dados do fórum:', err);
            setError('Falha ao carregar posts. Verifique a conexão com o Agente ForumIA.');
            setMessages([]); // Limpa a lista em caso de erro
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Efeito para carregar os posts na montagem do componente
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Alternar o status da mensagem (com persistência API)
    const handleToggleStatus = async (msgId, currentStatus) => {
        const newStatus = currentStatus === "Visto" ? "Não Visto" : "Visto";
        const targetUrl = `${FORUM_STATUS_ENDPOINT}${msgId}/status`;
        const payloadStatus = newStatus.toLowerCase(); // Envia para o backend em minúsculas

        // 1. Atualização Otimista (UX)
        setMessages(prevMessages => 
            prevMessages.map(msg => 
                msg.id === msgId ? { ...msg, status: newStatus } : msg
            )
        );

        try {
            // 2. Chamada API (PATCH) para persistir a mudança no DB
            await axios.patch(targetUrl, { status: payloadStatus });

        } catch (error) {
            // 3. Reverter o Estado em caso de falha da API
            console.error(`Erro ao atualizar status ${msgId} para ${newStatus}:`, error);
            
            // Reverte o status no frontend para o estado anterior
            setMessages(prevMessages => 
                prevMessages.map(msg => 
                    msg.id === msgId ? { ...msg, status: currentStatus } : msg
                )
            );
            setError('Falha ao salvar status. Tente novamente.');
        }
    };

    // Função para abrir o modal de detalhes da mensagem
    const handleViewDetails = (message) => {
        const messageCopy = { ...message };

        // Simulação da geração de resposta RAG no frontend (isso virá do backend!)
        if (messageCopy.classification === 'Dúvida' && !messageCopy.suggestedAnswer) {
            // No backend: Aqui o NELIA chamaria o RAG e anexaria a resposta.
            messageCopy.suggestedAnswer = "O procedimento para solicitação de verba está detalhado no Artigo 5 do Regulamento Financeiro, exigindo submissão com 15 dias de antecedência.";
            messageCopy.source = "Regulamento Financeiro - Art. 5";
        }
        setSelectedMessage(messageCopy);
        setIsModalOpen(true);
    };


    // --- LÓGICA DE FILTRAGEM E PAGINAÇÃO (PERMANECE A MESMA) ---

    // Lógica de filtragem (usa o estado 'messages')
    const filteredMessages = useMemo(() => {
        return messages.filter(msg => {
            if (filterClassification !== 'Todos' && msg.classification !== filterClassification) return false;
            if (filterStatus !== 'Todos' && msg.status !== filterStatus) return false;
            if (filterAnonymity !== 'Todos') {
                if (filterAnonymity === 'Anônimo' && !msg.isAnonymous) return false;
                if (filterAnonymity === 'Identificado' && msg.isAnonymous) return false;
            }
            if (searchTerm) {
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                const matchesName = msg.name.toLowerCase().includes(lowerCaseSearchTerm);
                const matchesMessage = msg.message.toLowerCase().includes(lowerCaseSearchTerm);
                if (!matchesName && !matchesMessage) return false;
            }
            return true;
        });
    }, [messages, filterClassification, filterStatus, filterAnonymity, searchTerm]);

    // Lógica de Paginação
    const messagesPerPage = 5;
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

    const paginatedMessages = useMemo(() => {
        const startIndex = (currentPage - 1) * messagesPerPage;
        const endIndex = startIndex + messagesPerPage;
        return filteredMessages.slice(startIndex, endIndex);
    }, [filteredMessages, currentPage, messagesPerPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);
        let startPage = Math.max(1, currentPage - half);
        let endPage = Math.min(totalPages, currentPage + half);
        if (endPage - startPage + 1 < maxPagesToShow) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, maxPagesToShow);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };


    // --- FUNÇÕES DE RENDERIZAÇÃO DE BADGES ---
    const renderClassificationBadge = (classification) => {
        const key = classification.toLowerCase();
        let className = styles.badge;
        if (key === 'ideia') className += ` ${styles.badgeIdea}`;
        else if (key === 'reclamação') className += ` ${styles.badgeComplaint}`;
        else if (key === 'dúvida') className += ` ${styles.badgeDoubt}`;
        else if (key === 'feedback') className += ` ${styles.badgeFeedback}`;
        return <span className={className}>{classification}</span>;
    };

    const renderDestinationBadge = (destination) => {
        const key = destination.toLowerCase();
        let className = styles.badge;
        if (key === 'diretoria') className += ` ${styles.badgeManagement}`;
        else if (key === 'time') className += ` ${styles.badgeTeam}`;
        return <span className={className}>{destination}</span>;
    };


    return (
        <div className={styles.forumPage}>
            
            {/* Header Panel */}
            <div className={styles.headerPanel}>
                <div className={styles.panelTitleContainer}>
                    <h1 className={styles.panelTitle}>Painel de Interações do NEL</h1>
                    <p className={styles.panelSubtitle}>Espaço para observar os feedbacks, sugestões, reclamações e dúvidas dos membros do núcleo</p>
                </div>
                <Link to="/chat" className={styles.postButton}>
                    <img src={chatIcon} alt="Ícone de Chat" className={styles.postButtonIcon} />
                    Postar no Fórum
                </Link>
            </div>

            {/* Filtros e Busca */}
            <div className={styles.filterSection}>
                <div className={styles.searchContainer}>
                    <input 
                        type="text" 
                        placeholder="Pesquisar mensagens..." 
                        className={styles.searchInput} 
                        value={searchTerm} 
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }} 
                    />
                </div>
                
                <div className={styles.dropdownContainer}>
                    <label htmlFor="classificationFilter" className={styles.filterLabel}>Classificação:</label>
                    <select 
                        id="classificationFilter" 
                        className={styles.filterDropdown} 
                        value={filterClassification} 
                        onChange={(e) => {
                            setFilterClassification(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Ideia">Ideia</option>
                        <option value="Reclamação">Reclamação</option>
                        <option value="Dúvida">Dúvida</option>
                        <option value="Feedback">Feedback</option>
                    </select>
                </div>

                <div className={styles.dropdownContainer}>
                    <label htmlFor="statusFilter" className={styles.filterLabel}>Status:</label>
                    <select 
                        id="statusFilter" 
                        className={styles.filterDropdown} 
                        value={filterStatus} 
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Não Visto">Não Visto</option>
                        <option value="Visto">Visto</option>
                    </select>
                </div>

                <div className={styles.dropdownContainer}>
                    <label htmlFor="anonymityFilter" className={styles.filterLabel}>Anonimato:</label>
                    <select 
                        id="anonymityFilter" 
                        className={styles.filterDropdown} 
                        value={filterAnonymity} 
                        onChange={(e) => {
                            setFilterAnonymity(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Anônimo">Anônimo</option>
                        <option value="Identificado">Identificado</option>
                    </select>
                </div>
            </div>

            {/* Renderização de Estados */}
            {isLoading && <div className={styles.loadingState}>Carregando posts do banco de dados...</div>}
            {error && <div className={styles.errorState}>❌ {error}</div>}

            {/* Tabela de Mensagens */}
            {!isLoading && !error && (
                <div className={styles.tableContainer}>
                    <table className={styles.messageTable}>
                        <thead>
                            <tr>
                                <th className={styles.thName}>Nome</th>
                                <th className={styles.thClassification}>Classificação</th>
                                <th className={styles.thDestination}>Destinado para</th>
                                <th className={styles.thStatus}>Status</th> 
                                <th className={styles.thActions}>Mensagem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedMessages.length > 0 ? (
                                paginatedMessages.map((msg) => (
                                    <tr key={msg.id}>
                                        <td>{msg.isAnonymous ? 'Anônimo' : msg.name}</td>
                                        <td>{renderClassificationBadge(msg.classification)}</td>
                                        <td>{renderDestinationBadge(msg.destination)}</td>
                                        <td>
                                            <button 
                                                className={`${styles.statusButton} ${msg.status === 'Visto' ? styles.statusVisto : styles.statusNaoVisto}`}
                                                onClick={() => handleToggleStatus(msg.id, msg.status)} 
                                            >
                                                {msg.status}
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                className={styles.detailButton}
                                                onClick={() => handleViewDetails(msg)}
                                            >Ver Detalhes</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className={styles.noMessages}>Nenhum post encontrado com os filtros aplicados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Paginação */}
            {!isLoading && !error && totalPages > 1 && (
                <div className={styles.pagination}>
                    <button 
                        className={styles.paginationButton} 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    {getPageNumbers().map(pageNumber => (
                        <button 
                            key={pageNumber}
                            className={`${styles.paginationButton} ${pageNumber === currentPage ? styles.activePage : ''}`}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button 
                        className={styles.paginationButton} 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            )}

            {/* Modal de Detalhes da Mensagem */}
            <MessageDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                messageData={selectedMessage}
            />
        </div>
    );
}

export default Forum;