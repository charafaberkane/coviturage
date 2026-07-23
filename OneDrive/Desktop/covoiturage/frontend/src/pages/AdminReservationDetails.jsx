import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const [reservation, setReservation] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }

    const fetchResDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/reservations/${id}?admin_id=${user.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setReservation(data.data);
        } else {
          setErreur(data.message || 'Erreur de chargement');
        }
      } catch (err) {
        setErreur('Erreur serveur.');
      } finally {
        setChargement(false);
      }
    };

    fetchResDetails();
  }, [id]);

  if (!user || user.role !== 'ADMIN') return null;

  if (chargement) return <div style={{ padding: '20px' }}>Chargement...</div>;
  if (erreur) return <div className="alert alert-danger" style={{ margin: '20px' }}>{erreur}</div>;
  if (!reservation) return null;

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <div className="nav-bar">
        <div className="nav-logo">Détails de la Réservation #{reservation.id}</div>
        <button onClick={() => navigate('/admin')} className="btn-secondary" style={{ width: 'auto', padding: '8px 15px' }}>
          Retour à l'Admin
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', backgroundColor: '#e9ecef', padding: '20px', borderRadius: '8px' }}>
          <h3>État de la Réservation</h3>
          <p><strong>Date de demande :</strong> {new Date(reservation.date_reservation).toLocaleDateString()}</p>
          <p><strong>Statut :</strong> <span style={{ fontWeight: 'bold' }}>{reservation.statut}</span></p>
        </div>

        <div style={{ flex: '1 1 300px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>Trajet Associé (ID: {reservation.trajet_id})</h3>
          <p><strong>Départ :</strong> {reservation.depart}</p>
          <p><strong>Arrivée :</strong> {reservation.arrivee}</p>
          <p><strong>Date :</strong> {new Date(reservation.date).toLocaleDateString()} à {reservation.heure}</p>
          <p><strong>Places restantes :</strong> {reservation.places_restantes} / {reservation.places_totales}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>Passager</h3>
          <p><strong>Nom :</strong> {reservation.passager_nom}</p>
          <p><strong>Courriel :</strong> {reservation.passager_courriel}</p>
        </div>

        <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>Conducteur</h3>
          <p><strong>Nom :</strong> {reservation.conducteur_nom}</p>
          <p><strong>Courriel :</strong> {reservation.conducteur_courriel}</p>
        </div>
      </div>
    </div>
  );
}
