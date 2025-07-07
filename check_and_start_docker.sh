#!/bin/bash

echo "🔍 Vérification de Docker Desktop sous Windows..."

# Vérifie si Docker Desktop est en cours (via PowerShell)
docker_desktop_running=$(powershell.exe -Command "Get-Process -Name 'Docker Desktop' -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count" | tr -d '\r')

if [ "$docker_desktop_running" -eq 0 ]; then
  echo "⚠️ Docker Desktop n'est pas lancé. Lancement..."
  powershell.exe -Command "Start-Process 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'"
  echo "⏳ Attente du démarrage de Docker Desktop (20 secondes)..."
  sleep 20
else
  echo "✅ Docker Desktop est déjà lancé."
fi

echo "🛠 Activation de l'intégration WSL (à faire manuellement si nécessaire)"
echo "💡 Cette étape ne peut pas être automatisée complètement par script bash."

echo "🔄 Redémarrage de WSL..."
powershell.exe -Command "wsl --shutdown"
sleep 5

echo "🌐 Vérification de la connexion Docker dans WSL..."
export DOCKER_HOST=unix:///mnt/wsl/shared-docker/docker.sock

docker info > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Docker est accessible dans WSL."
else
  echo "❌ Docker n'est pas accessible. Vérifiez que Docker Desktop est bien lancé et que l'intégration WSL est activée."
fi
