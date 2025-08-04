#!/bin/bash

echo "🚀 Déploiement Full-Stack Anki2Quizlet"
echo "======================================"

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé"
    echo "📦 Installation de Railway CLI..."
    npm install -g @railway/cli
fi

# Se connecter à Railway
echo "🔑 Connexion à Railway..."
railway login

# Déployer le backend
echo "🛠️ Déploiement du backend sur Railway..."
railway deploy

# Obtenir l'URL du déploiement
echo "🌐 Récupération de l'URL du backend..."
BACKEND_URL=$(railway domain)

if [ -n "$BACKEND_URL" ]; then
    echo "✅ Backend déployé sur: $BACKEND_URL"
    
    # Mettre à jour la configuration API
    echo "⚙️ Mise à jour de la configuration API..."
    sed -i.bak "s|baseURL: process.env.VITE_API_URL.*|baseURL: 'https://$BACKEND_URL',|g" src/config/api.js
    
    # Build et déployer le frontend
    echo "🎨 Build et déploiement du frontend..."
    npm run build
    npm run deploy
    
    echo "🎉 Déploiement terminé !"
    echo "📱 Frontend: https://$(git config user.name).github.io/Anki2Quizlet/"
    echo "🔧 Backend: https://$BACKEND_URL"
    
    # Restaurer le fichier de configuration
    mv src/config/api.js.bak src/config/api.js
else
    echo "❌ Impossible de récupérer l'URL du backend"
    exit 1
fi
