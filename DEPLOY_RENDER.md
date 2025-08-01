# Deploy no Render

Este guia explica como fazer o deploy desta aplicação Next.js no Render.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório Git (GitHub, GitLab ou Bitbucket)

## Métodos de Deploy

### Método 1: Usando render.yaml (Recomendado)

1. O arquivo `render.yaml` já está configurado no projeto
2. Faça commit e push das mudanças para seu repositório
3. No Render Dashboard:
   - Clique em "New +" → "Blueprint"
   - Conecte seu repositório
   - O Render detectará automaticamente o `render.yaml`
   - Clique em "Apply"

### Método 2: Usando Dockerfile

1. O `Dockerfile` já está configurado no projeto
2. No Render Dashboard:
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório
   - Escolha "Docker" como environment
   - Configure as variáveis de ambiente

### Método 3: Deploy Manual

1. No Render Dashboard:
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório
   - Configure:
     - **Name**: portalatt-nextjs
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start`
     - **Node Version**: 20.x

## Variáveis de Ambiente

Configure as seguintes variáveis no Render Dashboard:

```env
# Database
DATABASE_URL=sua_url_do_banco

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service

# OpenAI
OPENAI_API_KEY=sua_chave_openai

# Resend (para emails)
RESEND_API_KEY=sua_chave_resend

# App Settings
NEXT_PUBLIC_APP_URL=https://seu-app.onrender.com
NODE_ENV=production
```

## Migrando do Vercel Blob

O projeto usa `@vercel/blob` para upload de imagens. Para o Render, você tem algumas opções:

### Opção 1: Usar Supabase Storage (Recomendado)
- Já está usando Supabase para o banco de dados
- Pode usar o Storage do Supabase para arquivos
- Veja o arquivo `SUPABASE_STORAGE_MIGRATION.md`

### Opção 2: Usar AWS S3 ou Cloudinary
- Configurar um bucket S3 ou conta Cloudinary
- Atualizar o código em `app/api/upload-image/route.ts`

### Opção 3: Usar o sistema de arquivos local (não recomendado para produção)
- Arquivos serão perdidos quando o serviço reiniciar
- Apenas para testes

## Configurações Adicionais

### Custom Domain
1. No painel do serviço no Render
2. Vá para "Settings" → "Custom Domains"
3. Adicione seu domínio personalizado

### Auto-Deploy
- Já configurado no `render.yaml`
- Cada push para a branch principal fará deploy automático

### Health Checks
O Render fará health checks automáticos na rota `/`

### Logs
- Acesse os logs em tempo real no dashboard do Render
- Ou use o Render CLI: `render logs -s nome-do-servico`

## Comandos Úteis

```bash
# Testar o build localmente
npm run build

# Testar com Docker localmente
docker build -t portalatt .
docker run -p 3000:3000 portalatt

# Verificar variáveis de ambiente
npm run env:check
```

## Troubleshooting

### Build falha
- Verifique se todas as dependências estão no `package.json`
- O projeto está configurado para ignorar erros de TypeScript e ESLint

### Aplicação não inicia
- Verifique as variáveis de ambiente
- Confirme que a porta está configurada corretamente (PORT=3000)

### Performance
- O Render Free tier pode ter cold starts
- Considere fazer upgrade para um plano pago para melhor performance

## Custos

### Render Free Tier
- 750 horas grátis por mês
- Sleep após 15 minutos de inatividade
- Ideal para projetos pessoais

### Render Paid Plans
- Starter: $7/mês
- Sem sleep
- Melhor performance
- SSL customizado incluído

## Suporte

- [Documentação do Render](https://render.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Status do Render](https://status.render.com)