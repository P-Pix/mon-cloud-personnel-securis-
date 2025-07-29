#!/bin/bash

echo "🧪 Test du projet Mon Cloud Personnel Sécurisé"
echo "=============================================="

# Tester le serveur
echo "🔧 Test du serveur backend..."
cd /mnt/c/Users/Guillaume/Desktop/GitHub/mon-cloud-personnel-securis/server

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "❌ Dépendances serveur manquantes"
    exit 1
fi

# Tester la compilation TypeScript
echo "📝 Test de la compilation TypeScript..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ Erreurs TypeScript détectées"
    exit 1
fi
echo "✅ TypeScript OK"

# Tester le client
echo "🔧 Test du client frontend..."
cd ../client

if [ ! -d "node_modules" ]; then
    echo "❌ Dépendances client manquantes"
    exit 1
fi

echo "✅ Tous les tests passent !"
echo ""
echo "📋 Pour démarrer le projet :"
echo "   npm run dev (depuis la racine)"
echo ""
echo "🌐 URLs :"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
