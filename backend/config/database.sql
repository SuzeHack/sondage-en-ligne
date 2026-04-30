-- ================================================
-- BASE DE DONNÉES : sondage_db
-- ================================================

USE sondage_db;

-- ================================================
-- TABLE 1 : UTILISATEUR
-- ================================================
CREATE TABLE IF NOT EXISTS utilisateurs (
  id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('admin', 'createur', 'repondant') NOT NULL DEFAULT 'repondant',
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLE 2 : SONDAGE
-- ================================================
CREATE TABLE IF NOT EXISTS sondages (
  id_sondage INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  statut ENUM('brouillon', 'publie', 'ferme') NOT NULL DEFAULT 'brouillon',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_publication DATETIME DEFAULT NULL,
  date_fin DATETIME DEFAULT NULL,
  id_utilisateur INT NOT NULL,
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE
);

-- ================================================
-- TABLE 3 : QUESTION
-- ================================================
CREATE TABLE IF NOT EXISTS questions (
  id_question INT AUTO_INCREMENT PRIMARY KEY,
  texte_question TEXT NOT NULL,
  type ENUM('choix_unique', 'choix_multiple', 'texte_libre') NOT NULL,
  ordre INT NOT NULL DEFAULT 1,
  est_obligatoire BOOLEAN NOT NULL DEFAULT TRUE,
  id_sondage INT NOT NULL,
  FOREIGN KEY (id_sondage) REFERENCES sondages(id_sondage) ON DELETE CASCADE
);

-- ================================================
-- TABLE 4 : OPTION
-- ================================================
CREATE TABLE IF NOT EXISTS options (
  id_option INT AUTO_INCREMENT PRIMARY KEY,
  texte_option VARCHAR(255) NOT NULL,
  ordre INT NOT NULL DEFAULT 1,
  id_question INT NOT NULL,
  FOREIGN KEY (id_question) REFERENCES questions(id_question) ON DELETE CASCADE
);

-- ================================================
-- TABLE 5 : PARTICIPATION
-- ================================================
CREATE TABLE IF NOT EXISTS participations (
  id_participation INT AUTO_INCREMENT PRIMARY KEY,
  date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut ENUM('en_cours', 'complete') NOT NULL DEFAULT 'en_cours',
  nom_repondant VARCHAR(100) DEFAULT NULL,
  id_utilisateur INT DEFAULT NULL,
  id_sondage INT NOT NULL,
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur) ON DELETE SET NULL,
  FOREIGN KEY (id_sondage) REFERENCES sondages(id_sondage) ON DELETE CASCADE,
  UNIQUE KEY unique_participation (id_utilisateur, id_sondage)
);

-- ================================================
-- TABLE 6 : REPONSE
-- ================================================
CREATE TABLE IF NOT EXISTS reponses (
  id_reponse INT AUTO_INCREMENT PRIMARY KEY,
  texte_reponse TEXT DEFAULT NULL,
  id_participation INT NOT NULL,
  id_question INT NOT NULL,
  FOREIGN KEY (id_participation) REFERENCES participations(id_participation) ON DELETE CASCADE,
  FOREIGN KEY (id_question) REFERENCES questions(id_question) ON DELETE CASCADE
);

-- ================================================
-- TABLE 7 : REPONSE_OPTION
-- ================================================
CREATE TABLE IF NOT EXISTS reponse_options (
  id_reponse INT NOT NULL,
  id_option INT NOT NULL,
  PRIMARY KEY (id_reponse, id_option),
  FOREIGN KEY (id_reponse) REFERENCES reponses(id_reponse) ON DELETE CASCADE,
  FOREIGN KEY (id_option) REFERENCES options(id_option) ON DELETE CASCADE
);

-- ================================================
-- VÉRIFICATION
-- ================================================
SHOW TABLES;