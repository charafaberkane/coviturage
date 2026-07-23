import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { css, useTheme } from '@emotion/react';
import TripCard from '../components/TripCard';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';

export default function PublicTrips() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ depart: '', arrivee: '', date: '' });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserJson = localStorage.getItem('user');
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

  useEffect(() => {
    setFilters({
      depart: searchParams.get('depart') || '',
      arrivee: searchParams.get('arrivee') || '',
      date: searchParams.get('date') || '',
    });
  }, [searchParams]);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    let url = 'http://localhost:5000/api/trips';
    const params = new URLSearchParams();
    if (filters.depart) params.set('depart', filters.depart);
    if (filters.arrivee) params.set('arrivee', filters.arrivee);
    if (filters.date) params.set('date', filters.date);
    const query = params.toString();
    if (query) url += `?${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de récupérer les trajets.');
      setTrips(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [filters.depart, filters.arrivee, filters.date]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrips();
  };

  const openTrip = (trip) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/trips/edit/${trip.id}`);
  };

  return (
    <div css={css`max-width: 1200px; margin: 0 auto; padding: 0 24px;`}>
      <div css={css`display:flex; justify-content:space-between; align-items:flex-end; gap:20px; flex-wrap:wrap; margin-bottom:28px;`}>
        <div>
          <p css={css`font-size:0.9rem; color:${theme.colors.primary}; font-weight:700; margin-bottom:10px;`}>Trajets publics</p>
          <h2 css={css`font-size:2.25rem; margin:0; color:${theme.colors.text};`}>Trouvez un trajet pour votre prochain voyage.</h2>
          <p css={css`color:${theme.colors.textSecondary}; margin-top:10px; max-width:620px; line-height:1.7;`}>Filtrez par départ, destination et date, puis consultez immédiatement les trajets disponibles.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/trips')} size="md">Proposer un trajet</Button>
      </div>

      <Card style={{ padding: '22px 22px 18px', marginBottom: '32px' }}>
        <form onSubmit={handleSearch} css={css`display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; align-items:flex-end; @media (max-width: 860px) { grid-template-columns: 1fr; }`}>
          <div>
            <label css={css`font-size:0.85rem; font-weight:700; color:${theme.colors.text}; display:block; margin-bottom:8px;`}>Départ</label>
            <input value={filters.depart} onChange={(e) => setFilters({ ...filters, depart: e.target.value })} placeholder="Ex: Ottawa" css={css`width:100%; padding:14px 16px; border-radius:${theme.radiusSm}; border:1.5px solid ${theme.colors.border}; background:${theme.colors.surface}; color:${theme.colors.text};`} />
          </div>
          <div>
            <label css={css`font-size:0.85rem; font-weight:700; color:${theme.colors.text}; display:block; margin-bottom:8px;`}>Destination</label>
            <input value={filters.arrivee} onChange={(e) => setFilters({ ...filters, arrivee: e.target.value })} placeholder="Ex: Toronto" css={css`width:100%; padding:14px 16px; border-radius:${theme.radiusSm}; border:1.5px solid ${theme.colors.border}; background:${theme.colors.surface}; color:${theme.colors.text};`} />
          </div>
          <div>
            <label css={css`font-size:0.85rem; font-weight:700; color:${theme.colors.text}; display:block; margin-bottom:8px;`}>Date</label>
            <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} css={css`width:100%; padding:14px 16px; border-radius:${theme.radiusSm}; border:1.5px solid ${theme.colors.border}; background:${theme.colors.surface}; color:${theme.colors.text};`} />
          </div>
          <div css={css`display:flex; align-items:center; justify-content:flex-end; @media (max-width: 860px) { justify-content: flex-start; }`}>
            <Button type="submit" variant="primary" size="md">Rechercher</Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <Spinner size="lg" label="Chargement des trajets publics..." />
      ) : error ? (
        <div css={css`color:${theme.colors.danger}; font-weight:600; margin-bottom:24px;`}>{error}</div>
      ) : trips.length === 0 ? (
        <EmptyState
          title="Aucun trajet trouvé"
          description="Essayez d’ajuster vos critères de recherche ou revenez plus tard pour de nouvelles offres."
          actionLabel="Voir tous les trajets"
          onAction={() => navigate('/trips/public')}
        />
      ) : (
        <div css={css`display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; @media (max-width: 980px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (max-width: 700px) { grid-template-columns: 1fr; }`}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              currentUser={currentUser}
              onDetails={openTrip}
              onReserve={() => navigate('/login')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
