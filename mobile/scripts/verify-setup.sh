#!/bin/bash

# Script de vérification de l'installation mobile Respira
# Usage: ./scripts/verify-setup.sh

echo "🔍 Vérification de l'installation mobile Respira..."
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

ERRORS=0

echo -e "\n📱 Vérification de l'environnement..."

# Vérifier Node.js
node --version > /dev/null 2>&1
check_result $? "Node.js installé"

# Vérifier npm
npm --version > /dev/null 2>&1
check_result $? "npm installé"

# Vérifier Java
java -version > /dev/null 2>&1
check_result $? "Java installé"

# Vérifier Android SDK (via ANDROID_HOME)
if [ -n "$ANDROID_HOME" ]; then
    check_result 0 "ANDROID_HOME configuré"
else
    check_result 1 "ANDROID_HOME configuré"
fi

echo -e "\n📁 Vérification des fichiers..."

# Vérifier les fichiers essentiels
files=(
    "package.json"
    "App.tsx"
    "index.js"
    "tsconfig.json"
    "babel.config.js"
    "metro.config.js"
    ".env"
    "android/build.gradle"
    "android/app/build.gradle"
    "android/gradlew"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        check_result 0 "$file existe"
    else
        check_result 1 "$file existe"
    fi
done

echo -e "\n📦 Vérification des dépendances..."

# Vérifier si node_modules existe
if [ -d "node_modules" ]; then
    check_result 0 "node_modules installé"
else
    echo -e "${YELLOW}⚠️  node_modules manquant - exécutez 'npm install'${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo -e "\n🔧 Vérification de la configuration..."

# Vérifier les variables d'environnement
if [ -f ".env" ]; then
    if grep -q "SUPABASE_URL" .env && grep -q "SUPABASE_ANON_KEY" .env; then
        check_result 0 "Variables Supabase configurées"
    else
        check_result 1 "Variables Supabase configurées"
    fi
else
    check_result 1 "Fichier .env existe"
fi

# Vérifier la structure des dossiers
dirs=(
    "src"
    "src/screens"
    "src/navigation"
    "src/services"
    "src/store"
    "src/theme"
    "android/app/src/main"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        check_result 0 "Dossier $dir existe"
    else
        check_result 1 "Dossier $dir existe"
    fi
done

echo -e "\n🧪 Tests de base..."

# Vérifier la syntaxe TypeScript (si tsc est disponible)
if command -v npx > /dev/null 2>&1; then
    npx tsc --noEmit > /dev/null 2>&1
    check_result $? "Syntaxe TypeScript valide"
else
    echo -e "${YELLOW}⚠️  npx non disponible - impossible de vérifier TypeScript${NC}"
fi

# Vérifier que gradlew est exécutable
if [ -x "android/gradlew" ]; then
    check_result 0 "gradlew exécutable"
else
    check_result 1 "gradlew exécutable"
fi

echo -e "\n📊 Résumé de la vérification..."
echo "=================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Tout est configuré correctement !${NC}"
    echo -e "\n📱 Commandes disponibles :"
    echo -e "  ${GREEN}npm install${NC}     - Installer les dépendances"
    echo -e "  ${GREEN}npm run android${NC} - Lancer sur Android"
    echo -e "  ${GREEN}npm run build:apk${NC} - Générer APK debug"
    echo -e "  ${GREEN}npm run build:aab${NC} - Générer AAB release"
    echo -e "\n📚 Documentation :"
    echo -e "  ${GREEN}README.md${NC}       - Documentation principale"
    echo -e "  ${GREEN}CHECKLIST.md${NC}    - Liste de vérification complète"
    echo -e "  ${GREEN}../FASTSTART.md${NC} - Guide de démarrage rapide"
    
    exit 0
else
    echo -e "${RED}❌ $ERRORS erreur(s) détectée(s)${NC}"
    echo -e "\n🔧 Actions recommandées :"
    
    if [ ! -d "node_modules" ]; then
        echo -e "  1. Exécuter ${YELLOW}npm install${NC}"
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "  2. Copier ${YELLOW}cp .env.example .env${NC} et configurer"
    fi
    
    if [ -z "$ANDROID_HOME" ]; then
        echo -e "  3. Configurer ${YELLOW}ANDROID_HOME${NC} dans votre shell"
    fi
    
    if [ ! -x "android/gradlew" ]; then
        echo -e "  4. Rendre gradlew exécutable : ${YELLOW}chmod +x android/gradlew${NC}"
    fi
    
    echo -e "\n📖 Consultez FASTSTART.md pour plus d'informations"
    exit 1
fi
