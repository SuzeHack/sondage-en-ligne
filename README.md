# Projet Sondage en Ligne

Application de gestion de sondages avec un frontend React et un backend Express.

## 🔗 Liens de déploiement
- Frontend (Vercel) : https://sondage-en-ligne.vercel.app/
- Backend (Render) : https://sondage-en-ligne.onrender.com/

## 🧱 Architecture
- `frontend/` : application React (Create React App)
- `backend/` : API Express
- `backend/config/database.sql` : schéma SQL de la base de données

## 🚀 Description
Cette application permet de créer, gérer et répondre à des sondages.

- Inscription / connexion
- Création de sondages
- Gestion des questions et options
- Participation aux sondages
- Tableau de bord administrateur

## 🛠️ Installation locale
### Backend
```bash
cd backend
npm install
```
Créer un fichier `.env` avec les variables suivantes :
```env
DB_HOST=<host>
DB_PORT=<port>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<database>
DB_SSL=<true|false>
JWT_SECRET=<secret>
NODE_ENV=development
```
Puis lancer :
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📦 Déploiement
### Backend
Déployé sur Render avec :
- Commande de build : `npm install`
- Commande de démarrage : `npm start`
- Variables d'environnement pointant vers la base de données distante TiDB

### Frontend
Déployé sur Vercel depuis le dossier `frontend` avec :
- `Build Command` : `npm run build`
- `Output Directory` : `build`
- Variable d'environnement : `REACT_APP_API_BASE_URL=https://sondage-en-ligne.onrender.com/api`

## 📌 Notes
- Pour le développement local, utilises `frontend/.env.local` pour configurer `REACT_APP_API_BASE_URL` vers `http://localhost:5001/api`.
- Ne publie jamais les secrets (`DB_PASSWORD`, `JWT_SECRET`, etc.) sur GitHub.

## 📂 Structure du projet
- `backend/`
  - `server.js`
  - `config/`
  - `controllers/`
  - `routes/`
  - `models/`
  - `middleware/`
- `frontend/`
  - `src/`
  - `public/`
  - `package.json`

---

Merci d'utiliser ce projet !