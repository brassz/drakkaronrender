#!/bin/bash

# Script de build para Render

echo "🚀 Iniciando build para Render..."

# Limpar cache se existir
echo "🧹 Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --production=false

# Build do Next.js
echo "🔨 Construindo aplicação Next.js..."
npm run build

# Verificar se o build foi bem sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
else
    echo "❌ Erro durante o build"
    exit 1
fi

# Preparar para produção
echo "🎯 Preparando para produção..."
npm prune --production

echo "🎉 Build finalizado!"