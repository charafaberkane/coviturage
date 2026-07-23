import React from 'react';
import { css, useTheme } from '@emotion/react';
import { FiMapPin, FiCalendar, FiClock, FiUser, FiUsers, FiArrowRight, FiDollarSign } from 'react-icons/fi';
import Button from './Button';

export default function TripCard({ trip, onReserve, onEdit, onDelete, currentUser, onDetails }) {
  const theme = useTheme();
  const isOwner = currentUser && trip.conducteur_id === currentUser.id;
  const isFull = trip.places_restantes <= 0;
  const canBook = currentUser && currentUser.role === 'PASSAGER' && !isOwner;
  const isGuest = !currentUser;
  const dateStr = trip.date ? trip.date.split('T')[0] : '';
  const heureStr = trip.heure ? trip.heure.substring(0, 5) : '';
  const prix = trip.prix ? `${trip.prix} $` : 'Gratuit';

  const cardStyle = css`
    position: relative;
    overflow: hidden;
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    box-shadow: ${theme.shadow};
    padding: 22px 24px 20px;
    transition: transform ${theme.transition}, box-shadow ${theme.transition};
    animation: fadeInUp 0.45s ease forwards;
    opacity: 0;
    &:hover {
      transform: translateY(-3px);
      box-shadow: ${theme.shadowLg};
      border-color: ${theme.colors.primaryMid};
    }
    &:before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 6px; height: 100%;
      background: linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.primaryHover});
    }
  `;

  const headerStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
  `;

  const routeStyle = css`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  `;

  const cityStyle = css`
    font-size: 1.05rem;
    font-weight: 700;
    color: ${theme.colors.text};
  `;

  const metaStyle = css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 18px;
    @media (max-width: 620px) { grid-template-columns: 1fr; }
  `;

  const metaItemStyle = css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: ${theme.colors.textSecondary};
    svg { color: ${theme.colors.primary}; flex-shrink: 0; }
  `;

  const footerStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid ${theme.colors.border};
    flex-wrap: wrap;
  `;

  const badgeStyle = (full) => css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: ${theme.radiusFull};
    font-size: 0.78rem;
    font-weight: 700;
    background: ${full ? theme.colors.dangerBg : theme.colors.successBg};
    color: ${full ? theme.colors.danger : theme.colors.success};
  `;

  return (
    <div css={cardStyle}>
      <div css={headerStyle}>
        <div css={routeStyle}>
          <FiMapPin size={16} />
          <span css={cityStyle}>{trip.depart}</span>
          <FiArrowRight size={18} />
          <span css={cityStyle}>{trip.arrivee}</span>
        </div>
        <div css={badgeStyle(isFull)}>{isFull ? 'Complet' : `${trip.places_restantes} place${trip.places_restantes > 1 ? 's' : ''}`}</div>
      </div>

      <div css={metaStyle}>
        <div css={metaItemStyle}><FiCalendar size={14} /> <span>{dateStr}</span></div>
        <div css={metaItemStyle}><FiClock size={14} /> <span>{heureStr}</span></div>
        <div css={metaItemStyle}><FiUser size={14} /> <span>{trip.conducteur_nom || 'Conducteur'}</span></div>
        <div css={metaItemStyle}><FiUsers size={14} /> <span>{trip.places_restantes}/{trip.places_totales} places</span></div>
      </div>

      <div css={footerStyle}>
        <div css={css`display:flex; align-items:center; gap:10px;`}>
          <div css={css`
            width: 36px; height: 36px;
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: ${theme.colors.primaryLight};
            color: ${theme.colors.primary};
            font-weight: 700;
          `}>{(trip.conducteur_nom || 'C')[0].toUpperCase()}</div>
          <div css={css`font-size:0.92rem; color:${theme.colors.textSecondary};`}><strong style={{ color: theme.colors.text }}>{trip.conducteur_nom || 'Conducteur'}</strong></div>
        </div>

        <div css={css`display:flex; align-items:center; gap:8px;`}> 
          <FiDollarSign size={16} css={css`color:${theme.colors.primary};`} />
          <span css={css`font-size:1.1rem; font-weight:800; color:${theme.colors.primary};`}>{prix}</span>
        </div>
      </div>

      <div css={css`margin-top:18px; display:flex; gap:10px; flex-wrap:wrap;`}>
        {onDetails && <Button variant="outline" size="sm" onClick={() => onDetails(trip)}>Détails</Button>}
        {isOwner ? (
          <>
            {onEdit && <Button variant="secondary" size="sm" onClick={() => onEdit(trip.id)}>Éditer</Button>}
            {onDelete && <Button variant="danger" size="sm" onClick={() => onDelete(trip.id)}>Annuler</Button>}
          </>
        ) : isGuest ? (
          <Button variant="primary" size="sm" onClick={() => onDetails?.(trip)}>Voir détails</Button>
        ) : canBook ? (
          <Button variant="primary" size="sm" disabled={isFull} onClick={() => onReserve?.(trip.id)}>{isFull ? 'Complet' : 'Réserver'}</Button>
        ) : null}
      </div>
    </div>
  );
}
