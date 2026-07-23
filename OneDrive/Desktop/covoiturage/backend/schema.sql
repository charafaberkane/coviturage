-- Étape 2 : Création de la base de données et des tables

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS covoiturage;
USE covoiturage;

-- 1. Table utilisateurs


-- 2. Table trajets
CREATE TABLE IF NOT EXISTS trajets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conducteur_id INT NOT NULL,
  depart VARCHAR(150) NOT NULL,
  arrivee VARCHAR(150) NOT NULL,
  date DATE NOT NULL,
  heure TIME NOT NULL,
  places_totales INT NOT NULL,
  places_restantes INT NOT NULL,
  statut VARCHAR(50) DEFAULT 'DISPONIBLE',
  FOREIGN KEY (conducteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- 3. Table reservations
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trajet_id INT NOT NULL,
  passager_id INT NOT NULL,
  statut ENUM('DEMANDEE', 'ACCEPIEE', 'REFUSEE') DEFAULT 'DEMANDEE',
  date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trajet_id) REFERENCES trajets(id) ON DELETE CASCADE,
  FOREIGN KEY (passager_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- 4. Table notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- 5. Table statistiques
CREATE TABLE IF NOT EXISTS statistiques (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cle VARCHAR(100) NOT NULL UNIQUE,
  valeur VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);
