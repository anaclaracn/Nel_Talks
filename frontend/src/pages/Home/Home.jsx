// src/pages/HomePage/HomePage.jsx
import React from 'react';
import styles from './Home.module.css'; // Importa os estilos CSS Modules
import { Link } from 'react-router-dom'; // Para o botão "Ir para o Fórum/Onboarding"

// --- Importação de Imagens e Ícones ---
import nelGroupPhoto from '../../assets/images/nel_group_photo.png'; 

// Ícones da Seção "Nossas Áreas de Conhecimento"
import innovationIcon from '../../assets/icons/innovation_icon.png'; // Frasco com planta
import leadershipIcon from '../../assets/icons/leadership_icon.png'; // Gráfico de barras
import researchIcon from '../../assets/icons/research_icon.png';     // Microscópio

// Ícones da Seção "Nossos Agentes de IA"
import forumIcon from '../../assets/icons/chat_icon_rounded.png';     // Balão de fala arredondado
import onboardingIcon from '../../assets/icons/docs_search_icon.png'; // Documento com lupa

function Home() {
  return (
    <div className={styles.homePage}>
      {/* 1. Seção Hero - Bem-vindo ao NEL */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Bem-vindo ao Núcleo de Estudos em Laticínios - NEL</h1>
          <p className={styles.heroText}>Desde 2006, promovendo inovação com compromisso na cadeia de laticínios na UFLA. O NEL conecta pessoas, estudos e pesquisa.</p>
        </div>
        <div className={styles.heroImageContainer}>
          <img src={nelGroupPhoto} alt="Grupo do NEL" className={styles.heroImage} />
        </div>
      </section>

      {/* 2. Seção "Nossas Áreas de Conhecimento e Desenvolvimento do NEL" */}
      <section className={styles.knowledgeSection}>
        <h2 className={styles.sectionTitle}>Nossas Áreas de Conhecimento e Desenvolvimento do NEL</h2>
        <div className={styles.knowledgeCardsContainer}>
          {/* Card 1: Inovação em Laticínios */}
          <div className={styles.card}>
            <img src={innovationIcon} alt="Ícone de Inovação" className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Inovação em Laticínios</h3>
            <p className={styles.cardDescription}>Exploramos novas fronteiras em produtos e processos lácteos, aplicando biotecnologia e tendências de mercado para garantir alta qualidade e sustentabilidade na cadeia produtiva.</p>
          </div>
          {/* Card 2: Desenvolvimento de Lideranças */}
          <div className={styles.card}>
            <img src={leadershipIcon} alt="Ícone de Liderança" className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Desenvolvimento de Lideranças</h3>
            <p className={styles.cardDescription}>Focamos na formação de líderes proativos e comunicativos, desenvolvendo soft skills essenciais para a gestão de projetos e equipes em um ambiente de estudo e pesquisa.</p>
          </div>
          {/* Card 3: Pesquisas */}
          <div className={styles.card}>
            <img src={researchIcon} alt="Ícone de Pesquisa" className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Pesquisas</h3>
            <p className={styles.cardDescription}>Conduzimos pesquisas de ponta e análise de dados para gerar conhecimento aplicado, contribuindo com publicações científicas e soluções reais para a indústria.</p>
          </div>
        </div>
      </section>

      {/* 3. Seção "Nossos agentes de Inteligência Artificial para auxiliar você!" */}
      <section className={styles.agentsSection}>
        <h2 className={styles.sectionTitle}>Nossos agentes de Inteligência Artificial para auxiliar você!</h2>
        <div className={styles.agentsCardsContainer}>
          {/* Card Agente Fórum */}
          <div className={`${styles.cardIA} ${styles.agentCard}`}>
            {/* NOVO: Container para agrupar ícone e texto */}
            <div className={styles.agentCardContent}> 
              <img src={forumIcon} alt="Ícone do Fórum" className={styles.cardIcon} />
              <div> {/* Container para o texto */}
                <h3 className={styles.cardTitle}>Fórum de Discussões e Feedbacks</h3>
                <p className={styles.cardDescription}>Discuta, deixe um feedback, uma ideia, tudo sobre relacionado ao núcleo.</p>
              </div>
            </div>
            <Link to="/forum" className={styles.agentButton}>Ir para o Fórum</Link>
          </div>

          {/* Card Agente Onboarding */}
          <div className={`${styles.cardIA} ${styles.agentCard}`}>
            {/* NOVO: Container para agrupar ícone e texto */}
            <div className={styles.agentCardContent}>
              <img src={onboardingIcon} alt="Ícone de Onboarding" className={styles.cardIcon} />
              <div> {/* Container para o texto */}
                <h3 className={styles.cardTitle}>Onboarding do Núcleo</h3>
                <p className={styles.cardDescription}>Conheça melhor as áreas do núcleo, como atuamos, e tire suas dúvidas técnicas do núcleo aqui.</p>
              </div>
            </div>
            <Link to="/onboarding" className={styles.agentButton}>Ir para o Onboarding</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;