const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

// GET /api/users/statistiques → Statistiques globales (Admin)
router.get('/statistiques', protect, authorize('admin'), async (req, res) => {
  try {
    const [uCount] = await pool.execute('SELECT COUNT(*) as total FROM utilisateurs');
    const [sCount] = await pool.execute('SELECT COUNT(*) as total FROM sondages');
    const [pCount] = await pool.execute('SELECT COUNT(*) as total FROM participations');
    const [pubCount] = await pool.execute('SELECT COUNT(*) as total FROM sondages WHERE statut = "publie"');

    const [roleStats] = await pool.execute('SELECT role, COUNT(*) as count FROM utilisateurs GROUP BY role');

    res.json({
      success: true,
      statistiques: {
        total_utilisateurs: uCount[0].total,
        total_sondages: sCount[0].total,
        total_participations: pCount[0].total,
        sondages_publies: pubCount[0].total,
        utilisateurs_par_role: roleStats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/users → Liste des utilisateurs (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id_utilisateur, nom, email, role, date_inscription FROM utilisateurs ORDER BY date_inscription DESC');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PUT /api/users/:id/role → Changer le rôle
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    await pool.execute('UPDATE utilisateurs SET role = ? WHERE id_utilisateur = ?', [role, req.params.id]);
    res.json({ success: true, message: 'Rôle mis à jour.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/users/:id → Supprimer
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.execute('DELETE FROM utilisateurs WHERE id_utilisateur = ?', [req.params.id]);
    res.json({ success: true, message: 'Utilisateur supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
