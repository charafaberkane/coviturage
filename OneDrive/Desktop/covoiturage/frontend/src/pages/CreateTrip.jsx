import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTrip() {
  const navigate = useNavigate();
  
  // Récupérer l'utilisateur connecté
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // États du formulaire
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeur] = useState('');
  const [placesTotales, setPlacesTotales] = useState('3');

  // États de statut
  const [erreur, setErreur] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setErreur('');
    setSuccess('');

    if (!depart || !arrivee || !date || !heure || !placesTotales) {
      setErreur('Tous les champs sont obligatoires.');
      return;
    }

    if (parseInt(placesTotales) <= 0) {
      setErreur('Le nombre de places doit être supérieur à zéro.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
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
        setSuccess('Trajet publié avec succès !');
        setTimeout(() => {
          navigate('/trips');
        }, 1500);
      }
    } catch (err) {
      setErreur('Erreur de communication avec le serveur.');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="nav-bar">
        <div className="nav-logo">🚗 Publier un Trajet</div>
        <button onClick={() => navigate('/dashboard')} style={{ width: 'auto', padding: '8px 15px' }}>
          Retour au Dashboard
        </button>
      </div>

      <h2>Proposer un nouveau trajet</h2>

      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleCreateTrip} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="form-group">
          <label htmlFor="depart">Lieu de départ</label>
          <input
            type="text"
            id="depart"
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            placeholder="Ex: Campus d'Ottawa de La Cité"
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
            placeholder="Ex: Gare de Montréal"
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
            onChange={(e) => setHeur(e.target.value)}
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

        <button type="submit">Publier le trajet</button>
      </form>
    </div>
  );
}
