# Guia de Deploy no Vercel - Solução para Problemas de Cache

Este guia explica como resolver o problema de sincronização de dados entre o banco e o site no Vercel.

## 🔧 Configurações Implementadas

### 1. Arquivo `vercel.json`
- Configurações específicas para APIs
- Headers anti-cache forçados
- Timeout adequado para funções

### 2. `next.config.mjs` Atualizado
- ISR (Incremental Static Regeneration) desabilitado
- Headers anti-cache para rotas dinâmicas
- Revalidação forçada

### 3. APIs Otimizadas
- `export const dynamic = 'force-dynamic'` em todas as APIs críticas
- `export const revalidate = 0` para desabilitar cache
- Headers anti-cache específicos do Vercel

### 4. Cache Busting Agressivo
- Função `forceVercelRefresh()` implementada
- Cache busting com timestamps únicos
- Limpeza de service workers

## 🚀 Como Deploy no Vercel

### 1. Variáveis de Ambiente
Certifique-se de configurar no painel do Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### 2. Configurações de Build
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`
- Framework: `Next.js`

### 3. Configurações de Performance
- Região recomendada: `cle1` (Cleveland) para menor latência
- Function timeout: 30 segundos

## ⚡ Diferenças entre Render e Vercel

### Render
- Cache menos agressivo
- Revalidação automática funciona melhor
- Menos otimizações de edge

### Vercel
- Cache de edge muito agressivo
- Requer configurações específicas para dados dinâmicos
- Melhor performance, mas precisa de configuração cuidadosa

## 🛠️ Troubleshooting

### Se os dados ainda não atualizarem:

1. **Verifique as variáveis de ambiente** no painel do Vercel
2. **Force um novo deploy** após fazer alterações
3. **Limpe o cache do navegador** (Ctrl+Shift+R)
4. **Aguarde 2-3 minutos** após salvar dados (tempo de propagação)

### Logs úteis:
- Verifique o console do navegador para erros
- Use o painel de logs do Vercel para debugs
- Monitore as métricas de cache hit/miss

## 📝 Comandos Úteis

```bash
# Deploy forçado
vercel --prod

# Logs em tempo real
vercel logs

# Limpar cache do Vercel
vercel env rm VERCEL_CACHE_DISABLE
vercel env add VERCEL_CACHE_DISABLE true
```

## ✅ Funcionalidades Implementadas

- ✅ Cache busting automático
- ✅ Revalidação forçada de paths
- ✅ Headers anti-cache específicos
- ✅ Refresh automático após salvamento
- ✅ Limpeza de service workers
- ✅ Configurações de ISR otimizadas

Com essas configurações, o problema de sincronização entre o banco de dados e o site no Vercel deve estar resolvido.