#!/bin/bash

# ADM Journey Setup Script

echo "🚀 ADM Journey - Setup"
echo "====================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado"
    exit 1
fi

echo "✓ Node.js $(node --version) encontrado"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado"
    exit 1
fi

echo "✓ npm $(npm --version) encontrado"
echo ""

# Install dependencies
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✓ Dependências instaladas com sucesso"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Criando .env.local..."
    cp .env .env.local
    echo "✓ .env.local criado"
fi

echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "Próximos passos:"
echo "  npm run dev     - Inicia o servidor de desenvolvimento"
echo "  npm run build   - Build para produção"
echo "  npm start       - Inicia o servidor de produção"
