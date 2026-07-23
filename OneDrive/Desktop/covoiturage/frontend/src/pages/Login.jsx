import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [courriel, setCourriel] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur('');

    if (!courriel || !motdepasse) {
      setErreur('Le courriel et le mot de passe sont obligatoires.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courriel, motdepasse }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErreur(data.message || 'Identifiants incorrects.');
      } else {
        // Stocker l'utilisateur dans localStorage (converti en chaîne de caractères JSON)
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Rediriger vers le tableau de bord
        navigate('/dashboard');
      }
    } catch (err) {
      setErreur('Impossible de se connecter au serveur backend.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
        Accéder au Covoiturage La Cité
      </p>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <form onSubmit={handleLogin}>
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

        <button type="submit">Se connecter</button>
      </form>

      <div className="auth-footer">
        Pas encore de compte ? <Link to="/register">S'inscrire ici</Link>
      </div>
    </div>
  );
}
