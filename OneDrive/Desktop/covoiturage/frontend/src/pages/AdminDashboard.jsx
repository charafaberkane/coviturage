import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [reservations, setReservations] = useState([]);
  
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  // Filtres
  const [tripFilter, setTripFilter] = useState('');
  const [resFilter, setResFilter] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setChargement(true);
    setErreur('');
    try {
      const urlParams = `?admin_id=${user.id}`;
      
      const [resStats, resUsers, resTrips, resReservations] = await Promise.all([
        fetch(`http://localhost:5000/api/admin/stats${urlParams}`),
        fetch(`http://localhost:5000/api/admin/users${urlParams}`),
        fetch(`http://localhost:5000/api/admin/trips${urlParams}`),
        fetch(`http://localhost:5000/api/admin/reservations${urlParams}`)
      ]);

      const dataStats = await resStats.json();
      const dataUsers = await resUsers.json();
      const dataTrips = await resTrips.json();
      const dataReservations = await resReservations.json();

      if (resStats.ok) setStats(dataStats.data);
      if (resUsers.ok) setUsers(dataUsers.data);
      if (resTrips.ok) setTrips(dataTrips.data);
      if (resReservations.ok) setReservations(dataReservations.data);
      
    } catch (err) {
      setErreur('Erreur lors du chargement des données.');
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/activate?admin_id=${user.id}`, { method: 'PUT' });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, statut: 'ACTIF' } : u));
      }
    } catch (err) {
      alert('Erreur serveur.');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/deactivate?admin_id=${user.id}`, { method: 'PUT' });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, statut: 'INACTIF' } : u));
      }
    } catch (err) {
      alert('Erreur serveur.');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce trajet et toutes ses réservations associées ?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/trips/${id}?admin_id=${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setTrips(trips.filter(t => t.id !== id));
        fetchAllData(); // Recharger pour mettre à jour les stats
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur serveur.');
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  const filteredTrips = trips.filter(t => 
    t.depart.toLowerCase().includes(tripFilter.toLowerCase()) ||
    t.arrivee.toLowerCase().includes(tripFilter.toLowerCase()) ||
    t.conducteur_nom.toLowerCase().includes(tripFilter.toLowerCase())
  );

  const filteredReservations = reservations.filter(r => 
    r.passager_nom.toLowerCase().includes(resFilter.toLowerCase()) ||
    r.conducteur_nom.toLowerCase().includes(resFilter.toLowerCase()) ||
    r.depart.toLowerCase().includes(resFilter.toLowerCase()) ||
    r.statut.toLowerCase().includes(resFilter.toLowerCase())
  );

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px' }}>
      <div className="nav-bar">
        <div className="nav-logo">🔧 Espace Administrateur</div>
        <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>
          Retour au dashboard
        </Button>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {[
          { key: 'dashboard', label: 'Tableau de bord' },
          { key: 'trips', label: 'Trajets' },
          { key: 'reservations', label: 'Réservations' },
          { key: 'users', label: 'Utilisateurs' },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {chargement ? (
        <p>Chargement des données...</p>
      ) : (
        <>
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <h3>Statistiques Générales</h3>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
                <StatCard title="Trajets Totaux" value={stats.tripsCount} />
                <StatCard title="Trajets Actifs" value={stats.activeTripsCount} />
                <StatCard title="Réservations Totales" value={stats.reservationsCount} />
                <StatCard title="Réservations en Attente" value={stats.pendingReservationsCount} />
                <StatCard title="Réservations Acceptées" value={stats.acceptedReservationsCount} />
                <StatCard title="Réservations Annulées/Refusées" value={stats.rejectedReservationsCount} />
                <StatCard title="Total Utilisateurs" value={stats.usersCount} />
                <StatCard title="Conducteurs" value={stats.driversCount} />
                <StatCard title="Passagers" value={stats.passengersCount} />
              </div>
            </div>
          )}

          {/* TAB: TRAJETS */}
          {activeTab === 'trips' && (
            <div>
              <h3>Gestion des Trajets</h3>
              <input 
                type="text" 
                placeholder="Filtrer par ville ou conducteur..." 
                value={tripFilter} 
                onChange={e => setTripFilter(e.target.value)}
                style={{ padding: '8px', marginBottom: '15px', width: '100%', maxWidth: '300px' }}
              />
              <table style={tableStyle}>
                <thead>
                  <tr style={thStyle}>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Départ</th>
                    <th>Arrivée</th>
                    <th>Conducteur</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map(t => (
                    <tr key={t.id} style={trStyle}>
                      <td>{t.id}</td>
                      <td>{new Date(t.date).toLocaleDateString()} {t.heure}</td>
                      <td>{t.depart}</td>
                      <td>{t.arrivee}</td>
                      <td>{t.conducteur_nom}</td>
                      <td>{t.statut}</td>
                      <td style={{ display: 'flex', gap: '5px' }}>
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/trips/${t.id}`)}>
                          Détails
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteTrip(t.id)}>
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: RÉSERVATIONS */}
          {activeTab === 'reservations' && (
            <div>
              <h3>Gestion des Réservations</h3>
              <input 
                type="text" 
                placeholder="Filtrer par passager, conducteur, statut..." 
                value={resFilter} 
                onChange={e => setResFilter(e.target.value)}
                style={{ padding: '8px', marginBottom: '15px', width: '100%', maxWidth: '300px' }}
              />
              <table style={tableStyle}>
                <thead>
                  <tr style={thStyle}>
                    <th>ID</th>
                    <th>Date demande</th>
                    <th>Trajet</th>
                    <th>Passager</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map(r => (
                    <tr key={r.id} style={trStyle}>
                      <td>{r.id}</td>
                      <td>{new Date(r.date_reservation).toLocaleDateString()}</td>
                      <td>{r.depart} ➔ {r.arrivee}</td>
                      <td>{r.passager_nom}</td>
                      <td>{r.statut}</td>
                      <td>
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/reservations/${r.id}`)}>
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: UTILISATEURS */}
          {activeTab === 'users' && (
            <div>
              <h3>Gestion des Utilisateurs</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={thStyle}>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Courriel</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={trStyle}>
                      <td>{u.id}</td>
                      <td>{u.nom}</td>
                      <td>{u.courriel}</td>
                      <td>{u.role}</td>
                      <td>{u.statut}</td>
                      <td style={{ display: 'flex', gap: '5px' }}>
                        {u.id !== user.id && (
                          u.statut === 'INACTIF' ? (
                            <Button variant="success" size="sm" onClick={() => handleActivate(u.id)}>
                              Activer
                            </Button>
                          ) : (
                            <Button variant="danger" size="sm" onClick={() => handleDeactivate(u.id)}>
                              Désactiver
                            </Button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Composants de style utilitaires
const StatCard = ({ title, value }) => (
  <div style={{ flex: '1 1 200px', backgroundColor: '#e9ecef', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6c757d' }}>{title}</h4>
    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{value}</p>
  </div>
);

const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '14px' };
const thStyle = { backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' };
const trStyle = { borderBottom: '1px solid #dee2e6' };
