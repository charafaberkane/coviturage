import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courriel, motdepasse }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErreur(data.message || 'Identifiants incorrects.');
      } else {
        localStorage.setItem('user', JSON.stringify(data.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setErreur('Impossible de se connecter au serveur backend.');
      console.error(err);
    }
  };

  return (
    <div className="auth-page" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Connexion</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
          Accéder au Covoiturage La Cité
        </p>

        {erreur && <Alert type="error">{erreur}</Alert>}

        <form onSubmit={handleLogin}>
          <Input
            type="email"
            name="courriel"
            placeholder="nom@lacite.on.ca"
            value={courriel}
            onChange={(e) => setCourriel(e.target.value)}
          />
          <Input
            type="password"
            name="motdepasse"
            placeholder="Votre mot de passe"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
          />
          <Button type="submit" variant="primary">
            Se connecter
          </Button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Pas encore de compte ? <Link to="/register">S'inscrire ici</Link>
        </div>
      </Card>
    </div>
  );
}
