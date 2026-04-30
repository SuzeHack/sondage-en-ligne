const { pool } = require('../config/database');

// =======================================
// PARTICIPER À UN SONDAGE
// POST /api/participations
// =======================================
const participer = async (req, res) => {
  let connection;
  try {
    const { id_sondage, nom_repondant, reponses } = req.body;
    const id_utilisateur = req.user ? req.user.id_utilisateur : null;

    if (!id_sondage || !reponses || !Array.isArray(reponses)) {
      return res.status(400).json({
        success: false,
        message: 'Données de participation invalides.'
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Créer la participation
    const [partResult] = await connection.execute(
      `INSERT INTO participations (id_sondage, nom_repondant, id_utilisateur, statut) 
       VALUES (?, ?, ?, 'complete')`,
      [id_sondage, nom_repondant || null, id_utilisateur]
    );

    const id_participation = partResult.insertId;

    // 2. Enregistrer les réponses
    for (const rep of reponses) {
      const { id_question, texte_reponse, id_options } = rep;

      // Créer la réponse de base
      const [repResult] = await connection.execute(
        `INSERT INTO reponses (id_participation, id_question, texte_reponse) 
         VALUES (?, ?, ?)`,
        [id_participation, id_question, texte_reponse || null]
      );

      const id_reponse = repResult.insertId;

      // Si c'est un choix (unique ou multiple), enregistrer les options
      if (id_options && Array.isArray(id_options)) {
        for (const id_option of id_options) {
          await connection.execute(
            `INSERT INTO reponse_options (id_reponse, id_option) 
             VALUES (?, ?)`,
            [id_reponse, id_option]
          );
        }
      }
    }

    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Votre participation a été enregistrée avec succès !',
      id_participation
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Erreur participation :', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà participé à ce sondage.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement de votre participation.'
    });
  } finally {
    if (connection) connection.release();
  }
};

// =======================================
// OBTENIR LES RÉSULTATS D'UN SONDAGE
// GET /api/participations/sondage/:id
// =======================================
const getResultats = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Récupérer les questions
    const [questions] = await pool.execute(
      'SELECT * FROM questions WHERE id_sondage = ? ORDER BY ordre',
      [id]
    );

    const resultats = [];

    for (let question of questions) {
      const qResult = {
        id_question: question.id_question,
        texte_question: question.texte_question,
        type: question.type,
        total_reponses: 0,
        donnees: []
      };

      if (question.type === 'texte_libre') {
        const [reponses] = await pool.execute(
          `SELECT r.texte_reponse, p.nom_repondant, p.date_soumission 
           FROM reponses r
           JOIN participations p ON r.id_participation = p.id_participation
           WHERE r.id_question = ? AND r.texte_reponse IS NOT NULL`,
          [question.id_question]
        );
        qResult.donnees = reponses;
        qResult.total_reponses = reponses.length;
      } else {
        // Choix unique ou multiple
        const [options] = await pool.execute(
          `SELECT o.*, COUNT(ro.id_option) as nb_votes
           FROM options o
           LEFT JOIN reponse_options ro ON o.id_option = ro.id_option
           WHERE o.id_question = ?
           GROUP BY o.id_option
           ORDER BY o.ordre`,
          [question.id_question]
        );
        
        qResult.donnees = options;
        const total = options.reduce((acc, opt) => acc + parseInt(opt.nb_votes), 0);
        qResult.total_reponses = total;
      }

      resultats.push(qResult);
    }

    res.status(200).json({
      success: true,
      resultats
    });

  } catch (error) {
    console.error('Erreur résultats :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

module.exports = {
  participer,
  getResultats
};
