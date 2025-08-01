# Guia de Deploy no Render

Este projeto foi configurado para funcionar no Render como alternativa ao Vercel.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Conta no [Cloudinary](https://cloudinary.com) (gratuita)
3. Conta no [Supabase](https://supabase.com) (se usando banco de dados)

## Configuração do Cloudinary

1. Crie uma conta gratuita no Cloudinary
2. No dashboard, encontre suas credenciais:
   - Cloud Name
   - API Key
   - API Secret

## Deploy no Render

### Método 1: Usando render.yaml (Recomendado)

1. Faça push do código para seu repositório Git
2. No Render Dashboard, clique em "New +"
3. Selecione "Blueprint"
4. Conecte seu repositório
5. O Render detectará automaticamente o arquivo `render.yaml`

### Método 2: Configuração Manual

1. No Render Dashboard, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório
4. Configure:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

## Variáveis de Ambiente

Configure as seguintes variáveis no Render Dashboard:

```bash
# Cloudinary (obrigatório para upload de imagens)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret

# Supabase (se usando)
SUPABASE_URL=sua_supabase_url
SUPABASE_ANON_KEY=sua_supabase_anon_key

# Next.js
NODE_ENV=production
```

## Testes

Após o deploy, você pode testar os serviços:

- **Health Check**: `https://seu-app.onrender.com/api/test-render`
- **Teste de Banco**: `https://seu-app.onrender.com/api/test-render?test=db`
- **Teste Cloudinary**: `https://seu-app.onrender.com/api/test-render?test=cloudinary`
- **Todos os Testes**: `https://seu-app.onrender.com/api/test-render?test=all`

## Estrutura de Arquivos Adicionados

```
├── render.yaml                    # Configuração do Render
├── Dockerfile                     # Para containerização
├── .dockerignore                  # Arquivos ignorados no Docker
├── test-render/                   # Testes específicos do Render
│   ├── health-check.ts
│   └── database-connection.ts
├── app/api/test-render/           # Endpoint de testes
│   └── route.ts
└── RENDER_DEPLOYMENT.md           # Este guia
```

## Diferenças do Vercel

1. **Upload de Imagens**: Substituído Vercel Blob por Cloudinary
2. **Configuração**: Usa `render.yaml` em vez de `vercel.json`
3. **Deploy**: Build automático via Git em vez de CLI
4. **Domínio**: `.onrender.com` em vez de `.vercel.app`

## Troubleshooting

### Build Falha
- Verifique se todas as dependências estão no `package.json`
- Confirme que o comando de build está correto

### Upload de Imagens Não Funciona
- Verifique as variáveis de ambiente do Cloudinary
- Teste o endpoint: `/api/test-render?test=cloudinary`

### Problemas de Banco de Dados
- Confirme as variáveis do Supabase
- Teste o endpoint: `/api/test-render?test=db`

### App Não Carrega
- Verifique os logs no Render Dashboard
- Confirme que a porta 3000 está exposta
- Teste o health check: `/api/test-render`

## Recursos Gratuitos

### Render Free Tier
- 750 horas/mês de runtime
- Sleep após 15 min de inatividade
- Deploy automático via Git

### Cloudinary Free Tier
- 25 GB de storage
- 25 GB de bandwidth/mês
- Transformações básicas

### Supabase Free Tier
- 500 MB de database
- 5 GB de bandwidth/mês
- 50 MB de file storage