import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DriverRequests() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const [requests, setRequests] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/driver/${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setRequests(data.data);
      } else {
        setErreur(data.message || 'Erreur lors du chargement des demandes.');
      }
    } catch (err) {
      setErreur('Erreur de communication avec le serveur.');
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${id}/accept`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (response.ok) {
        alert('Réservation acceptée !');
        fetchRequests();
      } else {
        alert(data.message || 'Erreur lors de l\'acceptation.');
      }
    } catch (err) {
      alert('Erreur serveur.');
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${id}/reject`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (response.ok) {
        alert('Réservation refusée.');
        fetchRequests();
      } else {
        alert(data.message || 'Erreur lors du refus.');
      }
    } catch (err) {
      alert('Erreur serveur.');
      console.error(err);
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
        <div className="nav-logo">🚗 Demandes Reçues</div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ width: 'auto', padding: '8px 15px' }}>
          Retour au Dashboard
        </button>
      </div>

      <h2>Gestion des réservations pour mes trajets</h2>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {chargement ? (
        <p style={{ textAlign: 'center' }}>Chargement...</p>
      ) : requests.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Vous n'avez reçu aucune demande pour le moment.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
          {requests.map((req) => (
            <div key={req.id} style={{
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
                  {req.depart} ➔ {req.arrivee}
                </h3>
                <p style={{ marginBottom: '5px' }}>📅 <strong>Date :</strong> {req.date.split('T')[0]} à {req.heure.substring(0, 5)}</p>
                <p style={{ marginBottom: '5px' }}>👤 <strong>Passager :</strong> {req.passager_nom}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                  Statut : <strong>{getStatusText(req.statut)}</strong> | Demande faite le : {new Date(req.date_reservation).toLocaleString()}
                </p>
              </div>
              
              {req.statut === 'DEMANDEE' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleAccept(req.id)}
                    style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px' }}
                  >
                    Accepter
                  </button>
                  <button 
                    onClick={() => handleReject(req.id)}
                    style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px' }}
                  >
                    Refuser
                  </button>
                </div>
              ) : (
                <div style={{ padding: '8px 15px', color: '#6c757d', fontStyle: 'italic' }}>
                  Traitée
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
