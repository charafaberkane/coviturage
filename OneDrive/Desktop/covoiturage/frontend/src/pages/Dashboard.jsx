import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Récupérer l'utilisateur stocké dans le localStorage
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="nav-bar">
        <div className="nav-logo">🚗 Covoiturage La Cité</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/profile')} style={{ width: 'auto', padding: '8px 15px' }}>
            Mon Profil
          </button>
          <button onClick={handleLogout} style={{ width: 'auto', padding: '8px 15px' }} className="btn-secondary">
            Se déconnecter
          </button>
        </div>
      </div>

      <h2>Tableau de bord</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Bienvenue dans votre espace de covoiturage étudiant.
      </p>

      <div className="user-info-card">
        <h3>Vos informations de profil :</h3>
        <p><strong>Nom complet :</strong> {user.nom}</p>
        <p><strong>Adresse courriel :</strong> {user.courriel}</p>
        <p><strong>Rôle :</strong> {user.role}</p>
        <p><strong>Statut du compte :</strong> {user.statut}</p>
      </div>

      {/* Raccourcis pour les trajets */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={{
          flex: '1 1 200px',
          border: '1px solid var(--border-color)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Rechercher un trajet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px 0', fontSize: '14px' }}>
            Trouvez un trajet proposé par un autre étudiant vers votre campus ou votre domicile.
          </p>
          <button onClick={() => navigate('/trips')}>Voir les trajets</button>
        </div>

        {user.role === 'CONDUCTEUR' && (
          <div style={{
            flex: '1 1 200px',
            border: '1px solid var(--border-color)',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>Proposer un trajet</h3>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px 0', fontSize: '14px' }}>
              Partagez vos frais de route en proposant des places libres dans votre véhicule.
            </p>
            <button onClick={() => navigate('/trips/create')}>Créer une annonce</button>
          </div>
        )}

        <div style={{
          flex: '1 1 200px',
          border: '1px solid var(--border-color)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Mes Réservations</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px 0', fontSize: '14px' }}>
            Suivez l'état des demandes de réservation que vous avez envoyées.
          </p>
          <button onClick={() => navigate('/reservations/passenger')}>Voir mes demandes</button>
        </div>

        <div style={{
          flex: '1 1 200px',
          border: '1px solid var(--border-color)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Demandes Reçues</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px 0', fontSize: '14px' }}>
            Gérez les demandes de réservation reçues pour vos trajets.
          </p>
          <button onClick={() => navigate('/reservations/driver')}>Gérer les demandes</button>
        </div>

        {user.role === 'ADMIN' && (
          <div style={{
            flex: '1 1 200px',
            border: '1px solid var(--border-color)',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#e2e3e5'
          }}>
            <h3>Espace Administrateur</h3>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px 0', fontSize: '14px' }}>
              Gérez les utilisateurs et consultez les statistiques globales de l'application.
            </p>
            <button onClick={() => navigate('/admin')} style={{ backgroundColor: '#343a40' }}>Administration</button>
          </div>
        )}
      </div>
    </div>
  );
}
