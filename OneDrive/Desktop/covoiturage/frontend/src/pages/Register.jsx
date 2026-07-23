import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';

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

    if (!nom || !courriel || !motdepasse || !role) {
      setErreur('Tous les champs sont obligatoires.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, courriel, motdepasse, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErreur(data.message || "Une erreur est survenue lors de l'inscription.");
      } else {
        setSuccess('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
        // Reset fields
        setNom('');
        setCourriel('');
        setMotdepasse('');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setErreur('Impossible de se connecter au serveur backend.');
      console.error(err);
    }
  };

  return (
    <div className="auth-page" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Card style={{ maxWidth: '500px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Créer un compte</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
          Covoiturage Collège La Cité
        </p>

        {erreur && <Alert type="error">{erreur}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <form onSubmit={handleRegister}>
          <Input
            type="text"
            name="nom"
            placeholder="Ex: Jean Tremblay"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
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
          <div style={{ margin: '0.5rem 0' }}>
            <label style={{ marginRight: '10px' }}>Je veux m'inscrire comme :</label>
            <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: '15px' }}>
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
            <label style={{ display: 'inline-flex', alignItems: 'center' }}>
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
          <Button type="submit" variant="primary">S'inscrire</Button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Déjà un compte ? <Link to="/login">Se connecter ici</Link>
        </div>
      </Card>
    </div>
  );
}
