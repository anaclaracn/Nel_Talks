// src/pages/HomePage/HomePage.js
import React from 'react';
import styles from './HomePage.module.css'; // Para estilos CSS Modules
import nelGroupPhoto from '../../assets/images/nel_group_photo.jpg'; // Sua foto
// Importe os ícones que você salvou em assets/icons/
import innovationIcon from '../../assets/icons/innovation_icon.png';
import leadershipIcon from '../../assets/icons/leadership_icon.png';
import researchIcon from '../../assets/icons/research_icon.png';
import forumIcon from '../../assets/icons/chat_icon_rounded.png'; // O ícone arredondado que você pediu
import onboardingIcon from '../../assets/icons/docs_search_icon.png'; // O ícone de documentos com lupa

import Card from '../../components/Card/Card'; // Componente genérico de Card
import Button from '../../components/Button/Button'; // Componente genérico de Botão

function HomePage() {
  return (
    <div className={styles.homePage}>
      {/* Seção Hero - Bem-vindo ao NEL */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Bem-vindo ao Núcleo de Estudos em Laticínios - NEL</h1>
          <p className={styles.heroText}>Desde 2006, promovendo inovação com compromisso na cadeia de laticínios na UFLA. O NEL conecta pessoas, estudos e pesquisa.</p>
        </div>
        <div className={styles.heroImageContainer}>
          <img src={nelGroupPhoto} alt="Grupo do NEL" className={styles.heroImage} />
        </div>
      </section>

      {/* Seção Nossas Áreas de Conhecimento */}
      <section className={styles.knowledgeSection}>
        <h2 className={styles.sectionTitle}>Nossas Áreas de Conhecimento e Desenvolvimento do NEL</h2>
        <div className={styles.cardsContainer}>
          <Card 
            icon={innovationIcon}
            title="Inovação em Laticínios"
            description="Exploramos novas fronteiras em produtos e processos lácteos, aplicando biotecnologia e tendências de mercado para garantir alta qualidade e sustentabilidade."
          />
          <Card 
            icon={leadershipIcon}
            title="Desenvolvimento de Lideranças"
            description="Formamos líderes proativos e comunicativos, desenvolvendo soft skills essenciais para a gestão de projetos e equipes em um ambiente de estudo e pesquisa."
          />
          <Card 
            icon={researchIcon}
            title="Pesquisas"
            description="Conduzimos pesquisas de ponta e análise de dados para gerar conhecimento aplicado, contribuindo com publicações científicas e soluções reais para a indústria."
          />
        </div>
      </section>

      {/* Seção Nossos Agentes de IA */}
      <section className={styles.agentsSection}>
        <h2 className={styles.sectionTitle}>Nossos agentes de Inteligência Artificial para auxiliar você!</h2>
        <div className={styles.cardsContainer}>
          <Card 
            icon={forumIcon}
            title="Fórum de Discussões e Feedbacks"
            description="Discuta, deixe um feedback, uma ideia, tudo sobre relacionado ao núcleo."
            button={<Button to="/forum">Ir para o Fórum</Button>}
          />
          <Card 
            icon={onboardingIcon}
            title="Onboarding do Núcleo"
            description="Começa melhor as áreas do núcleo, com auxilio sobre dúvidas técnicas do núcleo aqui."
            button={<Button to="/onboarding">Ir para o Onboarding</Button>}
          />
        </div>
      </section>
    </div>
  );
}

export default HomePage;