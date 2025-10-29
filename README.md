# NEL Talks

## Visão Geral
O **NEL Forum AI** é uma plataforma distribuída desenvolvida pelo **Núcleo NEL**.  
O sistema integra duas APIs de Inteligência Artificial com o objetivo de aprimorar a interação entre usuários e conteúdos em um fórum online.

A aplicação foi projetada para classificar automaticamente comentários e fornecer respostas baseadas em uma base de documentação, mantendo o foco em confiabilidade e segurança.

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
