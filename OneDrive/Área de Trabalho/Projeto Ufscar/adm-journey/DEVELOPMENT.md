# ADM Journey - Development Guide

## 📋 Visão Geral

Este documento fornece informações sobre a estrutura e desenvolvimento do projeto ADM Journey.

## 🚀 Início Rápido

```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

## 📁 Estrutura de Pastas

### `/public`
- Arquivos estáticos (imagens, ícones)

### `/src/app`
- Rotas e layouts usando Next.js 13+ App Router
- `(auth)` - Rotas de autenticação (login, registro)
- `(dashboard)` - Rotas protegidas do dashboard

### `/src/components`
- Componentes reutilizáveis
- `ui/` - Componentes básicos (Button, Input, Card, Alert)
- `layout/` - Componentes de layout (Sidebar, Navbar)
- `charts/` - Componentes de gráficos

### `/src/features`
- Funcionalidades organizadas por domínio
- Cada feature contém: components, hooks, services, types, utils
- Features: academic, finance, summaries, presentations, journal

### `/src/services`
- API base (axios instance)
- Serviços de autenticação

### `/src/hooks`
- Custom hooks globais
- `useAuth` - Autenticação
- `useTheme` - Tema
- `useCountdown` - Contador

### `/src/context`
- Context API para estado global
- AuthContext

### `/src/lib`
- Bibliotecas e configurações externas
- day.js configurado

### `/src/utils`
- Funções utilitárias
- Validações
- Formatações

## 🔑 Convenções

### Nomenclatura de Arquivos
- Componentes: PascalCase (Button.tsx)
- Hooks: camelCase (useAuth.ts)
- Tipos: PascalCase (types.ts)
- Serviços: camelCase (apiService.ts)

### Estrutura de Componentes

```typescript
// Props interface
interface ComponentProps {
  prop1: string
  prop2?: number
}

// Component
export function Component({ prop1, prop2 }: ComponentProps) {
  return <div>{prop1}</div>
}
```

### Estrutura de Hooks

```typescript
'use client'

import { useState, useCallback } from 'react'

export function useCustom() {
  const [state, setState] = useState(initialValue)

  const action = useCallback(() => {
    // Logic
  }, [])

  return { state, action }
}
```

## 🔐 Autenticação

O projeto utiliza autenticação via token JWT. O token é armazenado no localStorage.

```typescript
import { useAuth } from '@/hooks'

export function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  return (
    // JSX
  )
}
```

## 📝 Adicionando Nova Feature

1. Crie a pasta: `src/features/featureName/`
2. Adicione as subpastas: components/, hooks/, services/
3. Crie types.ts e utils.ts
4. Implemente os componentes e hooks
5. Crie a rota: `src/app/(dashboard)/featureName/page.tsx`

## 🧪 Testing (Estrutura Pronta)

```bash
npm run test      # Executar testes
npm run test:cov  # With coverage
```

## 🌍 Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=ADM Journey
```

## 📚 Dependências Principais

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem
- **Tailwind CSS** - Estilos
- **Axios** - Requisições HTTP
- **Day.js** - Datas
- **Lucide React** - Ícones

## 💡 Dicas de Desenvolvimento

1. Use path aliases (@/) para imports
2. Componentes são Client Components por padrão no App Router
3. Sempre tipifique as props dos componentes
4. Use hooks customizados para lógica reutilizável
5. Valide inputs com validationSchemas

## 🐛 Troubleshooting

### Erro: "Module not found"
- Verifique os path aliases no tsconfig.json
- Limpe node_modules: `rm -rf node_modules && npm install`

### Erro: "Cannot find module '@/...'"
- Rode: `npm install`
- Verifique se o arquivo existe no caminho correto

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
