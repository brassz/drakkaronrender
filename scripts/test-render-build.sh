#!/bin/bash

echo "🔍 Testando build do Render localmente..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado. Instale o Docker para testar o build.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Testando build com npm...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build npm concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Falha no build npm${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🐳 Testando build Docker...${NC}"
docker build -t portalatt-test .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build Docker concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Falha no build Docker${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🚀 Iniciando container de teste...${NC}"
docker run -d -p 3000:3000 --name portalatt-test-container portalatt-test

# Aguardar o container iniciar
echo "Aguardando container iniciar..."
sleep 5

# Verificar se o container está rodando
if [ "$(docker ps -q -f name=portalatt-test-container)" ]; then
    echo -e "${GREEN}✅ Container rodando com sucesso!${NC}"
    echo ""
    echo -e "${GREEN}🌐 Aplicação disponível em: http://localhost:3000${NC}"
    echo ""
    echo "Pressione Ctrl+C para parar o teste..."
    
    # Mostrar logs
    docker logs -f portalatt-test-container
else
    echo -e "${RED}❌ Container falhou ao iniciar${NC}"
    docker logs portalatt-test-container
fi

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Limpando recursos de teste...${NC}"
    docker stop portalatt-test-container 2>/dev/null
    docker rm portalatt-test-container 2>/dev/null
    echo -e "${GREEN}✅ Limpeza concluída!${NC}"
}

# Registrar cleanup no exit
trap cleanup EXIT