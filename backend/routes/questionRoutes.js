const express = require('express');
const router = express.Router();

// Routes questions - à compléter à l'étape suivante
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Routes questions OK' });
});

module.exports = router;