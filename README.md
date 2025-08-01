# Portal ATT - Sistema de Gestão de Vendas de Barcos

Sistema completo para gestão de vendas de barcos, incluindo configuração de produtos, precificação, controle de produção e análise de vendas.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados e autenticação
- **Radix UI** - Componentes de UI acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (gerenciador de pacotes)
- Conta no Supabase

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone [url-do-repositorio]
cd portalatt-copia2
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure o Supabase

1. Crie uma conta no [Supabase](https://app.supabase.com)
2. Crie um novo projeto
3. Acesse **Settings > API** no painel do Supabase
4. Copie as seguintes credenciais:
   - Project URL
   - Anon/Public Key
   - Service Role Key

### 4. Configure as variáveis de ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Edite o arquivo `.env.local` e adicione suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
```

### 5. Configure o banco de dados

O sistema precisa das seguintes tabelas no Supabase:

- `engine_packages` - Pacotes de motor
- `hull_colors` - Cores de casco
- `additional_options` - Opções adicionais
- `boat_sales` - Vendas de barcos
- `dealer_config` - Configurações do revendedor
- `dealer_pricing` - Precificação por revendedor
- `factory_production` - Produção da fábrica
- `service_messages` - Mensagens de serviço

Execute o script de seed para criar dados de exemplo:

```bash
# Acesse /api/seed-sample-data em seu navegador após iniciar o servidor
```

### 6. Execute o projeto

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🏗️ Estrutura do Projeto

```
├── app/                    # App Router do Next.js
│   ├── api/               # Rotas da API
│   ├── admin/             # Páginas de administração
│   ├── dealer/            # Páginas do revendedor
│   └── factory/           # Páginas da fábrica
├── components/            # Componentes React
├── lib/                   # Utilitários e serviços
├── hooks/                 # Custom React hooks
├── styles/               # Estilos globais
└── public/               # Arquivos estáticos
```

## 🔑 Funcionalidades Principais

### Para Administradores
- Gestão completa de produtos (motores, cores, opções)
- Configuração de preços base
- Análise de vendas e produção
- Gestão de revendedores

### Para Revendedores
- Configuração de preços personalizados
- Registro de vendas
- Visualização de comissões
- Análise de desempenho

### Para Fábrica
- Controle de produção
- Gestão de estoque
- Relatórios de produção

## 🧪 Testes

### Testar conexão com o banco de dados

1. Acesse `/test-supabase` para verificar a conexão
2. Use o componente `DatabaseTest` para testes completos

### Verificar configuração

Acesse `/deployment-checklist` para verificar se todas as configurações estão corretas.

## 🚨 Solução de Problemas

### Erro de conexão com Supabase

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme que o projeto Supabase está ativo
3. Verifique as permissões das tabelas no Supabase

### Erro ao carregar dados

1. Verifique se as tabelas foram criadas corretamente
2. Execute o script de seed para popular dados iniciais
3. Verifique os logs do console para erros específicos

## 📝 Variáveis de Ambiente

| Variável | Descrição | Onde encontrar |
|----------|-----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública/anônima | Settings > API > Project API keys |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (servidor) | Settings > API > Project API keys |

⚠️ **Importante**: Nunca exponha a `SUPABASE_SERVICE_ROLE_KEY` no código cliente ou repositórios públicos.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença privada. Todos os direitos reservados.