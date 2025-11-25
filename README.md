# Nel_Talks - Sistema de Suporte e Onboarding Inteligente

## Descrição do Projeto

O NEL_Talks é um sistema distribuído criado para melhorar a comunicação interna e o onboarding de novos membros do Núcleo de Estudos em Laticínios (NEL).
O projeto resolve dois problemas reais:

### 1. Comunicação difícil dentro do núcleo
   #### Novos membros têm dificuldade em:
   * reportar dúvidas, enviar sugestões, fazer reclamações. Isso gera silêncio organizacional, problemas não reportados e baixo engajamento.

### 2. Falta de onboarding estruturado

   * Regras, rotinas, apresentações e materiais internos não estão centralizados, causando insegurança e confusão nos primeiros meses dos novos integrantes.
     
### O projeto aplica conceitos de:

* Arquitetura Distribuída
* Microsserviços
* Orquestração inteligente de agentes
* RAG (Retrieval-Augmented Generation)
* Segurança e modelagem de ameaças
* Integração entre serviços Node.js e Python
---

## Objetivo do Sistema

O NEL Talks centraliza dúvidas, postagens e onboarding dos usuários, distribuindo requisições para diferentes agentes especializados:

* Agente Chat (NÉLIA + LLM) → Responde perguntas através do fluxo de classificação + geração + busca em documentos.
* Agente FórumIA → Gerenciamento de posts, status e discussões.
* Agente DocsIA / OnboardingIA (Python + RAG) → Responde perguntas sobre documentos e realiza recuperação semântica baseada em embeddings.
Toda comunicação passa exclusivamente pelo API Gateway, garantindo segurança, unificação e controle.

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


Nosso sistema promove um ambiente mais seguro, acessível e eficiente para novos membros, permitindo que suas questões sejam atendidas de forma rápida e organizada, ao mesmo tempo que centraliza e automatiza o onboarding do núcleo.

---
### Arquitetura do Sistema
Arquitetura Inicial (Imagem enviada)

(representação de como o projeto começou; fluxo simples front → serviços)
<img width="587" height="738" alt="Arquitetura_sistemas_distribuidos drawio" src="https://github.com/user-attachments/assets/d1e63aec-c8ef-4257-9f5c-45ad922a0cf3" />


### Arquitetura Final (Imagem enviada)

(versão correta, com NÉLIA e Gateway atuando como camadas centrais)
 ![Diagrama_modelagem_final_da_arquitetura (1)](https://github.com/user-attachments/assets/879a802a-9681-4619-bdff-4af037a05a80)


---

## Componentes da Arquitetura

### 1. Frontend

Interface usada pelo usuário.
Envia todas as requisições exclusivamente para o API Gateway e exibe as respostas dos serviços internos (Chat/Nélia, FórumIA, RAG).


### 2. API Gateway

Ponto único de entrada do sistema.
Recebe requisições do frontend, aplica regras (filtro, logs, conversões) e encaminha para o microserviço apropriado.


### 3. Nélia Service Layer

Módulo intermediário que interpreta a intenção do usuário e coordena a comunicação entre os agentes internos (chat, documentos, fórum).
Centraliza a lógica de orquestração.


### 4.FórumIA 

Microserviço responsável por gerenciamento de posts.
Executa classificação automática, registra, atualiza e lista publicações, usando banco MySQL.


### 5. DocsIA / RAG / Onboarding IA

Microserviço Python voltado para informações internas.
Gera embeddings, realiza busca semântica e produz respostas baseadas em documentos.

---

### Modelagem de ameaças
<img width="1812" height="458" alt="Captura de tela 2025-11-25 165304" src="https://github.com/user-attachments/assets/4b96feb1-b240-41ab-aa5f-69d347caaa5f" />

---

## Como Rodar o Projeto

### **1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

### **2. Crie o ambiente virtual**

```bash
python -m venv venv
```

### **3. Ative o ambiente virtual**

* **Windows**

```bash
venv\Scripts\activate
```

* **Linux/Mac**

```bash
source venv/bin/activate
```

### **4. Instale as dependências**

```bash
pip install -r requirements.txt
```

### **5. Configure as variáveis de ambiente**

1. Crie um arquivo `.env` na raiz do projeto.
2. Adicione a sua chave da API do Google:

```
GEMINI_API_KEY=your_api_key_here
```

### **6. Execute o projeto**

```bash
python main.py
```







