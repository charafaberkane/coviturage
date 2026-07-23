import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TripSearch from './TripSearch';

export default function TripList() {
  const navigate = useNavigate();

  // Récupérer l'utilisateur connecté
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // États pour les trajets et la recherche
  const [trips, setTrips] = useState([]);
  const [searchParams, setSearchParams] = useState({ depart: '', arrivee: '', date: '' });
  
  // États de statut
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  // Fonction pour charger la liste des trajets (avec ou sans filtres)
  const fetchTrips = async (clearFilters = false) => {
    setChargement(true);
    setErreur('');

    let url = 'http://localhost:5000/api/trips';
    
    // Si on ne vide pas les filtres et qu'ils sont remplis, on construit la query string
    if (!clearFilters) {
      const params = new URLSearchParams();
      if (searchParams.depart) params.append('depart', searchParams.depart);
      if (searchParams.arrivee) params.append('arrivee', searchParams.arrivee);
      if (searchParams.date) params.append('date', searchParams.date);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setTrips(data.data);
      } else {
        setErreur(data.message || 'Impossible de récupérer les trajets.');
      }
    } catch (err) {
      setErreur('Erreur de communication avec le serveur.');
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  // Charger les trajets au montage du composant
  useEffect(() => {
    fetchTrips();
  }, []);

  // Supprimer / Annuler un trajet
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Voulez-vous vraiment annuler ce trajet de covoiturage ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conducteur_id: user.id })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Trajet annulé avec succès !');
        // Recharger la liste
        fetchTrips();
      } else {
        alert(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      alert('Erreur serveur lors de la suppression.');
      console.error(err);
    }
  };

  // Demander une réservation
  const handleReserve = async (tripId) => {
    if (!window.confirm('Voulez-vous demander une réservation pour ce trajet ?')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trajet_id: tripId,
          passager_id: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Demande de réservation envoyée !');
      } else {
        alert(data.message || 'Erreur lors de la demande.');
      }
    } catch (err) {
      alert('Erreur serveur lors de la demande de réservation.');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="nav-bar">
        <div className="nav-logo">🚗 Trajets Disponibles</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {user && user.role === 'CONDUCTEUR' && (
            <button onClick={() => navigate('/trips/create')} style={{ width: 'auto', padding: '8px 15px' }}>
              + Proposer un trajet
            </button>
          )}
          <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ width: 'auto', padding: '8px 15px', marginTop: 0 }}>
            Dashboard
          </button>
        </div>
      </div>

      <TripSearch 
        searchParams={searchParams} 
        setSearchParams={setSearchParams} 
        onSearch={fetchTrips} 
      />

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {chargement ? (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>Chargement des trajets...</div>
      ) : trips.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: '40px 0' }}>
          Aucun trajet de covoiturage ne correspond à vos critères de recherche.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
          {trips.map((trip) => (
            <div key={trip.id} style={{
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff'
            }}>
              <div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>
                  {trip.depart} ➔ {trip.arrivee}
                </h3>
                <p style={{ marginBottom: '5px' }}>
                  📅 <strong>Date :</strong> {trip.date.split('T')[0]} à {trip.heure.substring(0, 5)}
                </p>
                <p style={{ marginBottom: '5px' }}>
                  👤 <strong>Conducteur :</strong> {trip.conducteur_nom}
                </p>
                <p style={{ margin: 0 }}>
                  🎟️ <strong>Places restantes :</strong> {trip.places_restantes} / {trip.places_totales}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Si c'est le trajet de l'utilisateur connecté, on affiche Éditer et Annuler */}
                {trip.conducteur_id === user.id ? (
                  <>
                    <button 
                      onClick={() => navigate(`/trips/edit/${trip.id}`)}
                      style={{ padding: '6px 12px', fontSize: '14px' }}
                    >
                      Éditer
                    </button>
                    <button 
                      onClick={() => handleDeleteTrip(trip.id)}
                      style={{ padding: '6px 12px', fontSize: '14px' }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  // Bouton pour réserver
                  <button 
                    disabled={trip.places_restantes <= 0}
                    onClick={() => handleReserve(trip.id)}
                    style={{ 
                      padding: '8px 15px', 
                      backgroundColor: trip.places_restantes > 0 ? '#007bff' : '#6c757d', 
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: trip.places_restantes > 0 ? 'pointer' : 'not-allowed', 
                      fontSize: '14px' 
                    }}
                  >
                    {trip.places_restantes > 0 ? 'Réserver' : 'Complet'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
