const express = require('express');
const router = express.Router();
const { creerQuestion, modifierQuestion, supprimerQuestion } = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

// POST /api/questions → Créer une question (createur/admin)
router.post('/', protect, authorize('createur', 'admin'), creerQuestion);

// PUT /api/questions/:id → Modifier une question (createur/admin)
router.put('/:id', protect, authorize('createur', 'admin'), modifierQuestion);

// DELETE /api/questions/:id → Supprimer une question (createur/admin)
router.delete('/:id', protect, authorize('createur', 'admin'), supprimerQuestion);

module.exports = router;