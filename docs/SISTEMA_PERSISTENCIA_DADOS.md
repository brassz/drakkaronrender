# Sistema de Persistência de Dados - Portal Drakkar

## Visão Geral

O sistema utiliza Supabase como banco de dados principal para persistir todas as alterações feitas no site. Todas as modificações realizadas através da interface administrativa são automaticamente salvas no banco de dados.

## Fluxo de Persistência

### 1. Interface Administrativa (`/administrator`)

Quando o administrador faz alterações:

1. **Alterações Locais**: As mudanças são primeiro aplicadas no estado local (React state)
2. **Salvamento Manual**: Ao clicar em "Salvar Tudo", a função `saveAll()` é executada
3. **Chamada API**: Uma requisição POST é enviada para `/api/save-admin-data`
4. **Persistência**: O DatabaseService salva os dados no Supabase
5. **Revalidação**: O Next.js revalida os caches para atualizar todas as páginas

### 2. Endpoints de Salvamento

#### Principal: `/api/save-admin-data`
- Salva: engine_packages, hull_colors, upholstery_packages, additional_options, boat_models, dealers, orders
- Usa transações para garantir consistência
- Revalida caches após salvamento

#### Outros endpoints importantes:
- `/api/save-order` - Salva pedidos de dealers
- `/api/save-quote` - Salva orçamentos
- `/api/save-service-request` - Salva solicitações de serviço
- `/api/save-display-order` - Salva ordem de exibição dos itens
- `/api/marketing-content` - Salva conteúdo de marketing
- `/api/marketing-manuals` - Salva manuais
- `/api/marketing-warranties` - Salva garantias

### 3. Tabelas do Banco de Dados

```sql
-- Principais tabelas de configuração
- engine_packages
- hull_colors
- upholstery_packages
- additional_options
- boat_models
- dealers

-- Tabelas de transações
- orders
- quotes
- service_requests
- factory_production

-- Tabelas de conteúdo
- marketing_content
- marketing_manuals
- marketing_warranties

-- Configurações
- admin_settings
```

## Garantindo Persistência

### Auto-Save em Reordenação
Quando itens são reordenados (drag & drop), o sistema salva automaticamente:
```typescript
const handleDragEnd = async (result: any, type: string) => {
  // ... reordenação ...
  await saveDisplayOrder(type, updatedItems)
}
```

### Validação de Dados
Antes de salvar, o sistema valida:
- Campos obrigatórios preenchidos
- Formatos corretos (números, emails, etc.)
- Relacionamentos válidos entre tabelas

### Sincronização em Tempo Real
1. **Cache Invalidation**: Após salvar, o sistema invalida caches
2. **Revalidação de Paths**: Páginas são revalidadas automaticamente
3. **Storage Events**: Notifica outras abas/janelas sobre mudanças

## Troubleshooting

### Dados não persistindo?

1. **Verificar Conexão**:
   - Acessar `/test-database` para testar conexão
   - Verificar variáveis de ambiente

2. **Logs de Erro**:
   - Verificar console do navegador
   - Verificar logs do servidor (terminal)

3. **Permissões Supabase**:
   - Verificar se SUPABASE_SERVICE_ROLE_KEY está configurada
   - Verificar políticas RLS no Supabase

### Forçar Sincronização

Para forçar uma sincronização completa:
1. No admin, clicar em "Salvar Tudo"
2. Aguardar mensagem de sucesso
3. Recarregar a página (Ctrl+F5)

## Backup e Recuperação

### Backup Manual
1. Acessar Supabase Dashboard
2. Ir em Settings > Database
3. Clicar em "Download backup"

### Recuperação
1. Em caso de perda de dados, restaurar backup via Supabase
2. Executar script de migração se necessário

## Scripts SQL Importantes

Localização: `/scripts/`
- `complete-database-setup.sql` - Criação inicial do banco
- `create-*.sql` - Scripts de criação de tabelas individuais
- `migration-*.sql` - Migrações incrementais

## Monitoramento

Para monitorar a saúde do sistema:
1. Verificar página `/test-database`
2. Monitorar logs no Supabase Dashboard
3. Configurar alertas para falhas de salvamento