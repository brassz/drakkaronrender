# Use Node.js 18 como base
FROM node:18-alpine

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["pnpm", "start"]