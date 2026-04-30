const { pool } = require('../config/database');

// =======================================
// CRÉER UNE QUESTION
// POST /api/questions
// =======================================
const creerQuestion = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id_sondage, texte_question, type, ordre, est_obligatoire, options } = req.body;

    if (!id_sondage || !texte_question || !type) {
      return res.status(400).json({
        success: false,
        message: 'id_sondage, texte_question et type sont obligatoires.'
      });
    }

    // 1. Insérer la question
    const [qResult] = await connection.execute(
      `INSERT INTO questions (texte_question, type, ordre, est_obligatoire, id_sondage)
       VALUES (?, ?, ?, ?, ?)`,
      [
        texte_question,
        type,
        ordre || 1,
        est_obligatoire !== undefined ? est_obligatoire : true,
        id_sondage
      ]
    );

    const id_question = qResult.insertId;

    // 2. Insérer les options (si choix_unique ou choix_multiple)
    if (type !== 'texte_libre' && Array.isArray(options) && options.length > 0) {
      for (let i = 0; i < options.length; i++) {
        await connection.execute(
          `INSERT INTO options (texte_option, ordre, id_question) VALUES (?, ?, ?)`,
          [options[i], i + 1, id_question]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Question ajoutée avec succès !',
      id_question
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erreur création question :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la question.'
    });
  } finally {
    connection.release();
  }
};

// =======================================
// MODIFIER UNE QUESTION
// PUT /api/questions/:id
// =======================================
const modifierQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { texte_question, type, ordre, est_obligatoire } = req.body;

    await pool.execute(
      `UPDATE questions SET texte_question = ?, type = ?, ordre = ?, est_obligatoire = ?
       WHERE id_question = ?`,
      [texte_question, type, ordre, est_obligatoire, id]
    );

    res.json({ success: true, message: 'Question modifiée.' });
  } catch (error) {
    console.error('Erreur modification question :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// =======================================
// SUPPRIMER UNE QUESTION
// DELETE /api/questions/:id
// =======================================
const supprimerQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM questions WHERE id_question = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Question introuvable.' });
    }

    res.status(200).json({ success: true, message: 'Question supprimée avec succès !' });

  } catch (error) {
    console.error('Erreur suppression question :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = { creerQuestion, modifierQuestion, supprimerQuestion };
