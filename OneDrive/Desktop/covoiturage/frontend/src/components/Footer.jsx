import React from 'react';
import { css, useTheme } from '@emotion/react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMail, FiPhone, FiHeart, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  const theme = useTheme();

  const footerStyle = css`
    background: ${theme.colors.surface};
    border-top: 1px solid ${theme.colors.border};
    padding: 56px 0 24px;
    margin-top: auto;
  `;

  const gridStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    @media (max-width: 900px) { grid-template-columns: 1fr 1fr; }
    @media (max-width: 640px) { grid-template-columns: 1fr; }
  `;

  const headingStyle = css`
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${theme.colors.textMuted};
    margin-bottom: 16px;
  `;

  const linkStyle = css`
    display: block;
    font-size: 0.9rem;
    color: ${theme.colors.textSecondary};
    margin-bottom: 10px;
    transition: color ${theme.transition};
    &:hover { color: ${theme.colors.primary}; }
  `;

  const dividerStyle = css`
    height: 1px;
    background: linear-gradient(90deg, transparent, ${theme.colors.primary}33, transparent);
    margin: 24px 0 0;
  `;

  const socialStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
  `;

  const socialIcon = css`
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.surface2};
    color: ${theme.colors.textSecondary};
    transition: transform ${theme.transition}, background ${theme.transition};
    &:hover { transform: translateY(-2px); background: ${theme.colors.primaryLight}; color: ${theme.colors.primary}; }
  `;

  const bottomStyle = css`
    max-width: 1200px;
    margin: 32px auto 0;
    padding: 20px 24px 0;
    border-top: 1px solid ${theme.colors.border};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 0.8rem;
    color: ${theme.colors.textMuted};
    @media (max-width: 480px) { justify-content: center; text-align: center; }
  `;

  return (
    <footer css={footerStyle}>
      <div css={gridStyle}>
        <div>
          <div css={css`display:flex; align-items:center; gap:10px; font-size:1.1rem; font-weight:800; color:${theme.colors.primary}; margin-bottom:14px;`}>
            <FiMapPin size={22} />
            La Cité Carpool
          </div>
          <p css={css`font-size:0.9rem; color:${theme.colors.textSecondary}; line-height:1.75; max-width:280px;`}>
            La plateforme de covoiturage pour la communauté étudiante du Collège La Cité.
          </p>
          <div css={css`display:flex; flex-direction:column; gap:8px; margin-top:18px;`}>
            <a href="mailto:carpool@lacite.on.ca" css={css`display:flex; align-items:center; gap:8px; font-size:0.85rem; color:${theme.colors.textSecondary}; transition:color ${theme.transition}; &:hover{color:${theme.colors.primary}};`}>
              <FiMail size={14} /> carpool@lacite.on.ca
            </a>
            <a href="tel:+1613000000" css={css`display:flex; align-items:center; gap:8px; font-size:0.85rem; color:${theme.colors.textSecondary}; transition:color ${theme.transition}; &:hover{color:${theme.colors.primary}};`}>
              <FiPhone size={14} /> +1 (613) 742-2483
            </a>
          </div>
        </div>

        <div>
          <p css={headingStyle}>Navigation</p>
          <Link to="/" css={linkStyle}>Accueil</Link>
          <Link to="/trips/public" css={linkStyle}>Trajets publics</Link>
          <Link to="/login" css={linkStyle}>Connexion</Link>
          <Link to="/register" css={linkStyle}>Inscription</Link>
        </div>

        <div>
          <p css={headingStyle}>Mon compte</p>
          <Link to="/dashboard" css={linkStyle}>Dashboard</Link>
          <Link to="/profile" css={linkStyle}>Profil</Link>
          <Link to="/trips" css={linkStyle}>Trajets privés</Link>
          <Link to="/reservations/passenger" css={linkStyle}>Réservations</Link>
        </div>

        <div>
          <p css={headingStyle}>Réseaux</p>
          <div css={socialStyle}>
            <a href="#" css={socialIcon} aria-label="Facebook"><FiFacebook /></a>
            <a href="#" css={socialIcon} aria-label="Instagram"><FiInstagram /></a>
            <a href="#" css={socialIcon} aria-label="Twitter"><FiTwitter /></a>
          </div>
          <div css={css`margin-top:18px;`}>
            <p css={css`font-size:0.9rem; color:${theme.colors.textSecondary}; line-height:1.7;`}>
              Trouvez, partagez et voyagez ensemble en toute confiance.
            </p>
          </div>
        </div>
      </div>
      <div css={dividerStyle} />
      <div css={bottomStyle}>
        <span>© {new Date().getFullYear()} La Cité Carpool. Tous droits réservés.</span>
        <span css={css`display:flex; align-items:center; gap:6px; justify-content:center;`}>
          Fait avec <FiHeart size={12} css={css`color:${theme.colors.danger};`} /> pour les étudiants
        </span>
      </div>
    </footer>
  );
}
