const express = require('express');
const router = express.Router();
const { participer, getResultats } = require('../controllers/participationController');
const { protect } = require('../middleware/auth');


// La participation peut être anonyme, donc verifyToken est optionnel pour POST
// Mais on l'utilise pour attacher l'id_utilisateur s'il est connecté
router.post('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    protect(req, res, next);
  } else {
    next();
  }

}, participer);

router.get('/sondage/:id', getResultats);

module.exports = router;