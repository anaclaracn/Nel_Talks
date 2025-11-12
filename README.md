# Nel_Talks - Sistema de Suporte e Onboarding Inteligente

### Relevância do Problema 

Entrar em um núcleo de estudos, como o NEL (Estudo em Laticíneos), pode ser desafiador para novos integrantes. Muitos enfrentam dificuldades em comunicar dúvidas, sugestões ou reclamações para a diretoria ou equipe, seja por vergonha ou falta de intimidade. Além disso, os novos membros frequentemente não possuem informações centralizadas sobre processos internos, regras do núcleo, apresentações e rotinas, tornando o onboarding confuso e ineficiente.  

Nosso projeto propõe uma solução tecnológica que atende essas demandas: um **agente inteligente integrado a um fórum e um sistema de onboarding**, que permite comunicação anônima e acesso facilitado a informações importantes.  

---

### Dificuldades encontradas e nossa proporta 

1. **Dificuldade de comunicação:**  
   - Novos membros têm receio de se comunicar diretamente com a diretoria.  
   - Reclamações, dúvidas ou sugestões acabam sendo negligenciadas ou não reportadas.  

2. **Falta de onboarding estruturado:**  
   - Não há informações centralizadas sobre regras, rotinas e boas práticas.  
   - Novos integrantes não sabem por onde começar, nem como realizar apresentações ou interagir em reuniões.

3. **Solução proposta:**  
   - Um **fórum anônimo** para envio de dúvidas, sugestões e reclamações.  
   - Classificação automática dos posts pelo agente Gemini em categorias: dúvida, sugestão ou reclamação.  
   - Indicação de prioridade ou complexidade do assunto: resolução rápida pelo time ou necessidade de intervenção gerencial.  
   - Integração com um sistema de **onboarding inteligente (Rag)**, que utiliza embeddings de documentos internos para responder dúvidas automaticamente.  
   - Posts classificados como dúvidas já são enviados automaticamente para o Rag, que retorna respostas diretamente ao usuário.

---

Nosso sistema promove um ambiente mais seguro, acessível e eficiente para novos membros, permitindo que suas questões sejam atendidas de forma rápida e organizada, ao mesmo tempo que centraliza e automatiza o onboarding do núcleo.

---

## Funcionalidades Principais

1. **Classificação automática de comentários**  
   A primeira API de IA identifica o tipo de comentário publicado (reclamação, sugestão, dúvida, entre outros) por meio de técnicas de aprendizado de máquina e clusterização.

2. **Assistente baseado em documentação**  
   A segunda API responde perguntas dos usuários com base em uma base de conhecimento definida, garantindo que as respostas permaneçam dentro do escopo da documentação.

3. **Arquitetura distribuída**  
   O sistema é composto por um front-end para interação do usuário, um back-end responsável pela comunicação com as APIs e um banco de dados para armazenamento e gerenciamento de dados.

---

## Arquitetura do Sistema

O projeto segue uma arquitetura distribuída composta por:

- **Front-end:** Interface do usuário, responsável pela interação com o fórum.  
- **Back-end:** Camada de integração entre o front-end e as APIs de IA, realizando a autenticação, validação e controle de requisições.  
- **APIs de Inteligência Artificial:**  
  - **IA 1:** Classificação de comentários.  
  - **IA 2:** Respostas baseadas em documentação.  
- **Banco de Dados:** Armazenamento de usuários, comentários, classificações e logs.

### Diagrama de Arquitetura (conceitual)
<img width="587" height="738" alt="Arquitetura_sistemas_distribuidos drawio" src="https://github.com/user-attachments/assets/d1e63aec-c8ef-4257-9f5c-45ad922a0cf3" />
