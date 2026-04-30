const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../utils/jwt');

// =======================================
// INSCRIPTION
// POST /api/auth/register
// =======================================
const register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;

    // Vérifier que tous les champs sont présents
    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et mot de passe sont obligatoires.'
      });
    }

    // Vérifier si l'email existe déjà
    const [existing] = await pool.execute(
      'SELECT id_utilisateur FROM utilisateurs WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé.'
      });
    }

    // Chiffrer le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Définir le rôle
    const userRole = role && ['admin', 'createur', 'repondant'].includes(role) 
      ? role 
      : 'repondant';

    // Insérer l'utilisateur
    const [result] = await pool.execute(
      'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
      [nom, email, hashedPassword, userRole]
    );

    // Générer le token
    const token = generateToken({
      id: result.insertId,
      email: email,
      role: userRole
    });

    res.status(201).json({
      success: true,
      message: 'Inscription réussie !',
      token,
      user: {
        id: result.insertId,
        nom,
        email,
        role: userRole
      }
    });

  } catch (error) {
    console.error('Erreur inscription :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription.'
    });
  }
};

// =======================================
// CONNEXION
// POST /api/auth/login
// =======================================
const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Vérifier que les champs sont présents
    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont obligatoires.'
      });
    }

    // Chercher l'utilisateur
    const [rows] = await pool.execute(
      'SELECT * FROM utilisateurs WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }

    const user = rows[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }

    // Générer le token
    const token = generateToken({
      id: user.id_utilisateur,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id_utilisateur,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur connexion :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion.'
    });
  }
};

// =======================================
// MON PROFIL
// GET /api/auth/me
// =======================================
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Erreur profil :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

module.exports = { register, login, getMe };