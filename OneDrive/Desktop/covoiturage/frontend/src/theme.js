import { css } from '@emotion/react';

/* ─── Design Tokens ─── */
export const lightTheme = {
  colors: {
    primary:        '#2563EB',
    primaryHover:   '#1d4ed8',
    primaryLight:   '#eff6ff',
    primaryMid:     '#bfdbfe',
    primaryDark:    '#1e40af',
    background:     '#f8fafc',
    surface:        '#ffffff',
    surface2:       '#f1f5f9',
    surface3:       '#e2e8f0',
    text:           '#0f172a',
    textSecondary:  '#475569',
    textMuted:      '#94a3b8',
    textInverse:    '#ffffff',
    border:         '#e2e8f0',
    borderStrong:   '#cbd5e1',
    danger:         '#dc2626',
    dangerBg:       '#fef2f2',
    dangerBorder:   '#fecaca',
    success:        '#16a34a',
    successBg:      '#f0fdf4',
    successBorder:  '#bbf7d0',
    warning:        '#d97706',
    warningBg:      '#fffbeb',
    warningBorder:  '#fde68a',
    info:           '#0891b2',
    infoBg:         '#ecfeff',
    infoBorder:     '#a5f3fc',
    cardBackground: '#ffffff',
    muted:          '#6c757d',
  },
  spacing:    '8px',
  radius:     '12px',
  radiusSm:   '6px',
  radiusLg:   '16px',
  radiusXl:   '24px',
  radiusFull: '9999px',
  transition: '0.2s ease',
  transitionFast: '0.15s ease',
  transitionSlow: '0.35s ease',
  shadow:     '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
  shadowSm:   '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd:   '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
  shadowLg:   '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
  shadowXl:   '0 25px 50px -12px rgba(0,0,0,0.15)',
  shadowPrimary: '0 4px 14px 0 rgba(37,99,235,0.35)',
  gradient:   'linear-gradient(135deg, #2563EB, #0ea5e9)',
  gradientHero: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 40%, #0ea5e9 100%)',
  gradientCard: 'linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)',
  navbarBg:   'rgba(255,255,255,0.85)',
};

export const darkTheme = {
  colors: {
    primary:        '#3b82f6',
    primaryHover:   '#2563EB',
    primaryLight:   '#1e3a5f',
    primaryMid:     '#2563eb44',
    primaryDark:    '#60a5fa',
    background:     '#0f172a',
    surface:        '#1e293b',
    surface2:       '#334155',
    surface3:       '#475569',
    text:           '#f1f5f9',
    textSecondary:  '#94a3b8',
    textMuted:      '#64748b',
    textInverse:    '#0f172a',
    border:         '#334155',
    borderStrong:   '#475569',
    danger:         '#f87171',
    dangerBg:       '#450a0a',
    dangerBorder:   '#7f1d1d',
    success:        '#4ade80',
    successBg:      '#052e16',
    successBorder:  '#166534',
    warning:        '#fbbf24',
    warningBg:      '#451a03',
    warningBorder:  '#78350f',
    info:           '#22d3ee',
    infoBg:         '#083344',
    infoBorder:     '#155e75',
    cardBackground: '#1e293b',
    muted:          '#94a3b8',
  },
  spacing:    '8px',
  radius:     '12px',
  radiusSm:   '6px',
  radiusLg:   '16px',
  radiusXl:   '24px',
  radiusFull: '9999px',
  transition: '0.2s ease',
  transitionFast: '0.15s ease',
  transitionSlow: '0.35s ease',
  shadow:     '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.2)',
  shadowSm:   '0 1px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)',
  shadowMd:   '0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.3)',
  shadowLg:   '0 20px 25px -5px rgba(0,0,0,0.35), 0 8px 10px -6px rgba(0,0,0,0.25)',
  shadowXl:   '0 25px 50px -12px rgba(0,0,0,0.5)',
  shadowPrimary: '0 4px 14px 0 rgba(59,130,246,0.4)',
  gradient:   'linear-gradient(135deg, #3b82f6, #0ea5e9)',
  gradientHero: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)',
  gradientCard: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
  navbarBg:   'rgba(15,23,42,0.85)',
};

/* ─── Dark Mode Hook ─── */
export const useDarkMode = () => {
  const isDark = (() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  })();

  const setDark = (value) => {
    const theme = value ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return { isDark, setDark };
};

/* ─── Global Emotion Styles ─── */
export const globalStyles = (theme) => css`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
    transition: background ${theme.transition}, color ${theme.transition};
  }
  a { text-decoration: none; color: inherit; }
  img { max-width: 100%; height: auto; }
  button { font-family: inherit; }
`;
