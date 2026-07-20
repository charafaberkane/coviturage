-- ============================================
-- Base de données : Système de Covoiturage
-- ============================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS covoiturage_db;
USE covoiturage_db;

-- ============================================
-- Table : utilisateurs
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('PASSAGER', 'CONDUCTEUR', 'ADMIN') DEFAULT 'PASSAGER',
  telephone VARCHAR(20) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  avatar_url VARCHAR(500) DEFAULT NULL,
  note_moyenne DECIMAL(3,2) DEFAULT 0.00,
  nombre_trajets INT DEFAULT 0,
  est_actif BOOLEAN DEFAULT TRUE,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_est_actif (est_actif)
);

-- ============================================
-- Table : trajets
-- ============================================
CREATE TABLE IF NOT EXISTS trajets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conducteur_id INT NOT NULL,
  depart VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  date_heure DATETIME NOT NULL,
  places_totales INT NOT NULL,
  places_disponibles INT NOT NULL,
  prix DECIMAL(10,2) DEFAULT 0.00,
  description TEXT DEFAULT NULL,
  modele_voiture VARCHAR(100) DEFAULT NULL,
  statut ENUM('ACTIVE', 'CANCELLED', 'COMPLETED') DEFAULT 'ACTIVE',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (conducteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_conducteur (conducteur_id),
  INDEX idx_statut (statut),
  INDEX idx_date_heure (date_heure),
  INDEX idx_depart (depart),
  INDEX idx_destination (destination)
);

-- ============================================
-- Table : reservations
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trajet_id INT NOT NULL,
  passager_id INT NOT NULL,
  nombre_places INT NOT NULL DEFAULT 1,
  statut ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (trajet_id) REFERENCES trajets(id) ON DELETE CASCADE,
  FOREIGN KEY (passager_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_trajet (trajet_id),
  INDEX idx_passager (passager_id),
  INDEX idx_statut_reservation (statut)
);

-- ============================================
-- Table : notifications
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  titre VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('RESERVATION_REQUEST', 'RESERVATION_ACCEPTED', 'RESERVATION_REJECTED', 'TRIP_CANCELLED', 'SYSTEM') DEFAULT 'SYSTEM',
  lu BOOLEAN DEFAULT FALSE,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_utilisateur_notif (utilisateur_id),
  INDEX idx_lu (lu)
);

-- ============================================
-- Table : statistiques (cache pour les stats admin)
-- ============================================
CREATE TABLE IF NOT EXISTS statistiques (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cle VARCHAR(100) NOT NULL UNIQUE,
  valeur INT DEFAULT 0,
  date_mise_a_jour DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_cle (cle)
);

-- ============================================
-- Données initiales
-- ============================================

-- Compte admin par défaut (mot de passe: admin123 — hashé avec bcrypt)
-- Le hash sera inséré par le seed script, pas ici
-- INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES ('Admin', 'admin@covoiturage.com', '$HASH', 'ADMIN');

-- Stats initiales
INSERT INTO statistiques (cle, valeur) VALUES
  ('total_utilisateurs', 0),
  ('total_trajets', 0),
  ('total_reservations', 0),
  ('utilisateurs_actifs', 0)
ON DUPLICATE KEY UPDATE valeur = valeur;
