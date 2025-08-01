# Instruções para Deploy no Vercel

## Problema de Cache Resolvido

O problema de não salvar as alterações no site estava relacionado ao cache agressivo do Vercel. As seguintes mudanças foram implementadas para resolver o problema:

### 1. Arquivo `vercel.json`
- Criado arquivo de configuração específico do Vercel
- Desabilita cache para todas as rotas de API
- Adiciona headers `CDN-Cache-Control` e `Vercel-CDN-Cache-Control` com valor `no-store`

### 2. Arquivo `middleware.ts`
- Criado middleware que adiciona headers de no-cache em todas as respostas
- Headers específicos do Vercel são adicionados quando detectado o ambiente Vercel

### 3. Atualizações no `next.config.mjs`
- Adicionado `generateBuildId` dinâmico para forçar builds únicos
- Headers de cache atualizados com `s-maxage=0` para desabilitar cache de CDN

### 4. APIs atualizadas
- `app/api/save-admin-data/route.ts`: Adicionado `export const dynamic = 'force-dynamic'` e `export const revalidate = 0`
- `app/api/get-admin-data/route.ts`: Mesmas configurações adicionadas
- Melhorada a revalidação de paths com tipo 'layout'

### 5. Componente Administrativo
- Adicionado reload automático da página após salvar quando no ambiente Vercel
- Adicionado delay de 1 segundo antes de recarregar dados para garantir que a revalidação foi concluída

## Configuração de Variáveis de Ambiente no Vercel

Certifique-se de que as seguintes variáveis de ambiente estão configuradas no painel do Vercel:

1. `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
2. `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase
3. `NEXT_PUBLIC_VERCEL_ENV` - Esta variável é automaticamente definida pelo Vercel

## Deploy

1. Faça commit de todas as mudanças
2. Push para o repositório
3. O Vercel detectará automaticamente as mudanças e fará o redeploy
4. Após o deploy, teste salvando dados no painel administrativo

## Verificação

Para verificar se o problema foi resolvido:

1. Acesse o painel administrativo
2. Faça uma alteração (ex: adicionar um novo modelo de barco)
3. Clique em salvar
4. A página deve recarregar automaticamente após salvar
5. Verifique se as alterações persistem ao navegar entre páginas

## Troubleshooting

Se o problema persistir:

1. Limpe o cache do navegador
2. Verifique no painel do Vercel se todas as variáveis de ambiente estão configuradas
3. Verifique os logs de função no painel do Vercel para erros
4. Certifique-se de que o banco de dados Supabase está acessível

## Diferenças entre Render e Vercel

- **Render**: Menos agressivo com cache, mudanças são refletidas imediatamente
- **Vercel**: Cache de CDN global mais agressivo, requer configuração específica para desabilitar

As mudanças implementadas garantem que o Vercel se comporte de forma similar ao Render em relação ao cache.