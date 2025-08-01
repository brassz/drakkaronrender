#!/bin/bash

# RENDER Deployment Script for PortalAtt
# This script helps with the deployment process to RENDER

set -e

echo "🚀 RENDER Deployment Script for PortalAtt"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required files exist
check_files() {
    echo -e "${YELLOW}📋 Checking required files...${NC}"
    
    required_files=(
        "package.json"
        "next.config.mjs"
        "render.yaml"
        ".env.example"
        "lib/supabase-render.ts"
        "app/api/health/route.ts"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✅ $file exists${NC}"
        else
            echo -e "${RED}❌ $file missing${NC}"
            exit 1
        fi
    done
}

# Validate environment variables template
validate_env() {
    echo -e "${YELLOW}🔍 Validating environment variables...${NC}"
    
    if [ -f ".env.example" ]; then
        echo -e "${GREEN}✅ .env.example template ready${NC}"
        echo -e "${YELLOW}📝 Required environment variables:${NC}"
        grep -E "^[A-Z_]+" .env.example | cut -d'=' -f1
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
}

# Check package.json for required scripts
check_scripts() {
    echo -e "${YELLOW}📦 Checking package.json scripts...${NC}"
    
    if grep -q '"render:build"' package.json; then
        echo -e "${GREEN}✅ render:build script found${NC}"
    else
        echo -e "${RED}❌ render:build script missing${NC}"
        exit 1
    fi
    
    if grep -q '"render:start"' package.json; then
        echo -e "${GREEN}✅ render:start script found${NC}"
    else
        echo -e "${RED}❌ render:start script missing${NC}"
        exit 1
    fi
}

# Test build locally
test_build() {
    echo -e "${YELLOW}🔨 Testing local build...${NC}"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        npm install
    fi
    
    # Run build
    echo -e "${YELLOW}🏗️ Building application...${NC}"
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build successful${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
}

# Check Git status
check_git() {
    echo -e "${YELLOW}📝 Checking Git status...${NC}"
    
    if [ -d ".git" ]; then
        if [ -n "$(git status --porcelain)" ]; then
            echo -e "${YELLOW}⚠️ You have uncommitted changes${NC}"
            git status --porcelain
            echo -e "${YELLOW}Consider committing before deployment${NC}"
        else
            echo -e "${GREEN}✅ Working directory clean${NC}"
        fi
        
        branch=$(git branch --show-current)
        echo -e "${GREEN}📍 Current branch: $branch${NC}"
    else
        echo -e "${RED}❌ Not a Git repository${NC}"
        exit 1
    fi
}

# Show deployment instructions
show_instructions() {
    echo -e "${GREEN}🎉 Pre-deployment checks passed!${NC}"
    echo ""
    echo -e "${YELLOW}📖 Next Steps for RENDER Deployment:${NC}"
    echo ""
    echo "1. 🌐 Go to https://render.com and create a new Web Service"
    echo "2. 🔗 Connect your GitHub repository"
    echo "3. ⚙️ Configure the service:"
    echo "   - Name: portalatt-app"
    echo "   - Environment: Node"
    echo "   - Build Command: npm install && npm run build"
    echo "   - Start Command: npm start"
    echo "   - Health Check Path: /api/health"
    echo ""
    echo "4. 🔑 Set the following environment variables in RENDER:"
    echo ""
    grep -E "^[A-Z_]+" .env.example | while read line; do
        var_name=$(echo $line | cut -d'=' -f1)
        echo "   - $var_name"
    done
    echo ""
    echo "5. 🚀 Deploy!"
    echo ""
    echo -e "${GREEN}📚 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md${NC}"
}

# Run all checks
main() {
    check_files
    echo ""
    validate_env
    echo ""
    check_scripts
    echo ""
    test_build
    echo ""
    check_git
    echo ""
    show_instructions
}

# Run the script
main