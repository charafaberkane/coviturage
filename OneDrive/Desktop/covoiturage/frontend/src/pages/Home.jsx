import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css, useTheme } from '@emotion/react';
import Button from '../components/Button';
import Card from '../components/Card';
import { FiSearch, FiMapPin, FiClock, FiUsers, FiShield, FiTrendingUp, FiHeart } from 'react-icons/fi';

export default function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState({ depart: '', arrivee: '', date: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.depart) params.set('depart', search.depart);
    if (search.arrivee) params.set('arrivee', search.arrivee);
    if (search.date) params.set('date', search.date);
    navigate(`/trips/public?${params.toString()}`);
  };

  return (
    <div css={css`max-width: 1200px; margin: 0 auto; padding: 0 24px;`}>
      <section css={css`padding: 100px 0 72px;`}>
        <div css={css`display:grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items:center; @media (max-width: 950px) { grid-template-columns: 1fr; gap: 32px; }`}>
          <div>
            <span css={css`display:inline-flex; align-items:center; gap:10px; background:${theme.colors.primaryLight}; color:${theme.colors.primary}; padding:10px 16px; border-radius:999px; font-weight:700; font-size:0.9rem; margin-bottom:20px;`}>Nouveau</span>
            <h1 css={css`font-size:3.6rem; line-height:1.03; max-width:640px; margin-bottom:28px; color:${theme.colors.text};`}>Voyagez ensemble, simplement.</h1>
            <p css={css`font-size:1.05rem; color:${theme.colors.textSecondary}; max-width:600px; margin-bottom:34px; line-height:1.75;`}>Partagez vos trajets, économisez sur vos frais et faites des rencontres autour d'un covoiturage confortable et sécurisé.</p>

            <div css={css`display:flex; flex-wrap: wrap; gap:16px; margin-bottom:42px;`}>
              <Button variant="primary" size="lg" onClick={() => navigate('/trips/public')}>Rechercher un trajet</Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/trips')}>Proposer un trajet</Button>
            </div>

            <Card variant="outlined" style={{ padding: '24px', maxWidth: '760px' }}>
              <form onSubmit={handleSubmit} css={css`display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; @media (max-width: 760px) { grid-template-columns: 1fr; }`}>
                <div>
                  <label css={css`display:block; font-size:0.9rem; font-weight:600; margin-bottom:10px; color:${theme.colors.text};`}>Ville de départ</label>
                  <input
                    value={search.depart}
                    onChange={(e) => setSearch({ ...search, depart: e.target.value })}
                    placeholder="Ex: Ottawa"
                    css={css`width:100%; padding: 14px 18px; border-radius:${theme.radiusSm}; border:1.5px solid ${theme.colors.border}; background:${theme.colors.surface}; color:${theme.colors.text};`}
                  />
                </div>
                <div>
                  <label css={css`display:block; font-size:0.9rem; font-weight:600; margin-bottom:10px; color:${theme.colors.text};`}>Ville d'arrivée</label>
                  <input
                    value={search.arrivee}
                    onChange={(e) => setSearch({ ...search, arrivee: e.target.value })}
                    placeholder="Ex: Toronto"
                    css={css`width:100%; padding: 14px 18px; border-radius:${theme.radiusSm}; border:1.5px solid ${theme.colors.border}; background:${theme.colors.surface}; color:${theme.colors.text};`}
                  />
                </div>
                <div>
                  <label css={css`display:block; font-size:0.9rem; font-weight:600; margin-bottom:10px; color:${theme.colors.text};`}>Date</label>
                  <input
                    type="date"
                    value={search.date}
                    onChange={(e) => setSearch({ ...search, date: e.target.value })}
                    css={css`width:100%; padding: 14px 18px; border-radius:${theme.radiusSm}; border:1.5px solid ${theme.colors.border}; background:${theme.colors.surface}; color:${theme.colors.text};`}
                  />
                </div>
                <div css={css`grid-column: span 3; @media (max-width: 760px) { grid-column: span 1; }`}>
                  <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }} icon={<FiSearch />}>Rechercher un trajet</Button>
                </div>
              </form>
            </Card>
          </div>

          <div css={css`position:relative; min-height:520px; border-radius:${theme.radiusLg}; overflow:hidden; background: linear-gradient(180deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%); color:#fff;`}> 
            <div css={css`position:absolute; inset:0; opacity:0.24; background: radial-gradient(circle at top left, rgba(255,255,255,0.32), transparent 20%), radial-gradient(circle at bottom right, rgba(255,255,255,0.18), transparent 24%);`} />
            <div css={css`position:relative; display:grid; grid-template-columns: 1fr; gap: 18px; padding: 32px;`}> 
              <div css={css`max-width: 100%; border-radius:${theme.radius}; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); padding: 22px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);`}> 
                <div css={css`display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px;`}>
                  <div>
                    <p css={css`font-size:0.85rem; font-weight:700; margin-bottom:6px;`}>Trajets populaires</p>
                    <p css={css`font-size:0.9rem; color:rgba(255,255,255,0.85);`}>Les routes les plus demandées.</p>
                  </div>
                  <span css={css`background: rgba(255,255,255,0.15); color:#fff; padding: 8px 14px; border-radius:999px; font-size:0.8rem;`}>Top 3</span>
                </div>
                <div css={css`display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; @media (max-width: 680px) { grid-template-columns: 1fr; }`}>
                  {[
                    { depart: 'Paris', arrivee: 'Lyon', prix: '€25' },
                    { depart: 'Montréal', arrivee: 'Québec', prix: '€35' },
                    { depart: 'Toronto', arrivee: 'Ottawa', prix: '€28' },
                  ].map((route) => (
                    <div key={`${route.depart}-${route.arrivee}`} css={css`background: rgba(255,255,255,0.14); padding: 14px; border-radius:${theme.radius}; border: 1px solid rgba(255,255,255,0.08);`}>
                      <div css={css`font-size:0.95rem; font-weight:700; margin-bottom:10px;`}>{route.depart} → {route.arrivee}</div>
                      <div css={css`display:flex; justify-content:space-between; gap:8px; font-size:0.85rem; color:rgba(255,255,255,0.75);`}>
                        <span>15 Oct</span>
                        <span>{route.prix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div css={css`background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius:${theme.radiusLg}; padding: 28px;`}> 
                <div css={css`font-size:1.9rem; font-weight:800; margin-bottom:14px;`}>Covoiturage simplifié</div>
                <p css={css`color:rgba(255,255,255,0.82); margin-bottom:20px; line-height:1.7;`}>Trouver un trajet ou proposer le vôtre n’a jamais été aussi rapide. Suivez les réservations sur une interface claire et agréable.</p>
                <div css={css`display:grid; gap:12px;`}> 
                  <div css={css`display:flex; align-items:center; gap:10px;`}>
                    <div css={css`width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:12px; background: rgba(255,255,255,0.14);`}><FiMapPin /></div>
                    <div><strong>Plus de 500 trajets</strong><div css={css`font-size:0.9rem; color:rgba(255,255,255,0.75);`}>Chaque semaine sur la plateforme.</div></div>
                  </div>
                  <div css={css`display:flex; align-items:center; gap:10px;`}>
                    <div css={css`width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:12px; background: rgba(255,255,255,0.14);`}><FiClock /></div>
                    <div><strong>Réservation instantanée</strong><div css={css`font-size:0.9rem; color:rgba(255,255,255,0.75);`}>Suivez en temps réel vos trajets réservés.</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section css={css`padding: 0 0 80px;`}>
        <div css={css`display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; @media (max-width: 980px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (max-width: 640px) { grid-template-columns: 1fr; }`}>
          {[
            { icon: <FiTrendingUp size={20} />, title: 'Économique', description: 'Partagez vos frais et réduisez votre budget transport.' },
            { icon: <FiHeart size={20} />, title: 'Convivial', description: 'Une expérience simple pour conducteurs et passagers.' },
            { icon: <FiShield size={20} />, title: 'Sécurisé', description: 'Profils vérifiés et informations transparents.' },
            { icon: <FiUsers size={20} />, title: 'Écologique', description: 'Moins de voitures sur la route, moins d’émissions.' },
          ].map((item) => (
            <Card key={item.title} header={<div css={css`display:flex; align-items:center; gap:12px;`}><span css={css`width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:16px; background:${theme.colors.primaryLight}; color:${theme.colors.primary};`}>{item.icon}</span><span css={css`font-size:1rem; font-weight:700;`}>{item.title}</span></div>} style={{ padding: '24px' }}>
              <p css={css`color:${theme.colors.textSecondary}; line-height:1.8;`}>{item.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
