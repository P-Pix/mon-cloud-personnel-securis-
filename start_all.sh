#!/bin/bash

# Arrêt en cas d'erreur
set -e

# 🔍 Vérifie qu'on est dans le bon dossier
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ Erreur : docker-compose.yml introuvable dans ce dossier."
  echo "📂 Position actuelle : $(pwd)"
  exit 1
fi

# 🔁 Vérifie que Docker fonctionne
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker ne semble pas démarrer. Lance Docker Desktop sous Windows."
  exit 1
fi

# 🧹 Suppression volume (ignore si inexistant)
echo "🧹 Suppression du volume Docker existant..."
docker volume rm mon-cloud-personnel-securis-_mysql-data 2>/dev/null || true

# 🐳 Démarrage Docker
echo "🚀 Démarrage des conteneurs Docker..."
docker compose up -d

# 📦 Installation dépendances React
echo "📦 Installation des dépendances frontend React..."
cd frontend-react
npm install

# ▶️ Démarrage React
echo "🚀 Démarrage frontend React..."
npm start &

# 📦 Installation dépendances Vue
cd ../frontend-vue
echo "📦 Installation des dépendances frontend Vue..."
npm install

# ▶️ Démarrage Vue
echo "🚀 Démarrage frontend Vue..."
npm run serve &

# ⌛ Pause pour que les serveurs aient le temps de démarrer
sleep 5

# 🌐 Ouverture navigateur
echo "🌐 Tentative d'ouverture du site sur http://localhost:3000"
if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
  open http://localhost:3000
elif command -v start &> /dev/null; then
  start chrome http://localhost:3000
else
  echo "🌐 Ouvre manuellement : http://localhost:3000"
fi

# 🔚 Retour au dossier racine
cd ..
