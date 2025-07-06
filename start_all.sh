#!/bin/bash

echo "🚀 Démarrage Docker..."
docker-compose up -d

echo "🚀 Installation des dépendances frontend React..."
cd frontend-react
npm install

echo "🚀 Installation des dépendances frontend Vue..."
cd ../frontend-vue
npm install

echo "🚀 Démarrage frontend React..."
npm start &

echo "🚀 Démarrage frontend Vue..."
npm run serve &

cd ..

echo "🌐 Ouverture Chrome sur http://localhost:3000"
# Pour Windows : start chrome http://localhost:3000
# Pour Linux : xdg-open http://localhost:3000
# Pour Mac : open http://localhost:3000

if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
  open http://localhost:3000
elif command -v start &> /dev/null; then
  start chrome http://localhost:3000
else
  echo "Chrome non trouvé. Ouvre manuellement http://localhost:3000"
fi
