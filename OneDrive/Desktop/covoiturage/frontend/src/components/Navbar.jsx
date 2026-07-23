import React, { useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiSun, FiMoon, FiMenu, FiX, FiMapPin, FiLogIn, FiUserPlus, FiLogOut, FiGrid, FiChevronDown
} from 'react-icons/fi';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Trajets disponibles', href: '/trips/public' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const initials = user?.nom ? user.nom.split(' ').map((segment) => segment[0]).join('').slice(0, 2).toUpperCase() : 'UC';
  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navStyle = css`
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: 64px;
    background: ${theme.navbarBg};
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid ${theme.colors.border};
    transition: background ${theme.transition}, border-color ${theme.transition};
  `;

  const innerStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  `;

  const logoStyle = css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.2rem;
    font-weight: 800;
    color: ${theme.colors.primary};
    letter-spacing: -0.02em;
    text-decoration: none;
    flex-shrink: 0;
    span { color: ${theme.colors.text}; }
  `;

  const desktopLinksStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
    @media (max-width: 768px) { display: none; }
  `;

  const linkStyle = (active) => css`
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${active ? '#fff' : theme.colors.textSecondary};
    background: ${active ? theme.colors.primary : 'transparent'};
    transition: all ${theme.transition};
    text-decoration: none;
    &:hover { background: ${theme.colors.primary}; color: #fff; }
  `;

  const actionsStyle = css`
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  const iconBtnStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px; height: 38px;
    border-radius: 14px;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.surface};
    color: ${theme.colors.textSecondary};
    cursor: pointer;
    transition: all ${theme.transition};
    &:hover { background: ${theme.colors.primaryLight}; color: ${theme.colors.primary}; border-color: ${theme.colors.primaryMid}; }
  `;

  const ctaBtnStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    border: none;
    background: ${theme.colors.primary};
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, background ${theme.transition};
    text-decoration: none;
    &:hover { background: ${theme.colors.primaryHover}; transform: translateY(-1px); }
    @media (max-width: 768px) { display: none; }
  `;

  const ctaSecondaryStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, border-color ${theme.transition}, background ${theme.transition};
    text-decoration: none;
    &:hover { border-color: ${theme.colors.primary}; background: ${theme.colors.primaryLight}; }
    @media (max-width: 768px) { display: none; }
  `;

  const profileStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  `;

  const avatarStyle = css`
    width: 36px; height: 36px;
    border-radius: 16px;
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover});
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid ${theme.colors.border};
  `;

  const dropdownStyle = css`
    position: absolute;
    right: 0;
    top: 52px;
    min-width: 180px;
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    box-shadow: ${theme.shadowLg};
    overflow: hidden;
    z-index: 10;
  `;

  const dropdownItemStyle = css`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: ${theme.colors.text};
    text-align: left;
    cursor: pointer;
    transition: background ${theme.transition};
    &:hover { background: ${theme.colors.surface2}; }
  `;

  const mobileMenuStyle = css`
    position: fixed;
    top: 64px; left: 0; right: 0;
    background: ${theme.colors.surface};
    border-bottom: 1px solid ${theme.colors.border};
    padding: 18px 24px;
    display: ${menuOpen ? 'flex' : 'none'};
    flex-direction: column;
    gap: 12px;
    z-index: 99;
    animation: slideInDown 0.25s ease;
  `;

  const mobileNavLinkStyle = (active) => css`
    padding: 12px 16px;
    border-radius: ${theme.radius};
    font-size: 0.95rem;
    font-weight: 600;
    color: ${active ? theme.colors.primary : theme.colors.text};
    background: ${active ? theme.colors.primaryLight : 'transparent'};
    text-decoration: none;
    transition: all ${theme.transition};
    &:hover { background: ${theme.colors.primaryLight}; }
  `;

  return (
    <>
      <nav css={navStyle}>
        <div css={innerStyle}>
          <Link to="/" css={logoStyle}>
            <FiMapPin size={22} />
            La Cité <span>Covoiturage</span>
          </Link>

          <div css={desktopLinksStyle}>
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} css={linkStyle(isActive(link.href))}>
                {link.label}
              </Link>
            ))}
          </div>

          <div css={actionsStyle}>
            <button css={iconBtnStyle} onClick={theme.toggleDark} aria-label="Basculer le mode sombre">
              {theme.isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {user ? (
              <div css={profileStyle}>
                <button css={avatarStyle} onClick={() => setDropdownOpen((open) => !open)}>
                  {initials}
                  <FiChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div css={dropdownStyle}>
                    <button css={dropdownItemStyle} onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }}>
                      <FiGrid size={16} /> Tableau de bord
                    </button>
                    <button css={dropdownItemStyle} onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                      <FiUserPlus size={16} /> Profil
                    </button>
                    <button css={dropdownItemStyle} onClick={handleLogout}>
                      <FiLogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" css={ctaSecondaryStyle}>
                  <FiLogIn size={16} /> Connexion
                </Link>
                <Link to="/register" css={ctaBtnStyle}>
                  <FiUserPlus size={16} /> Inscription
                </Link>
              </>
            )}

            <button
              css={css`${iconBtnStyle}; @media (min-width: 769px) { display: none; }`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <div css={mobileMenuStyle}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            css={mobileNavLinkStyle(isActive(link.href))}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            <Link to="/dashboard" css={mobileNavLinkStyle(isActive('/dashboard'))} onClick={() => setMenuOpen(false)}>
              Tableau de bord
            </Link>
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              css={css`
                ${mobileNavLinkStyle(false)};
                width: 100%;
                background: none;
                border: none;
                color: ${theme.colors.danger};
                text-align: left;
                cursor: pointer;
              `}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" css={mobileNavLinkStyle(isActive('/login'))} onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
            <Link to="/register" css={mobileNavLinkStyle(isActive('/register'))} onClick={() => setMenuOpen(false)}>
              Inscription
            </Link>
          </>
        )}
      </div>
    </>
  );
}
