#!/bin/bash

# 🚀 Script de Configuração Automática - Portal ATT
# Este script facilita a configuração inicial do projeto

echo "🚀 Configuração do Portal ATT"
echo "==============================="
echo ""

# Verificar se .env.local já existe
if [ -f ".env.local" ]; then
    echo "⚠️  Arquivo .env.local já existe!"
    read -p "Deseja sobrescrever? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Configuração cancelada."
        exit 1
    fi
fi

# Copiar arquivo de exemplo
echo "📋 Criando arquivo .env.local..."
cp .env.example .env.local

echo ""
echo "🔧 Configuração das variáveis de ambiente:"
echo "==========================================="
echo ""

# Solicitar informações do Supabase
echo "🔹 URL do Supabase (ex: https://xxx.supabase.co):"
read -p "URL: " SUPABASE_URL

echo ""
echo "🔹 Chave pública (anon key) do Supabase:"
read -p "Anon Key: " SUPABASE_ANON_KEY

echo ""
echo "🔹 Chave de serviço (service role key) do Supabase:"
read -p "Service Role Key: " SUPABASE_SERVICE_KEY

# Atualizar arquivo .env.local
echo ""
echo "💾 Salvando configurações..."

# Usar sed para substituir as variáveis
sed -i "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" .env.local
sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env.local
sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY|" .env.local

echo "✅ Arquivo .env.local configurado!"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

echo ""
echo "🎉 Configuração concluída!"
echo "=========================="
echo ""
echo "📝 Próximos passos:"
echo "1. Execute o script de criação das tabelas no Supabase SQL Editor"
echo "   Arquivo: scripts/complete-database-setup.sql"
echo ""
echo "2. Inicie o servidor de desenvolvimento:"
if command -v pnpm &> /dev/null; then
    echo "   pnpm dev"
elif command -v yarn &> /dev/null; then
    echo "   yarn dev"
else
    echo "   npm run dev"
fi
echo ""
echo "3. Acesse: http://localhost:3000/test-supabase"
echo "   Para verificar se tudo está funcionando ✅"
echo ""
echo "📖 Consulte o arquivo SETUP_SUPABASE.md para mais detalhes"