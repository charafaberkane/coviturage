// Étape 8 : Gestion des Réservations
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // Connexion MySQL

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route simple de vérification (Health check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Le serveur de covoiturage fonctionne correctement.'
  });
});

// --- ROUTE : INSCRIPTION ---
app.post('/api/auth/register', async (req, res) => {
  const { nom, courriel, motdepasse, role } = req.body;

  if (!nom || !courriel || !motdepasse || !role) {
    return res.status(400).json({
      status: 'erreur',
      message: 'Tous les champs (nom, courriel, motdepasse, role) sont obligatoires.'
    });
  }

  // Vérifier que le rôle est uniquement PASSAGER ou CONDUCTEUR
  if (role !== 'PASSAGER' && role !== 'CONDUCTEUR') {
    return res.status(400).json({
      status: 'erreur',
      message: 'Le rôle doit être PASSAGER ou CONDUCTEUR.'
    });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT id FROM utilisateurs WHERE courriel = ?',
      [courriel]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'erreur',
        message: 'Ce courriel est déjà associé à un compte.'
      });
    }

    const [result] = await db.query(
      'INSERT INTO utilisateurs (nom, courriel, motdepasse, role, statut) VALUES (?, ?, ?, ?, ?)',
      [nom, courriel, motdepasse, role, 'ACTIF']
    );

    res.status(201).json({
      status: 'ok',
      message: 'Inscription réussie !',
      data: {
        id: result.insertId,
        nom: nom,
        courriel: courriel,
        role: role,
        statut: 'ACTIF'
      }
    });

  } catch (error) {
    console.error('Erreur inscription :', error);
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : CONNEXION SIMPLE ---
app.post('/api/auth/login', async (req, res) => {
  const { courriel, motdepasse } = req.body;

  if (!courriel || !motdepasse) {
    return res.status(400).json({
      status: 'erreur',
      message: 'Le courriel et le mot de passe sont obligatoires.'
    });
  }

  try {
    const [users] = await db.query(
      'SELECT * FROM utilisateurs WHERE courriel = ?',
      [courriel]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 'erreur',
        message: 'Identifiants incorrects.'
      });
    }

    const user = users[0];

    if (user.motdepasse !== motdepasse) {
      return res.status(401).json({
        status: 'erreur',
        message: 'Identifiants incorrects.'
      });
    }

    if (user.statut !== 'ACTIF') {
      return res.status(403).json({
        status: 'erreur',
        message: 'Votre compte est inactif.'
      });
    }

    res.json({
      status: 'ok',
      message: 'Connexion réussie !',
      data: {
        id: user.id,
        nom: user.nom,
        courriel: user.courriel,
        role: user.role,
        statut: user.statut
      }
    });

  } catch (error) {
    console.error('Erreur connexion :', error);
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : VOIR LE PROFIL ---
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await db.query(
      'SELECT id, nom, courriel, role, statut FROM utilisateurs WHERE id = ?',
      [id]
    );
    if (users.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Utilisateur introuvable.' });
    }
    res.json({ status: 'ok', data: users[0] });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : MODIFIER LE PROFIL ---
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, courriel } = req.body;

  if (!nom || !courriel) {
    return res.status(400).json({ status: 'erreur', message: 'Le nom et le courriel sont obligatoires.' });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT id FROM utilisateurs WHERE courriel = ? AND id != ?',
      [courriel, id]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ status: 'erreur', message: 'Ce courriel est déjà utilisé.' });
    }

    await db.query('UPDATE utilisateurs SET nom = ?, courriel = ? WHERE id = ?', [nom, courriel, id]);

    const [updatedUsers] = await db.query(
      'SELECT id, nom, courriel, role, statut FROM utilisateurs WHERE id = ?',
      [id]
    );
    res.json({ status: 'ok', message: 'Profil mis à jour !', data: updatedUsers[0] });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : CRÉER UN TRAJET ---
app.post('/api/trips', async (req, res) => {
  const { conducteur_id, depart, arrivee, date, heure, places_totales } = req.body;

  if (!conducteur_id || !depart || !arrivee || !date || !heure || !places_totales) {
    return res.status(400).json({ status: 'erreur', message: 'Tous les champs sont obligatoires.' });
  }

  const places = parseInt(places_totales);
  if (places <= 0) {
    return res.status(400).json({ status: 'erreur', message: 'Places totales doit être supérieur à zéro.' });
  }

  try {
    // Vérification du rôle de l'utilisateur
    const [users] = await db.query('SELECT role FROM utilisateurs WHERE id = ?', [conducteur_id]);
    if (users.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Utilisateur introuvable.' });
    }

    if (users[0].role !== 'CONDUCTEUR') {
      return res.status(403).json({ status: 'erreur', message: 'Seuls les conducteurs peuvent créer un trajet' });
    }

    const [result] = await db.query(
      'INSERT INTO trajets (conducteur_id, depart, arrivee, date, heure, places_totales, places_restantes, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [conducteur_id, depart, arrivee, date, heure, places, places, 'DISPONIBLE']
    );
    res.status(201).json({ status: 'ok', message: 'Trajet créé !', tripId: result.insertId });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : RECHERCHER LES TRAJETS ---
app.get('/api/trips', async (req, res) => {
  const { depart, arrivee, date } = req.query;
  let query = `
    SELECT t.*, u.nom AS conducteur_nom 
    FROM trajets t
    JOIN utilisateurs u ON t.conducteur_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (depart) {
    query += ' AND t.depart LIKE ?';
    params.push(`%${depart}%`);
  }
  if (arrivee) {
    query += ' AND t.arrivee LIKE ?';
    params.push(`%${arrivee}%`);
  }
  if (date) {
    query += ' AND t.date = ?';
    params.push(date);
  }

  query += ' ORDER BY t.date ASC, t.heure ASC';

  try {
    const [trips] = await db.query(query, params);
    res.json({ status: 'ok', data: trips });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : DÉTAIL D'UN TRAJET ---
app.get('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [trips] = await db.query(
      `SELECT t.*, u.nom AS conducteur_nom, u.courriel AS conducteur_courriel 
       FROM trajets t
       JOIN utilisateurs u ON t.conducteur_id = u.id
       WHERE t.id = ?`,
      [id]
    );
    if (trips.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Trajet introuvable.' });
    }
    res.json({ status: 'ok', data: trips[0] });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : MODIFIER UN TRAJET ---
app.put('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  const { conducteur_id, depart, arrivee, date, heure, places_totales } = req.body;

  try {
    const [existingTrip] = await db.query('SELECT * FROM trajets WHERE id = ?', [id]);
    if (existingTrip.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Trajet introuvable.' });
    }
    if (existingTrip[0].conducteur_id !== parseInt(conducteur_id)) {
      return res.status(403).json({ status: 'erreur', message: 'Non autorisé.' });
    }

    const places = parseInt(places_totales);
    const placesPrises = existingTrip[0].places_totales - existingTrip[0].places_restantes;
    const nouvellesPlacesRestantes = places - placesPrises;

    await db.query(
      'UPDATE trajets SET depart = ?, arrivee = ?, date = ?, heure = ?, places_totales = ?, places_restantes = ? WHERE id = ?',
      [depart, arrivee, date, heure, places, nouvellesPlacesRestantes < 0 ? 0 : nouvellesPlacesRestantes, id]
    );
    res.json({ status: 'ok', message: 'Trajet mis à jour !' });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : SUPPRIMER UN TRAJET ---
app.delete('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  const { conducteur_id } = req.body;

  try {
    const [existingTrip] = await db.query('SELECT * FROM trajets WHERE id = ?', [id]);
    if (existingTrip.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Trajet introuvable.' });
    }
    if (existingTrip[0].conducteur_id !== parseInt(conducteur_id)) {
      return res.status(403).json({ status: 'erreur', message: 'Non autorisé.' });
    }

    await db.query('DELETE FROM trajets WHERE id = ?', [id]);
    res.json({ status: 'ok', message: 'Trajet annulé !' });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- NOUVELLE ROUTE : DEMANDER UNE RÉSERVATION (POST /api/reservations) ---
app.post('/api/reservations', async (req, res) => {
  const { trajet_id, passager_id } = req.body;

  if (!trajet_id || !passager_id) {
    return res.status(400).json({
      status: 'erreur',
      message: 'Les IDs de trajet et de passager sont obligatoires.'
    });
  }

  try {
    // 1. Récupérer les informations du trajet
    const [trips] = await db.query('SELECT * FROM trajets WHERE id = ?', [trajet_id]);
    if (trips.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Trajet introuvable.' });
    }

    const trip = trips[0];

    // 2. Un passager ne peut pas réserver son propre trajet
    if (trip.conducteur_id === parseInt(passager_id)) {
      return res.status(400).json({
        status: 'erreur',
        message: 'Vous ne pouvez pas réserver votre propre trajet.'
      });
    }

    // 3. Un passager ne peut pas réserver deux fois le même trajet
    const [existing] = await db.query(
      'SELECT id FROM reservations WHERE trajet_id = ? AND passager_id = ?',
      [trajet_id, passager_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        status: 'erreur',
        message: 'Vous avez déjà fait une demande de réservation pour ce trajet.'
      });
    }

    // 4. Créer la réservation avec le statut 'DEMANDEE'
    await db.query(
      'INSERT INTO reservations (trajet_id, passager_id, statut) VALUES (?, ?, ?)',
      [trajet_id, passager_id, 'DEMANDEE']
    );

    res.status(201).json({
      status: 'ok',
      message: 'Demande de réservation envoyée !'
    });

  } catch (error) {
    console.error('Erreur réservation :', error);
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- NOUVELLE ROUTE : VOIR LES RÉSERVATIONS EFFECTUÉES PAR UN PASSAGER ---
app.get('/api/reservations/passenger/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [reservations] = await db.query(
      `SELECT r.id, r.statut, r.date_reservation, 
              t.depart, t.arrivee, t.date, t.heure, 
              u.nom AS conducteur_nom
       FROM reservations r
       JOIN trajets t ON r.trajet_id = t.id
       JOIN utilisateurs u ON t.conducteur_id = u.id
       WHERE r.passager_id = ?
       ORDER BY r.date_reservation DESC`,
      [id]
    );

    res.json({ status: 'ok', data: reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- NOUVELLE ROUTE : VOIR LES DEMANDES REÇUES PAR UN CONDUCTEUR ---
app.get('/api/reservations/driver/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [demands] = await db.query(
      `SELECT r.id, r.statut, r.date_reservation, 
              t.depart, t.arrivee, t.date, t.heure, 
              u.nom AS passager_nom
       FROM reservations r
       JOIN trajets t ON r.trajet_id = t.id
       JOIN utilisateurs u ON r.passager_id = u.id
       WHERE t.conducteur_id = ?
       ORDER BY r.date_reservation DESC`,
      [id]
    );

    res.json({ status: 'ok', data: demands });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- NOUVELLE ROUTE : ACCEPTER UNE RÉSERVATION ---
app.put('/api/reservations/:id/accept', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Trouver la réservation et le trajet correspondant
    const [reservations] = await db.query(
      `SELECT r.*, t.places_restantes, t.id AS trip_id 
       FROM reservations r
       JOIN trajets t ON r.trajet_id = t.id
       WHERE r.id = ?`,
      [id]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Réservation introuvable.' });
    }

    const reservation = reservations[0];

    // 2. Ne doit pas être acceptée deux fois
    if (reservation.statut === 'ACCEPIEE') {
      return res.status(400).json({ status: 'erreur', message: 'Cette réservation est déjà acceptée.' });
    }

    // 3. S'assurer qu'il reste des places libres
    if (reservation.places_restantes <= 0) {
      return res.status(400).json({ status: 'erreur', message: 'Aucune place restante sur ce trajet.' });
    }

    // 4. Modifier le statut et décrémenter les places (statut 'ACCEPIEE' par rapport au schéma SQL)
    await db.query('UPDATE reservations SET statut = ? WHERE id = ?', ['ACCEPIEE', id]);
    await db.query(
      'UPDATE trajets SET places_restantes = places_restantes - 1 WHERE id = ?',
      [reservation.trip_id]
    );

    // Ajouter la notification pour le passager
    await db.query(
      'INSERT INTO notifications (utilisateur_id, type, message) VALUES (?, ?, ?)',
      [reservation.passager_id, 'RESERVATION_ACCEPTEE', 'Votre demande de réservation a été acceptée.']
    );

    res.json({ status: 'ok', message: 'Réservation acceptée avec succès !' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- NOUVELLE ROUTE : REFUSER UNE RÉSERVATION ---
app.put('/api/reservations/:id/reject', async (req, res) => {
  const { id } = req.params;

  try {
    const [reservations] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (reservations.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Réservation introuvable.' });
    }

    const reservation = reservations[0];

    // Si elle était acceptée et qu'on la refuse, on remet la place libre (optionnel, mais propre)
    if (reservation.statut === 'ACCEPIEE') {
      await db.query(
        'UPDATE trajets SET places_restantes = places_restantes + 1 WHERE id = ?',
        [reservation.trajet_id]
      );
    }

    await db.query('UPDATE reservations SET statut = ? WHERE id = ?', ['REFUSEE', id]);

    // Ajouter la notification pour le passager
    await db.query(
      'INSERT INTO notifications (utilisateur_id, type, message) VALUES (?, ?, ?)',
      [reservation.passager_id, 'RESERVATION_REFUSEE', 'Votre demande de réservation a été refusée.']
    );

    res.json({ status: 'ok', message: 'Réservation refusée.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- NOUVELLE ROUTE : VOIR LES NOTIFICATIONS ---
app.get('/api/notifications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [notifs] = await db.query(
      'SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY created_at DESC',
      [id]
    );
    res.json({ status: 'ok', data: notifs });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// ==========================================
// SECTION ADMINISTRATION
// ==========================================

// Middleware pour vérifier le rôle administrateur
const checkAdmin = async (req, res, next) => {
  const admin_id = req.query.admin_id || req.body.admin_id;
  if (!admin_id) {
    return res.status(401).json({ status: 'erreur', message: 'Accès non autorisé : admin_id manquant.' });
  }

  try {
    const [users] = await db.query('SELECT role FROM utilisateurs WHERE id = ?', [admin_id]);
    if (users.length === 0 || users[0].role !== 'ADMIN') {
      return res.status(403).json({ status: 'erreur', message: 'Accès interdit : privilèges administrateur requis.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
};

// --- ROUTE : ADMINISTRATION (STATISTIQUES) ---
app.get('/api/admin/stats', checkAdmin, async (req, res) => {
  try {
    const [[usersResult]] = await db.query('SELECT COUNT(*) AS count FROM utilisateurs');
    const [[driversResult]] = await db.query("SELECT COUNT(*) AS count FROM utilisateurs WHERE role = 'CONDUCTEUR'");
    const [[passengersResult]] = await db.query("SELECT COUNT(*) AS count FROM utilisateurs WHERE role = 'PASSAGER'");

    const [[tripsResult]] = await db.query('SELECT COUNT(*) AS count FROM trajets');
    const [[activeTripsResult]] = await db.query("SELECT COUNT(*) AS count FROM trajets WHERE statut = 'DISPONIBLE'");

    const [[reservationsResult]] = await db.query('SELECT COUNT(*) AS count FROM reservations');
    const [[pendingResResult]] = await db.query("SELECT COUNT(*) AS count FROM reservations WHERE statut = 'DEMANDEE'");
    const [[acceptedResResult]] = await db.query("SELECT COUNT(*) AS count FROM reservations WHERE statut = 'ACCEPIEE'"); // Using ACCEPIEE to match DB typo
    const [[rejectedResResult]] = await db.query("SELECT COUNT(*) AS count FROM reservations WHERE statut = 'REFUSEE'");

    res.json({
      status: 'ok',
      data: {
        usersCount: usersResult.count,
        driversCount: driversResult.count,
        passengersCount: passengersResult.count,
        tripsCount: tripsResult.count,
        activeTripsCount: activeTripsResult.count,
        reservationsCount: reservationsResult.count,
        pendingReservationsCount: pendingResResult.count,
        acceptedReservationsCount: acceptedResResult.count,
        rejectedReservationsCount: rejectedResResult.count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : LISTER LES UTILISATEURS ---
app.get('/api/admin/users', checkAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, nom, courriel, role, statut, created_at FROM utilisateurs ORDER BY created_at DESC');
    res.json({ status: 'ok', data: users });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : ACTIVER UN UTILISATEUR ---
app.put('/api/admin/users/:id/activate', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE utilisateurs SET statut = ? WHERE id = ?', ['ACTIF', id]);
    res.json({ status: 'ok', message: 'Utilisateur activé avec succès.' });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : DÉSACTIVER UN UTILISATEUR ---
app.put('/api/admin/users/:id/deactivate', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE utilisateurs SET statut = ? WHERE id = ?', ['INACTIF', id]);
    res.json({ status: 'ok', message: 'Utilisateur désactivé avec succès.' });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : LISTER LES TRAJETS (ADMIN) ---
app.get('/api/admin/trips', checkAdmin, async (req, res) => {
  try {
    const [trips] = await db.query(`
      SELECT t.*, u.nom AS conducteur_nom, u.courriel AS conducteur_courriel
      FROM trajets t
      JOIN utilisateurs u ON t.conducteur_id = u.id
      ORDER BY t.date DESC, t.heure DESC
    `);
    res.json({ status: 'ok', data: trips });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : DÉTAILS D'UN TRAJET (ADMIN) ---
app.get('/api/admin/trips/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [trips] = await db.query(`
      SELECT t.*, u.nom AS conducteur_nom, u.courriel AS conducteur_courriel
      FROM trajets t
      JOIN utilisateurs u ON t.conducteur_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (trips.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Trajet introuvable.' });
    }

    const [reservations] = await db.query(`
      SELECT r.id, r.statut, r.date_reservation, u.nom AS passager_nom, u.courriel AS passager_courriel
      FROM reservations r
      JOIN utilisateurs u ON r.passager_id = u.id
      WHERE r.trajet_id = ?
    `, [id]);

    const tripData = { ...trips[0], reservations };
    res.json({ status: 'ok', data: tripData });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : SUPPRIMER UN TRAJET (ADMIN) ---
app.delete('/api/admin/trips/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM trajets WHERE id = ?', [id]);
    res.json({ status: 'ok', message: 'Trajet et réservations associées supprimés avec succès.' });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : LISTER LES RÉSERVATIONS (ADMIN) ---
app.get('/api/admin/reservations', checkAdmin, async (req, res) => {
  try {
    const [reservations] = await db.query(`
      SELECT r.*, 
             t.depart, t.arrivee, t.date, t.heure, 
             p.nom AS passager_nom, c.nom AS conducteur_nom
      FROM reservations r
      JOIN trajets t ON r.trajet_id = t.id
      JOIN utilisateurs p ON r.passager_id = p.id
      JOIN utilisateurs c ON t.conducteur_id = c.id
      ORDER BY r.date_reservation DESC
    `);
    res.json({ status: 'ok', data: reservations });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// --- ROUTE : DÉTAILS D'UNE RÉSERVATION (ADMIN) ---
app.get('/api/admin/reservations/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [reservations] = await db.query(`
      SELECT r.*, 
             t.depart, t.arrivee, t.date, t.heure, t.places_totales, t.places_restantes,
             p.nom AS passager_nom, p.courriel AS passager_courriel,
             c.nom AS conducteur_nom, c.courriel AS conducteur_courriel
      FROM reservations r
      JOIN trajets t ON r.trajet_id = t.id
      JOIN utilisateurs p ON r.passager_id = p.id
      JOIN utilisateurs c ON t.conducteur_id = c.id
      WHERE r.id = ?
    `, [id]);

    if (reservations.length === 0) {
      return res.status(404).json({ status: 'erreur', message: 'Réservation introuvable.' });
    }

    res.json({ status: 'ok', data: reservations[0] });
  } catch (error) {
    res.status(500).json({ status: 'erreur', message: error.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur : http://localhost:${PORT}`);
});
