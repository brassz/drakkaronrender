# Deploy no Render

Este projeto está configurado para deploy no Render. Siga as instruções abaixo para fazer o deploy.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Conta no [Supabase](https://supabase.com) com projeto configurado
3. Chave da API do OpenAI (opcional, para funcionalidades de IA)
4. Conta no [Resend](https://resend.com) (opcional, para envio de emails)
5. Token do Vercel Blob Storage (opcional, para upload de arquivos)

## Configuração do Deploy

### 1. Fork ou Clone o Repositório

Certifique-se de que o código está em um repositório Git (GitHub, GitLab, etc).

### 2. Criar Novo Web Service no Render

1. Acesse o [Dashboard do Render](https://dashboard.render.com)
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório Git
4. Configure as seguintes opções:

   - **Name**: `portalatt-nextjs` (ou nome de sua preferência)
   - **Region**: Oregon (US West) ou a região mais próxima
   - **Branch**: main (ou sua branch principal)
   - **Runtime**: Node
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `./render-start.sh`
   - **Plan**: Free (ou o plano desejado)

### 3. Configurar Variáveis de Ambiente

No painel do Render, adicione as seguintes variáveis de ambiente:

#### Obrigatórias:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase

#### Opcionais:
- `OPENAI_API_KEY`: Chave da API do OpenAI
- `RESEND_API_KEY`: Chave da API do Resend
- `BLOB_READ_WRITE_TOKEN`: Token do Vercel Blob Storage

### 4. Deploy

1. Clique em "Create Web Service"
2. O Render iniciará o processo de build e deploy automaticamente
3. Aguarde o processo ser concluído (pode levar alguns minutos)

## Verificação do Deploy

Após o deploy bem-sucedido:

1. Acesse a URL fornecida pelo Render
2. Verifique o health check em: `https://seu-app.onrender.com/api/health`
3. Teste as funcionalidades principais da aplicação

## Monitoramento

O Render fornece:
- Logs em tempo real
- Métricas de performance
- Alertas de saúde da aplicação
- Auto-restart em caso de falha

## Troubleshooting

### Build falha
- Verifique os logs de build no painel do Render
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se os scripts de build têm permissão de execução

### Aplicação não inicia
- Verifique se todas as variáveis de ambiente estão configuradas
- Confira os logs de runtime no painel do Render
- Verifique se a porta está sendo usada corretamente (`$PORT`)

### Problemas de conexão com Supabase
- Verifique se as chaves do Supabase estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique as configurações de segurança do Supabase

## Atualizações

O Render suporta deploy automático:
- Cada push para a branch configurada iniciará um novo deploy
- Você pode desabilitar o auto-deploy nas configurações se preferir

## Comandos Úteis

```bash
# Testar build localmente
./render-build.sh

# Testar inicialização localmente
PORT=3000 ./render-start.sh

# Verificar variáveis de ambiente
node -e "console.log(process.env)"
```

## Suporte

Para problemas específicos:
- Render: https://render.com/docs
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs