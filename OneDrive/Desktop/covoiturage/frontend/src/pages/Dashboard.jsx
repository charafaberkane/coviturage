import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();

  // Retrieve user from localStorage
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
      <Navbar />
      <Card style={{ marginTop: '1rem' }}>
        <h2 style={{ textAlign: 'center' }}>Tableau de bord</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Bienvenue dans votre espace de covoiturage étudiant.
        </p>
        <Card style={{ padding: '1rem', backgroundColor: 'var(--card-bg)', marginBottom: '1rem' }}>
          <h3>Vos informations de profil :</h3>
          <p><strong>Nom complet :</strong> {user.nom}</p>
          <p><strong>Adresse courriel :</strong> {user.courriel}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
          <p><strong>Statut du compte :</strong> {user.statut}</p>
        </Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '1rem' }}>
          <Card style={{ flex: '1 1 200px', padding: '1rem' }}>
            <h3>Rechercher un trajet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Trouvez un trajet proposé par un autre étudiant vers votre campus ou votre domicile.
            </p>
            <Button variant="primary" onClick={() => navigate('/trips')}>Voir les trajets</Button>
          </Card>

          {user.role === 'CONDUCTEUR' && (
            <Card style={{ flex: '1 1 200px', padding: '1rem' }}>
              <h3>Proposer un trajet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Partagez vos frais de route en proposant des places libres dans votre véhicule.
              </p>
              <Button variant="primary" onClick={() => navigate('/trips/create')}>Créer une annonce</Button>
            </Card>
          )}

          <Card style={{ flex: '1 1 200px', padding: '1rem' }}>
            <h3>Mes Réservations</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Suivez l'état des demandes de réservation que vous avez envoyées.
            </p>
            <Button variant="primary" onClick={() => navigate('/reservations/passenger')}>Voir mes demandes</Button>
          </Card>

          <Card style={{ flex: '1 1 200px', padding: '1rem' }}>
            <h3>Demandes Reçues</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Gérez les demandes de réservation reçues pour vos trajets.
            </p>
            <Button variant="primary" onClick={() => navigate('/reservations/driver')}>Gérer les demandes</Button>
          </Card>

          {user.role === 'ADMIN' && (
            <Card style={{ flex: '1 1 200px', padding: '1rem', backgroundColor: 'var(--card-bg-alt)' }}>
              <h3>Espace Administrateur</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Gérez les utilisateurs et consultez les statistiques globales de l'application.
              </p>
              <Button variant="danger" onClick={() => navigate('/admin')}>Administration</Button>
            </Card>
          )}
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Button variant="secondary" onClick={handleLogout}>Se déconnecter</Button>
        </div>
      </Card>
    </div>
  );
}
