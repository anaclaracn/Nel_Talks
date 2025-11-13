// src/pages/Forum/Forum.jsx
import React, { useState, useMemo } from 'react';
import styles from './Forum.module.css';
import { Link } from 'react-router-dom';
import MessageDetailsModal from '../../components/MessageDetailsModal/MessageDetailsModal';

import chatIcon from '../../assets/icons/chat_icon_simple.png';
// import searchIcon from '../../assets/icons/search_icon_simple.png'; // Não usado, pode remover

function Forum() {
  // Estados para os filtros
  const [filterClassification, setFilterClassification] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterAnonymity, setFilterAnonymity] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para a barra de pesquisa
  const [currentPage, setCurrentPage] = useState(1); // Estado para paginação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Dados de exemplo para a tabela
  // AGORA É UM ESTADO, NÃO MAIS useMemo, para que possamos atualizá-lo
  const [messages, setMessages] = useState([
    { id: '001', name: 'Anne Thainara', classification: 'Ideia', destination: 'Diretoria', message: 'Sugestão para otimizar o uso do laboratório de laticínios, implementando novas técnicas de análise e controle de qualidade.', status: 'Visto', isAnonymous: false },
    { id: '002', name: 'Anne Thainara', classification: 'Reclamação', destination: 'Time', message: 'Reclamação sobre a falta de acesso à impressora do laboratório, o que tem atrasado a documentação de experimentos importantes.', status: 'Não Visto', isAnonymous: false },
    { id: '003', name: 'Pedro Silva', classification: 'Dúvida', destination: 'Time', message: 'Dúvida sobre o próximo evento do NEL, gostaria de saber a data, horário e como posso participar ativamente.', status: 'Não Visto', isAnonymous: false },
    { id: '004', name: 'Anônimo', classification: 'Feedback', destination: 'Time', message: 'Feedback positivo sobre a nova organização da biblioteca do núcleo, muito mais fácil encontrar os artigos.', status: 'Visto', isAnonymous: true },
    { id: '005', name: 'Anônimo', classification: 'Feedback', destination: 'Diretoria', message: 'Sugestão de melhoria para o sistema de agendamento de equipamentos, está um pouco confuso para novos membros.', status: 'Não Visto', isAnonymous: true },
    { id: '006', name: 'Anônimo', classification: 'Ideia', destination: 'Diretoria', message: 'Proposta para novo projeto de pesquisa sobre o uso de probióticos em produtos lácteos fermentados.', status: 'Não Visto', isAnonymous: true },
    { id: '007', name: 'Giovana Maria', classification: 'Dúvida', destination: 'Time', message: 'Qual o prazo para submissão de artigos para o congresso anual do NEL? Preciso me organizar.', status: 'Visto', isAnonymous: false },
    { id: '008', name: 'Isabela Coimba', classification: 'Reclamação', destination: 'Time', message: 'Problemas recorrentes com a conexão de internet no laboratório de processamento de leite, dificultando as análises.', status: 'Não Visto', isAnonymous: false },
    { id: '009', name: 'Anônimo', classification: 'Reclamação', destination: 'Time', message: 'Equipamento X está com defeito há semanas e ninguém providencia o conserto, prejudicando as pesquisas.', status: 'Não Visto', isAnonymous: true },
    { id: '010', name: 'Carlos Augusto', classification: 'Ideia', destination: 'Diretoria', message: 'Ideia para um workshop de produção de queijos artesanais para a comunidade acadêmica.', status: 'Não Visto', isAnonymous: false },
    { id: '011', name: 'Maria Eduarda', classification: 'Dúvida', destination: 'Time', message: 'Gostaria de saber mais sobre as oportunidades de estágio no NEL para alunos de graduação.', status: 'Visto', isAnonymous: false },
    { id: '012', name: 'Anônimo', classification: 'Feedback', destination: 'Diretoria', message: 'Feedback sobre a comunicação interna do núcleo, poderia ser mais frequente e transparente.', status: 'Não Visto', isAnonymous: true },
    { id: '013', name: 'Thiago Oliveira', classification: 'Reclamação', destination: 'Time', message: 'A temperatura do refrigerador Y não está estável, comprometendo amostras.', status: 'Não Visto', isAnonymous: false },
  ]);

  // Lógica de filtragem
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => { // Usa 'messages' do estado
      // Filtro por Classificação
      if (filterClassification !== 'Todos' && msg.classification !== filterClassification) {
        return false;
      }
      // Filtro por Status
      if (filterStatus !== 'Todos' && msg.status !== filterStatus) {
        return false;
      }
      // Filtro por Anonimato
      if (filterAnonymity !== 'Todos') {
        if (filterAnonymity === 'Anônimo' && !msg.isAnonymous) return false;
        if (filterAnonymity === 'Identificado' && msg.isAnonymous) return false;
      }
      // Filtro por Termo de Pesquisa (nome ou mensagem)
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const matchesName = msg.name.toLowerCase().includes(lowerCaseSearchTerm);
        const matchesMessage = msg.message.toLowerCase().includes(lowerCaseSearchTerm);
        if (!matchesName && !matchesMessage) {
          return false;
        }
      }
      return true;
    });
  }, [messages, filterClassification, filterStatus, filterAnonymity, searchTerm]); // Dependência alterada para 'messages'

  // Lógica de Paginação
  const messagesPerPage = 5; // Defina quantas mensagens por página
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

  // Funções para renderizar o estilo do badge (permanecem as mesmas)
  const renderClassificationBadge = (classification) => {
    switch (classification) {
      case 'Ideia': return <span className={`${styles.badge} ${styles.badgeIdea}`}>Ideia</span>;
      case 'Reclamação': return <span className={`${styles.badge} ${styles.badgeComplaint}`}>Reclamação</span>;
      case 'Dúvida': return <span className={`${styles.badge} ${styles.badgeDoubt}`}>Dúvida</span>;
      case 'Feedback': return <span className={`${styles.badge} ${styles.badgeFeedback}`}>Feedback</span>;
      default: return <span className={styles.badge}>{classification}</span>;
    }
  };

  const renderDestinationBadge = (destination) => {
    switch (destination) {
      case 'Diretoria': return <span className={`${styles.badge} ${styles.badgeManagement}`}>Diretoria</span>;
      case 'Time': return <span className={`${styles.badge} ${styles.badgeTeam}`}>Time</span>;
      default: return <span className={styles.badge}>{destination}</span>;
    }
  };

  // Função para abrir o modal de detalhes da mensagem
  const handleViewDetails = (message) => {
    // Faz uma cópia da mensagem para evitar mutar o estado diretamente
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

  // Alternar o status da mensagem
  const handleToggleStatus = (messageId) => {
    setMessages(prevMessages => 
        prevMessages.map(msg => 
            msg.id === messageId 
                ? { ...msg, status: msg.status === "Visto" ? "Não Visto" : "Visto" }
                : msg
        )
    );
    // fazer uma chamada API para persistir essa mudança no backend
    console.log(`Status da mensagem ${messageId} foi alterado.`);
  };
  
  // Função para obter os números das páginas a serem exibidas
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Quantidade máxima de botões de página a mostrar
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


  return (
    <div className={styles.forumPage}>
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

      <div className={styles.filterSection}>
        <div className={styles.searchContainer}>
            <input 
            type="text" 
            placeholder="Pesquisar mensagens..." 
            className={styles.searchInput} 
            value={searchTerm} 
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Resetar página ao pesquisar
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
                setCurrentPage(1); // Resetar página ao mudar filtro
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
                setCurrentPage(1); // Resetar página ao mudar filtro
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
                setCurrentPage(1); // Resetar página ao mudar filtro
            }}
          >
            <option value="Todos">Todos</option>
            <option value="Anônimo">Anônimo</option>
            <option value="Identificado">Identificado</option>
          </select>
        </div>
      </div>

      {/* Tabela de Mensagens */}
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
                        onClick={() => handleToggleStatus(msg.id)} 
                    >
                        {msg.status}
                    </button>
                </td>
                  <td>
                    <button 
                      className={styles.detailButton}
                      onClick={() => handleViewDetails(msg)}
                      >Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="5" className={styles.noMessages}>Nenhuma mensagem encontrada com os filtros aplicados.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
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

      <MessageDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        messageData={selectedMessage}
      />
    </div>
  );
}

export default Forum;