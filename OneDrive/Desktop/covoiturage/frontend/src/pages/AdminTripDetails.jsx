import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminTripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const [trip, setTrip] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }

    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/trips/${id}?admin_id=${user.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setTrip(data.data);
        } else {
          setErreur(data.message || 'Erreur de chargement');
        }
      } catch (err) {
        setErreur('Erreur serveur.');
      } finally {
        setChargement(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (!user || user.role !== 'ADMIN') return null;

  if (chargement) return <div style={{ padding: '20px' }}>Chargement...</div>;
  if (erreur) return <div className="alert alert-danger" style={{ margin: '20px' }}>{erreur}</div>;
  if (!trip) return null;

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <div className="nav-bar">
        <div className="nav-logo">Détails du Trajet #{trip.id}</div>
        <button onClick={() => navigate('/admin')} className="btn-secondary" style={{ width: 'auto', padding: '8px 15px' }}>
          Retour à l'Admin
        </button>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Informations Générales</h3>
        <p><strong>Conducteur :</strong> {trip.conducteur_nom} ({trip.conducteur_courriel})</p>
        <p><strong>Départ :</strong> {trip.depart}</p>
        <p><strong>Arrivée :</strong> {trip.arrivee}</p>
        <p><strong>Date & Heure :</strong> {new Date(trip.date).toLocaleDateString()} à {trip.heure}</p>
        <p><strong>Places :</strong> {trip.places_restantes} / {trip.places_totales}</p>
        <p><strong>Statut :</strong> <span style={{ fontWeight: 'bold' }}>{trip.statut}</span></p>
      </div>

      <h3>Réservations pour ce trajet</h3>
      {trip.reservations && trip.reservations.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '14px', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>ID Rés.</th>
              <th style={{ padding: '8px' }}>Date Demande</th>
              <th style={{ padding: '8px' }}>Passager</th>
              <th style={{ padding: '8px' }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {trip.reservations.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '8px' }}>{r.id}</td>
                <td style={{ padding: '8px' }}>{new Date(r.date_reservation).toLocaleDateString()}</td>
                <td style={{ padding: '8px' }}>{r.passager_nom} ({r.passager_courriel})</td>
                <td style={{ padding: '8px' }}>{r.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune réservation pour ce trajet.</p>
      )}
    </div>
  );
}
