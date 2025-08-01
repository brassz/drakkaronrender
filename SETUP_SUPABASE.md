# 🚀 Configuração do Supabase - Portal ATT

Este guia vai te ajudar a configurar o Supabase para que o projeto funcione completamente.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js e pnpm instalados
3. Acesso ao projeto clonado

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Defina:
   - **Nome do projeto**: portal-att (ou nome de sua preferência)
   - **Senha do banco**: uma senha forte
   - **Região**: escolha a mais próxima (ex: South America - São Paulo)
5. Clique em "Create new project"
6. Aguarde alguns minutos para o projeto ser criado

### 2. Obter as Credenciais

1. No dashboard do seu projeto, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: chave pública para uso no frontend
   - **service_role**: chave privada para operações admin (⚠️ mantenha secreta!)

### 3. Configurar Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` com suas credenciais:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

### 4. Criar as Tabelas do Banco

1. No dashboard do Supabase, vá em **SQL Editor**
2. Execute o script principal de criação das tabelas:
   - Abra o arquivo `scripts/complete-database-setup.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em "Run" para executar

### 5. Configurar Políticas de Segurança (RLS)

As políticas de Row Level Security já estão incluídas no script principal. Elas garantem:
- Dealers só podem ver seus próprios dados
- Usuários autenticados podem acessar dados públicos
- Administradores têm acesso completo

### 6. Instalar Dependências e Testar

1. Instale as dependências:
   ```bash
   pnpm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

3. Acesse a página de teste:
   ```
   http://localhost:3000/test-supabase
   ```

4. Verifique se todas as conexões estão funcionando ✅

### 7. Popular com Dados Iniciais (Opcional)

Na página de teste, clique em "Inserir Dados de Exemplo" para popular o banco com dados iniciais para desenvolvimento.

## 🔍 Verificação da Configuração

### Problemas Comuns

1. **Erro de conexão**: Verifique se as URLs e chaves estão corretas
2. **Erro de permissão**: Confirme se está usando a `service_role` key para operações admin
3. **Tabelas não encontradas**: Execute o script de criação das tabelas
4. **CORS error**: Certifique-se de que o domínio está configurado no Supabase

### URLs de Teste

- Teste geral: `/test-supabase`
- Teste do banco: `/test-database`
- Configuração de vendedores: `/admin`

## 📁 Estrutura do Banco

O projeto utiliza as seguintes tabelas principais:

- `dealers` - Vendedores/concessionárias
- `boat_models` - Modelos de embarcações
- `engine_packages` - Pacotes de motor
- `hull_colors` - Cores de casco
- `upholstery_packages` - Pacotes de estofamento
- `additional_options` - Opções adicionais
- `quotes` - Cotações
- `orders` - Pedidos
- `boat_sales` - Vendas realizadas

## 🛡️ Segurança

- Nunca commite o arquivo `.env.local`
- A `service_role` key tem poderes administrativos - mantenha segura
- As políticas RLS protegem os dados automaticamente
- Use HTTPS em produção

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Consulte a documentação do [Supabase](https://supabase.com/docs)
3. Teste a conexão na página `/test-supabase`

---

✅ **Projeto configurado com sucesso!** Agora você pode usar todas as funcionalidades do Portal ATT.