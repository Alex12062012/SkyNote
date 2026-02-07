#!/bin/bash

echo "========================================"
echo "   REVIZ - Démarrage de l'application"
echo "========================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null
then
    echo "[ERREUR] Node.js n'est pas installé !"
    echo "Télécharge-le sur : https://nodejs.org"
    exit 1
fi

echo "[OK] Node.js détecté !"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances du backend..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installation des dépendances du frontend..."
    cd client
    npm install
    cd ..
fi

echo ""
echo "========================================"
echo "   Démarrage de REVIZ..."
echo "========================================"
echo ""
echo "Backend : http://localhost:3001"
echo "Frontend : http://localhost:3000"
echo ""
echo "Appuie sur Ctrl+C pour arrêter"
echo ""

# Démarrer le backend en arrière-plan
node server.js &
BACKEND_PID=$!

# Attendre 3 secondes
sleep 3

# Démarrer le frontend
cd client
npm start

# Arrêter le backend quand on quitte
kill $BACKEND_PID
