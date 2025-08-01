# Configuração do Sistema de Atualização em Tempo Real

## Visão Geral

O sistema agora possui atualização em tempo real implementada usando Supabase Realtime. Isso significa que quando qualquer dado é alterado no banco de dados, todas as páginas abertas serão atualizadas automaticamente sem necessidade de recarregar a página ou fazer redeploy.

## Como Funciona

1. **Hook Personalizado**: Foi criado um hook `useRealtimeData` que escuta mudanças nas tabelas do banco de dados.
2. **Integração nas Páginas**: As principais páginas do sistema agora usam este hook para recarregar dados automaticamente.
3. **Cache Desabilitado**: As APIs foram configuradas para não usar cache, garantindo sempre dados frescos.

## Páginas com Realtime Habilitado

- **Administrador** (`/administrator`): Escuta mudanças em todas as tabelas principais
- **Dealer - Novo Barco** (`/dealer/new-boat`): Escuta mudanças nas configurações e preços
- **Dealer - Inventário** (`/dealer/inventory`): Escuta mudanças no inventário
- **Dealer - Marketing** (`/dealer/marketing/content`): Escuta mudanças no conteúdo de marketing

## Configuração do Supabase

Para que o sistema funcione corretamente, é necessário habilitar o Realtime no Supabase:

### Método 1: Pelo Painel do Supabase

1. Acesse seu projeto no [Supabase](https://app.supabase.com)
2. Vá para **Database** > **Replication**
3. Em "Source", clique em "0 tables" (ou o número atual de tabelas)
4. Ative a replicação para as seguintes tabelas:
   - engine_packages
   - hull_colors
   - upholstery_packages
   - additional_options
   - boat_models
   - dealers
   - orders
   - service_requests
   - marketing_content
   - marketing_manuals
   - marketing_warranties
   - factory_production
   - dealer_inventory
   - dealer_pricing
5. Clique em "Apply" para salvar

### Método 2: Via SQL

Execute o seguinte SQL no editor SQL do Supabase:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE engine_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE hull_colors;
ALTER PUBLICATION supabase_realtime ADD TABLE upholstery_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE additional_options;
ALTER PUBLICATION supabase_realtime ADD TABLE boat_models;
ALTER PUBLICATION supabase_realtime ADD TABLE dealers;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE marketing_content;
ALTER PUBLICATION supabase_realtime ADD TABLE marketing_manuals;
ALTER PUBLICATION supabase_realtime ADD TABLE marketing_warranties;
ALTER PUBLICATION supabase_realtime ADD TABLE factory_production;
ALTER PUBLICATION supabase_realtime ADD TABLE dealer_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE dealer_pricing;
```

### Verificar Configuração

Execute o comando para verificar a configuração:

```bash
npm run check-realtime
```

## Testando o Sistema

1. Abra duas janelas do navegador:
   - Uma com a página do administrador logada
   - Outra com uma página do dealer

2. Faça uma alteração no administrador (ex: adicionar um novo modelo de barco)

3. Observe que a página do dealer será atualizada automaticamente sem precisar recarregar

## Troubleshooting

### As mudanças não aparecem em tempo real

1. Verifique se o Realtime está habilitado no Supabase (use `npm run check-realtime`)
2. Verifique o console do navegador para mensagens de erro
3. Certifique-se de que as variáveis de ambiente estão corretas:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Performance

Se houver muitas atualizações simultâneas, o sistema possui um debounce natural através do Supabase Realtime. Múltiplas mudanças rápidas resultarão em apenas uma atualização da interface.

## Desenvolvimento Futuro

Para adicionar realtime a novas páginas:

1. Importe o hook: `import { useRealtimeMultipleTables } from "@/hooks/useRealtimeData"`
2. Adicione o hook após os useEffects existentes:

```typescript
useRealtimeMultipleTables(
  ['tabela1', 'tabela2'], // tabelas para escutar
  () => {
    // função para recarregar dados
    loadData()
  },
  true // habilitado
)
```