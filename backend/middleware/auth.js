const { verifyToken } = require('../utils/jwt');
const { pool } = require('../config/database');

// Middleware — vérifier si l'utilisateur est connecté
const protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans le header
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Pas de token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Veuillez vous connecter.'
      });
    }

    // Vérifier le token
    const decoded = verifyToken(token);

    // Vérifier que l'utilisateur existe toujours
    const [rows] = await pool.execute(
      'SELECT id_utilisateur, nom, email, role FROM utilisateurs WHERE id_utilisateur = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = rows[0];
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré.'
    });
  }
};

// Middleware — vérifier le rôle
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis : ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };