import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Récupérer l'utilisateur connecté
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // États du formulaire
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [placesTotales, setPlacesTotales] = useState('3');

  // États de statut
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [success, setSuccess] = useState('');

  // Charger le trajet au chargement
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trips/${id}`);
        const data = await response.json();

        if (response.ok) {
          // Validation de sécurité : seul le conducteur peut modifier son trajet
          if (data.data.conducteur_id !== user.id) {
            setErreur("Vous n'êtes pas autorisé à modifier ce trajet.");
            setChargement(false);
            return;
          }

          setDepart(data.data.depart);
          setArrivee(data.data.arrivee);
          
          // Formater la date en YYYY-MM-DD
          const formattedDate = data.data.date.split('T')[0];
          setDate(formattedDate);
          
          // Heure est au format HH:MM:SS, on garde HH:MM
          setHeure(data.data.heure.substring(0, 5));
          setPlacesTotales(data.data.places_totales);
        } else {
          setErreur(data.message || 'Impossible de charger le trajet.');
        }
      } catch (err) {
        setErreur('Erreur de connexion.');
        console.error(err);
      } finally {
        setChargement(false);
      }
    };

    fetchTrip();
  }, [id, user.id]);

  const handleEditTrip = async (e) => {
    e.preventDefault();
    setErreur('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conducteur_id: user.id,
          depart,
          arrivee,
          date,
          heure,
          places_totales: placesTotales
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErreur(data.message || 'Une erreur est survenue.');
      } else {
        setSuccess('Trajet mis à jour avec succès !');
        setTimeout(() => {
          navigate('/trips');
        }, 1500);
      }
    } catch (err) {
      setErreur('Erreur de communication avec le serveur.');
      console.error(err);
    }
  };

  if (chargement) {
    return <div style={{ textAlign: 'center' }}>Chargement du trajet...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="nav-bar">
        <div className="nav-logo">🚗 Modifier le Trajet</div>
        <button onClick={() => navigate('/trips')} style={{ width: 'auto', padding: '8px 15px' }}>
          Annuler
        </button>
      </div>

      <h2>Éditer le trajet</h2>

      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!erreur && (
        <form onSubmit={handleEditTrip} style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="form-group">
            <label htmlFor="depart">Lieu de départ</label>
            <input
              type="text"
              id="depart"
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="arrivee">Lieu d'arrivée</label>
            <input
              type="text"
              id="arrivee"
              value={arrivee}
              onChange={(e) => setArrivee(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date de départ</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="heure">Heure de départ</label>
            <input
              type="time"
              id="heure"
              value={heure}
              onChange={(e) => setHeure(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="places_totales">Nombre de places disponibles</label>
            <input
              type="number"
              id="places_totales"
              min="1"
              value={placesTotales}
              onChange={(e) => setPlacesTotales(e.target.value)}
              required
            />
          </div>

          <button type="submit">Enregistrer les modifications</button>
        </form>
      )}
    </div>
  );
}
