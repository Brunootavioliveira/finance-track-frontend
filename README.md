# FinanceTrack — Frontend
 
Interface web do FinanceTrack, uma aplicação de controle financeiro pessoal com autenticação JWT, dashboard com resumo financeiro, gestão de receitas, despesas e categorias.
 
---
 
## Demo
 
[finance-track-frontend-lemon.vercel.app](https://finance-track-frontend-lemon.vercel.app)
 
---
 
## Funcionalidades
 
- Autenticação com JWT (login e cadastro)
- Dashboard com saldo, entradas e saídas
- Gráfico de despesas mensais
- Gastos por categoria com barra de progresso
- Listagem e exclusão de transações
- Criação de categorias personalizadas
- Menu de perfil com nome e e-mail do usuário
- Layout totalmente responsivo (mobile, tablet e desktop)
 
---
 
## Tecnologias
 
| Tecnologia | Versão |
|---|---|
| React | 18.2 |
| Vite | 5.2 |
| Tailwind CSS | 3.4 |
| Recharts | 2.12 |
| Lucide React | 0.383 |
 
---
 
## Estrutura do Projeto
 
```
src/
├── components/
│   ├── Header.jsx              # Barra de navegação com avatar e dropdown
│   ├── CardResumo.jsx          # Cards de saldo, entradas e saídas
│   ├── GraficoDespesas.jsx     # Gráfico de área com despesas mensais
│   ├── ListaTransacoes.jsx     # Lista das últimas transações
│   └── BotaoNovaTransacao.jsx  # Modal / bottom sheet para nova transação
├── context/
│   └── AuthContext.jsx         # Contexto global de autenticação
├── pages/
│   └── LoginPage.jsx           # Tela de login e cadastro
├── services/
│   └── api.js                  # Funções de chamada à API
├── App.jsx                     # Componente raiz e lógica principal
└── main.jsx                    # Entry point
```
 
---
 
## Como rodar localmente
 
### Pré-requisitos
 
- Node.js 18+
- npm ou yarn
 
### Instalação
 
```bash
# Clone o repositório
git clone https://github.com/Brunootavioliveira/finance-track-frontend.git
cd finance-track-frontend/financetrack
 
# Instale as dependências
npm install
 
# Rode o servidor de desenvolvimento
npm run dev
```
 
A aplicação estará disponível em `http://localhost:5173`.
 
---
 
## Configuração
 
A URL da API está definida diretamente em `src/services/api.js`:
 
```js
const BASE_URL = 'https://finance-track-api-6n9c.onrender.com';
```
 
Para rodar com o backend local, altere para:
 
```js
const BASE_URL = 'http://localhost:8080';
```
 
---
 
## Build para produção
 
```bash
npm run build
```
 
Os arquivos serão gerados na pasta `dist/`.
 
---
 
## Deploy
 
O deploy é feito automaticamente via **Vercel** a cada push na branch principal.
 
---
 
## Repositório do Backend
 
[github.com/Brunootavioliveira/finance-track-api](https://github.com/Brunootavioliveira/finance-track-api)
 
---
 
## Autor
 
**Bruno Otavio Oliveira**  
[github.com/Brunootavioliveira](https://github.com/Brunootavioliveira) <br>
[LinkedIn.com/bruno-otavio/](https://www.linkedin.com/in/bruno-otavio/)
