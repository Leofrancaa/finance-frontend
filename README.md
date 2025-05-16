# Finance Manager Frontend

Este é o frontend da aplicação **Finance Manager**, desenvolvido com Next.js e React. Ele fornece a interface do usuário para visualização, cadastro e análise de receitas e despesas, integrando-se com o backend via APIs protegidas por JWT.

## 🛠️ Tecnologias Utilizadas

- **Next.js 15.3.1** (com TurboPack para desenvolvimento rápido)
- **React 19**
- **Recharts** – Para visualização gráfica de dados
- **jwt-decode** – Para lidar com autenticação via token JWT

## 📁 Estrutura do Projeto

- `pages/` – Rotas principais da aplicação
- `components/` – Componentes reutilizáveis
- `public/` – Arquivos estáticos
- `tsconfig.json` – Configuração do TypeScript
- `next.config.ts` – Configuração do Next.js

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio/front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` com os dados necessários, por exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

A URL acima deve apontar para seu backend rodando localmente.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar o projeto.

---

## 📦 Scripts

- `npm run dev` – Inicia o projeto em modo desenvolvimento (TurboPack)
- `npm run build` – Compila o projeto para produção
- `npm start` – Inicia o servidor Next.js em produção
- `npm run lint` – Executa o linter nos arquivos

---

## 📄 Licença e Direitos Autorais

Este é um projeto pessoal desenvolvido por **Leonardo Franca** com fins de estudo e aprendizado.

© 2025 Leonardo Franca. Todos os direitos reservados.

O uso, cópia ou redistribuição deste código é permitido apenas com autorização prévia do autor.
