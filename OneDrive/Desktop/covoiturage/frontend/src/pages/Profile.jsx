import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  // Récupérer l'utilisateur connecté dans localStorage
  const userJson = localStorage.getItem('user');
  const loggedInUser = userJson ? JSON.parse(userJson) : null;

  // États du formulaire
  const [nom, setNom] = useState('');
  const [courriel, setCourriel] = useState('');
  
  // États de statut
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [success, setSuccess] = useState('');

  // Récupérer les données du profil depuis le backend au chargement de la page
  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${loggedInUser.id}`);
        const data = await response.json();

        if (response.ok) {
          setNom(data.data.nom);
          setCourriel(data.data.courriel);
        } else {
          setErreur(data.message || 'Impossible de récupérer le profil.');
        }
      } catch (err) {
        setErreur('Erreur de connexion avec le serveur backend.');
        console.error(err);
      } finally {
        setChargement(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Gérer la sauvegarde des modifications
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErreur('');
    setSuccess('');

    if (!nom || !courriel) {
      setErreur('Le nom et le courriel sont obligatoires.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${loggedInUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, courriel }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErreur(data.message || 'Impossible de mettre à jour le profil.');
      } else {
        setSuccess('Profil mis à jour avec succès !');
        // Mettre à jour le localStorage pour garder l'affichage synchrone
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    } catch (err) {
      setErreur('Erreur de communication avec le serveur.');
      console.error(err);
    }
  };

  if (chargement) {
    return <div style={{ textAlign: 'center' }}>Chargement du profil...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="nav-bar">
        <div className="nav-logo">🚗 Mon Profil - Covoiturage</div>
        <button onClick={() => navigate('/dashboard')} style={{ width: 'auto', padding: '8px 15px' }}>
          Retour au Dashboard
        </button>
      </div>

      <h2>Modifier mon Profil</h2>
      <p style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-muted)' }}>
        Mettez à jour vos informations personnelles.
      </p>

      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleUpdateProfile} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="form-group">
          <label htmlFor="nom">Nom complet</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="courriel">Adresse courriel</label>
          <input
            type="email"
            id="courriel"
            value={courriel}
            onChange={(e) => setCourriel(e.target.value)}
          />
        </div>

        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>
  );
}
