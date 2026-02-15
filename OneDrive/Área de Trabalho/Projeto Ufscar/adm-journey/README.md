# ADM Journey

> Plataforma administrativa para gerenciamento acadêmico, financeiro e desenvolvimento profissional.

## 📋 Estrutura do Projeto

```
adm-journey/
├── public/               # Arquivos estáticos (imagens, ícones)
├── src/
│   ├── app/             # App Router (Next.js 13+)
│   ├── components/      # Componentes reutilizáveis
│   ├── features/        # Funcionalidades por domínio
│   ├── services/        # Chamadas API e axios instance
│   ├── hooks/           # Custom hooks globais
│   ├── context/         # Context API
│   ├── lib/             # Bibliotecas e helpers
│   ├── types/           # Tipos TypeScript globais
│   └── utils/           # Funções utilitárias
└── package.json
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build para Produção

```bash
npm run build
npm start
```

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **Day.js** - Manipulação de datas
- **Lucide React** - Ícones

## 📁 Módulos

- **Academic** - Gestão acadêmica
- **Finance** - Gestão financeira
- **Summaries** - Resumos e relatórios
- **Presentations** - Apresentações
- **Journal** - Diário/Anotações

## 📝 License

MIT
