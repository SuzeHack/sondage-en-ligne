const express = require('express');
const router = express.Router();
const {
  creerSondage,
  getSondages,
  getSondage,
  modifierSondage,
  supprimerSondage,
  publierSondage
} = require('../controllers/sondageController');
const { protect, authorize } = require('../middleware/auth');

// GET /api/sondages → Liste des sondages (public)
router.get('/', protect, getSondages);

// POST /api/sondages → Créer un sondage (createur/admin)
router.post('/', protect, authorize('createur', 'admin'), creerSondage);

// GET /api/sondages/:id → Voir un sondage
router.get('/:id', protect, getSondage);

// PUT /api/sondages/:id → Modifier un sondage
router.put('/:id', protect, authorize('createur', 'admin'), modifierSondage);

// DELETE /api/sondages/:id → Supprimer un sondage
router.delete('/:id', protect, authorize('createur', 'admin'), supprimerSondage);

// PUT /api/sondages/:id/publier → Publier un sondage
router.put('/:id/publier', protect, authorize('createur', 'admin'), publierSondage);

module.exports = router;