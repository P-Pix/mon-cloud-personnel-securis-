#!/bin/bash

# Script d'installation et de configuration du Cloud Personnel Sécurisé

echo "🚀 Installation du Cloud Personnel Sécurisé"
echo "==========================================="

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js (version 18+)"
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

echo "📦 Installation des dépendances du serveur..."
cd server && npm install
cd ..

echo "📦 Installation des dépendances du client..."
cd client && npm install
cd ..

# Configurer l'environnement serveur
echo "⚙️ Configuration de l'environnement serveur..."
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "✅ Fichier .env créé pour le serveur"
    echo "⚠️  IMPORTANT: Éditez server/.env pour configurer vos clés secrètes!"
else
    echo "ℹ️  Le fichier server/.env existe déjà"
fi

# Configurer l'environnement client
echo "⚙️ Configuration de l'environnement client..."
if [ ! -f "client/.env" ]; then
    echo "VITE_API_URL=http://localhost:3001/api" > client/.env
    echo "✅ Fichier .env créé pour le client"
else
    echo "ℹ️  Le fichier client/.env existe déjà"
fi

echo ""
echo "🎉 Installation terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Éditez server/.env pour configurer vos clés secrètes"
echo "   2. Lancez le projet avec: npm run dev"
echo "   3. Ouvrez http://localhost:3000 dans votre navigateur"
echo ""
echo "🔐 SÉCURITÉ: Changez impérativement JWT_SECRET et ENCRYPTION_KEY en production!"
echo ""
