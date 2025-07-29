# Mon Cloud Personnel Sécurisé

Un système de stockage cloud personnel avec interface web moderne, sécurisé et facile à utiliser.

## 🚀 Fonctionnalités

- **Interface web moderne** : Design responsive avec Tailwind CSS
- **Authentification sécurisée** : Système de connexion avec JWT
- **Upload de fichiers** : Glisser-déposer avec prévisualisation
- **Gestion des dossiers** : Organisation hiérarchique des fichiers
- **Sécurité** : Chiffrement des données et protection CORS
- **Multi-formats** : Support d'images, documents, vidéos, audio, archives
- **Responsive** : Compatible desktop, tablette et mobile

## 🛠️ Technologies utilisées

### Backend
- Node.js + Express + TypeScript
- SQLite pour la base de données
- JWT pour l'authentification
- Multer pour l'upload de fichiers
- Bcrypt pour le hashage des mots de passe
- Helmet pour la sécurité

### Frontend
- React + TypeScript
- Vite pour le build
- Tailwind CSS pour le design
- React Router pour la navigation
- Axios pour les requêtes API
- React Dropzone pour l'upload
- Lucide React pour les icônes

## 📦 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation complète
```bash
# Cloner le repository
git clone <votre-repo>
cd mon-cloud-personnel-securis

# Installer toutes les dépendances
npm run install:all

# Configurer l'environnement serveur
cd server
cp .env.example .env
# Éditez le fichier .env avec vos configurations

cd ..
```

### Démarrage en mode développement
```bash
# Démarrer le serveur ET le client simultanément
npm run dev

# OU démarrer séparément :
# Serveur (port 3001)
npm run dev:server

# Client (port 3000)
npm run dev:client
```

### Build de production
```bash
npm run build
npm start
```

## 🔧 Configuration

### Variables d'environnement serveur (.env)
```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=votre-cle-secrete-tres-longue-et-complexe
ENCRYPTION_KEY=votre-cle-de-chiffrement
DB_PATH=./data/cloud.db
STORAGE_PATH=./storage
MAX_FILE_SIZE=104857600
```

### Variables d'environnement client (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📁 Structure du projet

```
mon-cloud-personnel-securis/
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── database/       # Configuration SQLite
│   │   ├── middleware/     # Middlewares Express
│   │   ├── routes/         # Routes API
│   │   └── server.ts       # Serveur principal
│   ├── storage/            # Stockage des fichiers
│   └── data/               # Base de données SQLite
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── contexts/       # Contextes React
│   │   ├── services/       # Services API
│   │   └── types/          # Types TypeScript
│   └── public/
└── package.json            # Scripts globaux
```

## 🔐 Sécurité

- Authentification JWT avec expiration
- Hashage des mots de passe avec bcrypt
- Protection CORS configurée
- Rate limiting pour éviter le spam
- Validation des inputs
- Headers de sécurité avec Helmet
- Chiffrement des fichiers (configurable)

## 🎯 Utilisation

1. **Créer un compte** : Utilisez l'interface d'inscription
2. **Se connecter** : Entrez vos identifiants
3. **Uploader des fichiers** : Glissez-déposez ou cliquez pour sélectionner
4. **Organiser** : Créez des dossiers pour organiser vos fichiers
5. **Télécharger** : Cliquez sur l'icône de téléchargement
6. **Naviguer** : Utilisez la sidebar pour naviguer entre dossiers

## 📱 Formats supportés

- **Images** : PNG, JPG, JPEG, GIF
- **Documents** : PDF, DOC, DOCX, TXT
- **Vidéos** : MP4, AVI, MOV
- **Audio** : MP3, WAV, OGG
- **Archives** : ZIP

## 🚀 Déploiement

### Docker (recommandé)
```bash
# À venir - Configuration Docker
```

### Serveur traditionnel
1. Build du projet : `npm run build`
2. Configurer les variables d'environnement
3. Démarrer : `npm start`
4. Configurer un reverse proxy (nginx/apache)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🐛 Problèmes connus

- Limite d'upload à 100MB par fichier
- Pas de prévisualisation des fichiers (à venir)
- Pas de partage de fichiers (à venir)

## 🔮 Roadmap

- [ ] Prévisualisation des images et documents
- [ ] Partage de fichiers par lien
- [ ] Synchronisation desktop
- [ ] Sauvegarde automatique
- [ ] Interface d'administration
- [ ] Support multi-utilisateurs avancé
- [ ] API mobile

---

Made with ❤️ by Guillaume
