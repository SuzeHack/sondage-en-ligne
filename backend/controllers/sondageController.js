const { pool } = require('../config/database');

// =======================================
// CRÉER UN SONDAGE
// POST /api/sondages
// =======================================
const creerSondage = async (req, res) => {
  try {
    const { titre, description, date_fin } = req.body;

    if (!titre) {
      return res.status(400).json({
        success: false,
        message: 'Le titre est obligatoire.'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO sondages 
       (titre, description, statut, date_fin, id_utilisateur) 
       VALUES (?, ?, 'brouillon', ?, ?)`,
      [titre, description || null, date_fin || null, req.user.id_utilisateur]
    );

    const [sondage] = await pool.execute(
      'SELECT * FROM sondages WHERE id_sondage = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Sondage créé avec succès !',
      sondage: sondage[0]
    });

  } catch (error) {
    console.error('Erreur création sondage :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du sondage.'
    });
  }
};

// =======================================
// LISTE DES SONDAGES
// GET /api/sondages
// =======================================
const getSondages = async (req, res) => {
  try {
    // Admin voit tout, les autres voient seulement les publiés
    let query;
    let params = [];

    if (req.user && req.user.role === 'admin') {
      query = `
        SELECT s.*, u.nom as nom_createur 
        FROM sondages s
        JOIN utilisateurs u ON s.id_utilisateur = u.id_utilisateur
        ORDER BY s.date_creation DESC
      `;
    } else if (req.user && req.user.role === 'createur') {
      query = `
        SELECT s.*, u.nom as nom_createur 
        FROM sondages s
        JOIN utilisateurs u ON s.id_utilisateur = u.id_utilisateur
        WHERE s.id_utilisateur = ? OR s.statut = 'publie'
        ORDER BY s.date_creation DESC
      `;
      params = [req.user.id_utilisateur];
    } else {
      query = `
        SELECT s.*, u.nom as nom_createur 
        FROM sondages s
        JOIN utilisateurs u ON s.id_utilisateur = u.id_utilisateur
        WHERE s.statut = 'publie'
        ORDER BY s.date_creation DESC
      `;
    }

    const [sondages] = await pool.execute(query, params);

    res.status(200).json({
      success: true,
      count: sondages.length,
      sondages
    });

  } catch (error) {
    console.error('Erreur liste sondages :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// =======================================
// VOIR UN SONDAGE
// GET /api/sondages/:id
// =======================================
const getSondage = async (req, res) => {
  try {
    const { id } = req.params;

    const [sondages] = await pool.execute(
      `SELECT s.*, u.nom as nom_createur 
       FROM sondages s
       JOIN utilisateurs u ON s.id_utilisateur = u.id_utilisateur
       WHERE s.id_sondage = ?`,
      [id]
    );

    if (sondages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sondage introuvable.'
      });
    }

    const sondage = sondages[0];

    // Récupérer les questions avec leurs options
    const [questions] = await pool.execute(
      'SELECT * FROM questions WHERE id_sondage = ? ORDER BY ordre',
      [id]
    );

    for (let question of questions) {
      const [options] = await pool.execute(
        'SELECT * FROM options WHERE id_question = ? ORDER BY ordre',
        [question.id_question]
      );
      question.options = options;
    }

    sondage.questions = questions;

    res.status(200).json({
      success: true,
      sondage
    });

  } catch (error) {
    console.error('Erreur récupération sondage :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// =======================================
// MODIFIER UN SONDAGE
// PUT /api/sondages/:id
// =======================================
const modifierSondage = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, date_fin } = req.body;

    // Vérifier que le sondage existe
    const [sondages] = await pool.execute(
      'SELECT * FROM sondages WHERE id_sondage = ?',
      [id]
    );

    if (sondages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sondage introuvable.'
      });
    }

    const sondage = sondages[0];

    // Vérifier que c'est le créateur ou admin
    if (sondage.id_utilisateur !== req.user.id_utilisateur && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier ce sondage.'
      });
    }

    // Ne pas modifier un sondage publié
    if (sondage.statut === 'publie') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier un sondage déjà publié.'
      });
    }

    await pool.execute(
      `UPDATE sondages 
       SET titre = ?, description = ?, date_fin = ?
       WHERE id_sondage = ?`,
      [
        titre || sondage.titre,
        description || sondage.description,
        date_fin || sondage.date_fin,
        id
      ]
    );

    const [updated] = await pool.execute(
      'SELECT * FROM sondages WHERE id_sondage = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Sondage modifié avec succès !',
      sondage: updated[0]
    });

  } catch (error) {
    console.error('Erreur modification sondage :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// =======================================
// SUPPRIMER UN SONDAGE
// DELETE /api/sondages/:id
// =======================================
const supprimerSondage = async (req, res) => {
  try {
    const { id } = req.params;

    const [sondages] = await pool.execute(
      'SELECT * FROM sondages WHERE id_sondage = ?',
      [id]
    );

    if (sondages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sondage introuvable.'
      });
    }

    const sondage = sondages[0];

    // Vérifier que c'est le créateur ou admin
    if (sondage.id_utilisateur !== req.user.id_utilisateur && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce sondage.'
      });
    }

    await pool.execute(
      'DELETE FROM sondages WHERE id_sondage = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Sondage supprimé avec succès !'
    });

  } catch (error) {
    console.error('Erreur suppression sondage :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// =======================================
// PUBLIER UN SONDAGE
// PUT /api/sondages/:id/publier
// =======================================
const publierSondage = async (req, res) => {
  try {
    const { id } = req.params;

    const [sondages] = await pool.execute(
      'SELECT * FROM sondages WHERE id_sondage = ?',
      [id]
    );

    if (sondages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sondage introuvable.'
      });
    }

    const sondage = sondages[0];

    // Vérifier que c'est le créateur ou admin
    if (sondage.id_utilisateur !== req.user.id_utilisateur && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à publier ce sondage.'
      });
    }

    // Vérifier qu'il y a au moins une question
    const [questions] = await pool.execute(
      'SELECT id_question FROM questions WHERE id_sondage = ?',
      [id]
    );

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de publier un sondage sans questions.'
      });
    }

    await pool.execute(
      `UPDATE sondages 
       SET statut = 'publie', date_publication = CURRENT_TIMESTAMP
       WHERE id_sondage = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Sondage publié avec succès !'
    });

  } catch (error) {
    console.error('Erreur publication sondage :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

module.exports = {
  creerSondage,
  getSondages,
  getSondage,
  modifierSondage,
  supprimerSondage,
  publierSondage
};