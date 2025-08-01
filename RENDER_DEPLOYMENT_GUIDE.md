# Guia de Deploy no RENDER

Este guia contém todas as instruções necessárias para fazer o deploy da aplicação PortalAtt no RENDER.

## 📋 Pré-requisitos

1. Conta no [RENDER](https://render.com/)
2. Conta no [Supabase](https://supabase.com/)
3. Código fonte no GitHub
4. Chaves de API necessárias

## 🚀 Passo a Passo para Deploy

### 1. Preparação do Banco de Dados Supabase

Certifique-se de que seu projeto Supabase está configurado com:
- URL do projeto: `https://[seu-projeto].supabase.co`
- Chave anônima (anon key)
- Chave de serviço (service role key)

### 2. Configuração no RENDER

#### 2.1 Criar Novo Web Service

1. Acesse o dashboard do RENDER
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure as seguintes opções:

**Configurações Básicas:**
- **Name:** `portalatt-app`
- **Environment:** `Node`
- **Region:** `US East (Ohio)` (ou sua preferência)
- **Branch:** `main`

**Build & Deploy:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

#### 2.2 Configurar Variáveis de Ambiente

No painel do RENDER, adicione as seguintes variáveis de ambiente:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave-anonima]
SUPABASE_SERVICE_ROLE_KEY=[sua-chave-de-servico]

# Application Configuration  
NEXT_PUBLIC_APP_URL=https://[seu-app].onrender.com
NEXTAUTH_URL=https://[seu-app].onrender.com
NEXTAUTH_SECRET=[sua-chave-secreta-unica]

# Node Environment
NODE_ENV=production

# Optional: Email Configuration
RESEND_API_KEY=[sua-chave-resend]

# Optional: AI Configuration
OPENAI_API_KEY=[sua-chave-openai]

# Optional: Blob Storage
BLOB_READ_WRITE_TOKEN=[seu-token-blob]
```

### 3. Deploy Automático

O RENDER fará o deploy automaticamente quando você:
1. Fazer push para a branch `main`
2. Clicar em "Manual Deploy" no dashboard

### 4. Verificação do Deploy

Após o deploy, acesse:
- **URL da aplicação:** `https://[seu-app].onrender.com`
- **Health check:** `https://[seu-app].onrender.com/api/health`

O endpoint de health check retornará:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX",
  "database": {
    "success": true
  },
  "environment": {
    "supabaseUrl": true,
    "supabaseAnonKey": true,
    "supabaseServiceKey": true
  }
}
```

## 🔧 Configurações Importantes

### Configuração do Next.js

O `next.config.mjs` foi otimizado para RENDER com:
- **Standalone output** para Docker
- **Cache headers** para APIs
- **Imagens não otimizadas** (compatibilidade)

### Configuração do Supabase

Arquivo `lib/supabase-render.ts` criado com:
- **Configurações de produção**
- **Health check automático**
- **Clientes server-side e admin**

### Scripts NPM

Adicionados scripts específicos para RENDER:
- `render:build` - Build otimizado para RENDER
- `render:start` - Start para produção

## 🐛 Troubleshooting

### Problemas Comuns

1. **Build Falha:**
   - Verifique se todas as dependências estão no `package.json`
   - Confirme que o comando de build está correto

2. **Erro de Conexão com Banco:**
   - Verifique as variáveis de ambiente do Supabase
   - Teste o health check: `/api/health`

3. **Aplicação Não Carrega:**
   - Verifique os logs no dashboard do RENDER
   - Confirme que a `NEXTAUTH_URL` está correta

### Logs e Monitoramento

Acesse os logs no dashboard do RENDER:
1. Vá para seu serviço
2. Clique na aba "Logs"
3. Monitore erros em tempo real

## 📊 Monitoramento

### Health Check Automático

O RENDER verificará automaticamente a saúde da aplicação via:
- **URL:** `/api/health`
- **Intervalo:** A cada 30 segundos
- **Timeout:** 10 segundos

### Métricas Disponíveis

No dashboard do RENDER você pode ver:
- CPU e memória utilizados
- Requests por minuto
- Response time
- Error rate

## 🔄 Deploy Contínuo

Para habilitar deploy automático:
1. Vá para "Settings" do seu serviço
2. Em "Auto-Deploy" selecione "Yes"
3. Escolha a branch `main`

Agora todo push para `main` fará deploy automático!

## 📁 Arquivos de Configuração

- **render.yaml** - Configuração declarativa do RENDER
- **.env.example** - Template das variáveis de ambiente
- **Dockerfile** - Container otimizado (opcional)
- **RENDER_DEPLOYMENT_GUIDE.md** - Este guia

## 🆘 Suporte

Se precisar de ajuda:
1. Verifique os logs no dashboard do RENDER
2. Teste o health check da aplicação
3. Confirme todas as variáveis de ambiente
4. Verifique a conexão com o Supabase

---

**Sucesso!** 🎉 Sua aplicação agora está rodando no RENDER com todas as otimizações necessárias para produção.