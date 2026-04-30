const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

const app = express();

// ===== MIDDLEWARES GLOBAUX =====
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
const authRoutes = require('./routes/authRoutes');
const sondageRoutes = require('./routes/sondageRoutes');
const questionRoutes = require('./routes/questionRoutes');
const participationRoutes = require('./routes/participationRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sondages', sondageRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/participations', participationRoutes);
app.use('/api/users', userRoutes);

// ===== ROUTE DE TEST =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Sondage en ligne — Serveur opérationnel',
    version: '1.0.0',
    routes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/me',
      'GET  /api/sondages',
      'POST /api/sondages',
      'GET  /api/sondages/:id',
      'PUT  /api/sondages/:id',
      'DELETE /api/sondages/:id',
      'PUT  /api/sondages/:id/publier',
      'POST /api/questions',
      'PUT  /api/questions/:id',
      'DELETE /api/questions/:id',
      'POST /api/participations',
      'GET  /api/participations/sondage/:id'
    ]
  });
});

// ===== GESTION DES ROUTES INEXISTANTES =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} introuvable`
  });
});

// ===== GESTION GLOBALE DES ERREURS =====
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ===== DÉMARRAGE DU SERVEUR =====
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 URL : http://localhost:${PORT}`);
  });
};

startServer();