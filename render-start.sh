#!/bin/bash

# Script de inicialização para Render

echo "🚀 Iniciando aplicação no Render..."

# Definir porta padrão se não estiver definida
if [ -z "$PORT" ]; then
    export PORT=3000
fi

echo "📍 Porta configurada: $PORT"

# Verificar se o build existe
if [ ! -d ".next" ]; then
    echo "❌ Diretório .next não encontrado. Executando build..."
    npm run build
fi

# Iniciar aplicação
echo "🌟 Iniciando Next.js em modo produção..."
exec npm start