import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [nom, setNom] = useState('');
  const [courriel, setCourriel] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [role, setRole] = useState('PASSAGER');
  const [erreur, setErreur] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErreur('');
    setSuccess('');

    // Validation frontend simple
    if (!nom || !courriel || !motdepasse || !role) {
      setErreur('Tous les champs sont obligatoires.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, courriel, motdepasse, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErreur(data.message || 'Une erreur est survenue lors de l\'inscription.');
      } else {
        setSuccess('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
        // Réinitialiser les champs
        setNom('');
        setCourriel('');
        setMotdepasse('');
        
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setErreur('Impossible de se connecter au serveur backend.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Créer un compte</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
        Covoiturage Collège La Cité
      </p>

      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="nom">Nom complet</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Jean Tremblay"
          />
        </div>

        <div className="form-group">
          <label htmlFor="courriel">Adresse courriel</label>
          <input
            type="email"
            id="courriel"
            value={courriel}
            onChange={(e) => setCourriel(e.target.value)}
            placeholder="nom@lacite.on.ca"
          />
        </div>

        <div className="form-group">
          <label htmlFor="motdepasse">Mot de passe</label>
          <input
            type="password"
            id="motdepasse"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
            placeholder="Votre mot de passe"
          />
        </div>

        <div className="form-group">
          <label>Je veux m'inscrire comme :</label>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="radio"
                name="role"
                value="PASSAGER"
                checked={role === 'PASSAGER'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '5px' }}
              />
              Passager
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="radio"
                name="role"
                value="CONDUCTEUR"
                checked={role === 'CONDUCTEUR'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '5px' }}
              />
              Conducteur
            </label>
          </div>
        </div>

        <button type="submit">S'inscrire</button>
      </form>

      <div className="auth-footer">
        Déjà un compte ? <Link to="/login">Se connecter ici</Link>
      </div>
    </div>
  );
}
