const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register → Inscription
router.post('/register', register);

// POST /api/auth/login → Connexion
router.post('/login', login);

// GET /api/auth/me → Mon profil (protégé)
router.get('/me', protect, getMe);

module.exports = router;

//dgxgdgxdgd

