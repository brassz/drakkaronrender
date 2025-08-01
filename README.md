# 🚤 Portal ATT - Sistema de Gestão de Embarcações

Portal completo para gestão de vendas, cotações e configuração de embarcações da ATT Marine.

## 🚀 Configuração Rápida

### Opção 1: Configuração Automática (Recomendado)

```bash
# Clone o projeto (se ainda não foi feito)
git clone <url-do-repositorio>
cd portal-att

# Execute o script de configuração automática
./scripts/setup-project.sh
```

### Opção 2: Configuração Manual

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure suas credenciais do Supabase no arquivo `.env.local`**
   - Obtenha as credenciais em [app.supabase.com](https://app.supabase.com)

3. **Instale as dependências:**
   ```bash
   pnpm install
   # ou npm install / yarn install
   ```

4. **Execute o script do banco no Supabase SQL Editor:**
   - Copie o conteúdo de `scripts/complete-database-setup.sql`
   - Execute no dashboard do Supabase

## 🔍 Verificar Configuração

```bash
# Verificar se tudo está configurado corretamente
node scripts/check-config.js
```

## 🏃‍♂️ Executar o Projeto

```bash
# Modo de desenvolvimento
pnpm dev

# Acesse: http://localhost:3000
```

## 🧪 Testar Configuração

Após iniciar o servidor, acesse:

- **Teste geral:** http://localhost:3000/test-supabase
- **Teste do banco:** http://localhost:3000/test-database
- **Painel admin:** http://localhost:3000/admin

## 📁 Estrutura do Projeto

```
├── app/                    # Páginas e rotas da aplicação
│   ├── admin/             # Painel administrativo
│   ├── api/               # API routes
│   └── test-*/            # Páginas de teste
├── components/            # Componentes React reutilizáveis
├── lib/                   # Utilitários e configurações
│   ├── supabase.ts       # Configuração do Supabase
│   └── database-service.ts # Serviços do banco de dados
├── scripts/              # Scripts SQL e de configuração
└── hooks/                # React hooks customizados
```

## 🔧 Funcionalidades

- 📊 **Dashboard Administrativo** - Gestão completa do sistema
- 🚤 **Configurador de Embarcações** - Personalização de produtos
- 📋 **Sistema de Cotações** - Geração e gestão de propostas
- 📦 **Gestão de Pedidos** - Controle de vendas e produção
- 📈 **Relatórios de Vendas** - Analytics e métricas
- 🏪 **Portal do Revendedor** - Interface para concessionárias
- 📱 **Interface Responsiva** - Otimizado para todos os dispositivos

## 🛠️ Tecnologias

- **Frontend:** Next.js 14, React 18, TypeScript
- **UI:** Tailwind CSS, Radix UI, Shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Formulários:** React Hook Form + Zod
- **Estado:** React Context + Hooks
- **Análises:** Recharts
- **PDF:** jsPDF + html2canvas

## 📚 Documentação Detalhada

- [**Configuração do Supabase**](SETUP_SUPABASE.md) - Guia completo de setup
- [**Estrutura do Banco**](scripts/complete-database-setup.sql) - Schema das tabelas
- [**API Reference**](app/api/) - Documentação das rotas da API

## 🔒 Segurança

- ✅ Row Level Security (RLS) configurado
- ✅ Autenticação por tokens
- ✅ Políticas de acesso por role
- ✅ Variáveis de ambiente protegidas

## 🐛 Problemas Comuns

### Erro de conexão com Supabase
- Verifique se as credenciais estão corretas no `.env.local`
- Confirme se o projeto Supabase está ativo

### Tabelas não encontradas
- Execute o script `scripts/complete-database-setup.sql` no Supabase

### Erro de permissão
- Verifique se está usando a `SUPABASE_SERVICE_ROLE_KEY` correta

## 📞 Suporte

1. Execute o diagnóstico: `node scripts/check-config.js`
2. Consulte os logs do navegador (F12)
3. Teste a conexão em `/test-supabase`
4. Consulte a [documentação do Supabase](https://supabase.com/docs)

---

**Desenvolvido para ATT Marine** 🚤