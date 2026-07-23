import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PassengerReservations() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const [reservations, setReservations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reservations/passenger/${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setReservations(data.data);
        } else {
          setErreur(data.message || 'Erreur lors du chargement des réservations.');
        }
      } catch (err) {
        setErreur('Erreur de communication avec le serveur.');
        console.error(err);
      } finally {
        setChargement(false);
      }
    };

    fetchReservations();
  }, [user, navigate]);

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'DEMANDEE': return '#f0ad4e'; // Warning (orange)
      case 'ACCEPIEE': return '#28a745'; // Success (green)
      case 'REFUSEE': return '#dc3545'; // Danger (red)
      default: return '#6c757d';
    }
  };

  const getStatusText = (statut) => {
    switch(statut) {
      case 'DEMANDEE': return 'En attente';
      case 'ACCEPIEE': return 'Acceptée';
      case 'REFUSEE': return 'Refusée';
      default: return statut;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="nav-bar">
        <div className="nav-logo">🚗 Mes Réservations</div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ width: 'auto', padding: '8px 15px' }}>
          Retour au Dashboard
        </button>
      </div>

      <h2>Historique de mes demandes</h2>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {chargement ? (
        <p style={{ textAlign: 'center' }}>Chargement...</p>
      ) : reservations.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Vous n'avez fait aucune demande de réservation pour le moment.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
          {reservations.map((res) => (
            <div key={res.id} style={{
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>
                  {res.depart} ➔ {res.arrivee}
                </h3>
                <p style={{ marginBottom: '5px' }}>📅 <strong>Date :</strong> {res.date.split('T')[0]} à {res.heure.substring(0, 5)}</p>
                <p style={{ marginBottom: '5px' }}>👤 <strong>Conducteur :</strong> {res.conducteur_nom}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                  Demande faite le : {new Date(res.date_reservation).toLocaleString()}
                </p>
              </div>
              <div style={{
                padding: '8px 15px',
                borderRadius: '20px',
                color: '#fff',
                backgroundColor: getStatusColor(res.statut),
                fontWeight: 'bold',
                textAlign: 'center',
                minWidth: '100px'
              }}>
                {getStatusText(res.statut)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
