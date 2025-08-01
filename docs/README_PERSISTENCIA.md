# Guia de Persistência de Dados - Portal Drakkar

## 🚀 Como as alterações são salvas

### 1. Interface Administrativa

Todas as alterações feitas na interface administrativa (`/administrator`) são salvas no banco de dados Supabase:

1. **Faça suas alterações** nos campos desejados
2. **Clique em "Salvar Tudo"** no final da página
3. **Aguarde a confirmação** "✅ Dados salvos no banco de dados com sucesso!"
4. As alterações são **imediatamente refletidas** em todo o sistema

### 2. Auto-Save Automático

Algumas ações salvam automaticamente:
- ✅ Reordenação de itens (drag & drop)
- ✅ Upload de imagens
- ✅ Alteração de ordem de exibição

### 3. Páginas dos Dealers

Os dealers também salvam dados automaticamente:
- Novos pedidos
- Orçamentos
- Solicitações de serviço
- Inventário

## 🔍 Verificando a Persistência

### Comando de Verificação
```bash
npm run db:verify
```

Este comando:
- Testa a conexão com o banco
- Lista todas as tabelas e quantidade de registros
- Realiza teste de escrita/leitura

### Monitor Visual

Na página do administrador, você pode ver:
- Status de conexão em tempo real
- Quantidade de registros por tabela
- Última atualização de cada tabela

## 💾 Backup dos Dados

### Backup Manual
```bash
npm run db:backup
```

Cria um backup completo em `backups/backup-YYYY-MM-DD.json`

### Backup Automático via Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em Settings > Database
3. Configure backups automáticos

## 🚨 Troubleshooting

### Problema: Dados não estão salvando

1. **Verifique a conexão**
   ```bash
   npm run db:test
   ```

2. **Verifique as variáveis de ambiente**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Verifique os logs**
   - Console do navegador (F12)
   - Terminal do servidor

### Problema: Erro de permissão

1. Verifique se está usando `SUPABASE_SERVICE_ROLE_KEY`
2. Verifique políticas RLS no Supabase

### Problema: Dados desatualizados

1. Limpe o cache do navegador (Ctrl+F5)
2. Reinicie o servidor Next.js
3. Execute `npm run dev` novamente

## 📋 Checklist de Persistência

Antes de fazer alterações importantes:

- [ ] Fazer backup dos dados atuais
- [ ] Testar em ambiente de desenvolvimento
- [ ] Verificar conexão com banco
- [ ] Ter credenciais de backup

Após fazer alterações:

- [ ] Clicar em "Salvar Tudo"
- [ ] Aguardar confirmação de sucesso
- [ ] Verificar em outra aba/dispositivo
- [ ] Fazer backup se necessário

## 🛠️ Scripts Úteis

### Verificar saúde do sistema
```bash
npm run db:verify
```

### Criar backup local
```bash
npm run db:backup
```

### Testar conexão
```bash
npm run db:test
```

## 📞 Suporte

Em caso de problemas com persistência:

1. Verifique este guia
2. Consulte `/test-database` no navegador
3. Verifique logs do Supabase Dashboard
4. Entre em contato com o suporte técnico

## 🔐 Segurança

- **Nunca** compartilhe as chaves de API
- Faça backups regulares
- Use senhas fortes
- Mantenha as credenciais seguras

---

**Lembre-se**: Sempre clique em "Salvar Tudo" após fazer alterações importantes!