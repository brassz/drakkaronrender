#!/usr/bin/env node

// 🔍 Script de Verificação da Configuração - Portal ATT
// Este script verifica se o projeto está configurado corretamente

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificação da Configuração - Portal ATT');
console.log('===========================================');
console.log('');

let hasErrors = false;

// Verificar se o arquivo .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
    console.log('❌ Arquivo .env.local não encontrado');
    console.log('   Execute: cp .env.example .env.local');
    console.log('   Ou use: ./scripts/setup-project.sh');
    hasErrors = true;
} else {
    console.log('✅ Arquivo .env.local encontrado');
    
    // Ler o arquivo .env.local
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Verificar variáveis obrigatórias
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
        'SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    console.log('');
    console.log('🔧 Verificando variáveis de ambiente:');
    
    requiredVars.forEach(varName => {
        const regex = new RegExp(`${varName}=(.+)`);
        const match = envContent.match(regex);
        
        if (!match || match[1].includes('sua_') || match[1].includes('seu-projeto')) {
            console.log(`❌ ${varName}: não configurado`);
            hasErrors = true;
        } else {
            console.log(`✅ ${varName}: configurado`);
        }
    });
}

console.log('');

// Verificar se as dependências estão instaladas
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('❌ Dependências não instaladas');
    console.log('   Execute: pnpm install (ou npm install / yarn install)');
    hasErrors = true;
} else {
    console.log('✅ Dependências instaladas');
}

// Verificar se o script do banco existe
const dbScriptPath = path.join(process.cwd(), 'scripts', 'complete-database-setup.sql');
if (!fs.existsSync(dbScriptPath)) {
    console.log('❌ Script de criação do banco não encontrado');
    hasErrors = true;
} else {
    console.log('✅ Script de criação do banco encontrado');
}

console.log('');
console.log('==========================================');

if (hasErrors) {
    console.log('❌ Configuração incompleta!');
    console.log('');
    console.log('📝 Para configurar automaticamente:');
    console.log('   ./scripts/setup-project.sh');
    console.log('');
    console.log('📖 Para configuração manual, consulte:');
    console.log('   SETUP_SUPABASE.md');
    process.exit(1);
} else {
    console.log('✅ Configuração parece estar correta!');
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('1. Execute o script de criação das tabelas no Supabase');
    console.log('2. Inicie o projeto: pnpm dev');
    console.log('3. Teste em: http://localhost:3000/test-supabase');
    console.log('');
    process.exit(0);
}