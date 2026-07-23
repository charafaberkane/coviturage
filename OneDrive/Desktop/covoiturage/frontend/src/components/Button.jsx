import React from 'react';
import { css, useTheme } from '@emotion/react';

const variants = {
  primary: (t) => css`
    background: ${t.colors.primary};
    color: #fff;
    border: none;
    &:hover:not(:disabled) { background: ${t.colors.primaryHover}; transform: translateY(-1px); box-shadow: 0 4px 14px ${t.colors.primary}40; }
    &:active:not(:disabled) { transform: translateY(0); }
  `,
  success: (t) => css`
    background: ${t.colors.success};
    color: #fff;
    border: none;
    &:hover:not(:disabled) { background: #13803d; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22,163,74,0.28); }
  `,
  secondary: (t) => css`
    background: ${t.colors.surface2};
    color: ${t.colors.text};
    border: 1px solid ${t.colors.border};
    &:hover:not(:disabled) { background: ${t.colors.border}; transform: translateY(-1px); }
  `,
  danger: (t) => css`
    background: ${t.colors.danger};
    color: #fff;
    border: none;
    &:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
  `,
  outline: (t) => css`
    background: transparent;
    color: ${t.colors.primary};
    border: 1.5px solid ${t.colors.primary};
    &:hover:not(:disabled) { background: ${t.colors.primaryLight}; transform: translateY(-1px); }
  `,
  ghost: (t) => css`
    background: transparent;
    color: ${t.colors.textSecondary};
    border: none;
    &:hover:not(:disabled) { background: ${t.colors.surface2}; color: ${t.colors.text}; }
  `,
};

const sizes = {
  sm: css`padding: 8px 14px; font-size: 0.82rem; border-radius: 10px;`,
  md: css`padding: 12px 22px; font-size: 0.92rem; border-radius: 12px;`,
  lg: css`padding: 14px 26px; font-size: 1rem; border-radius: 14px;`,
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  style,
}) {
  const theme = useTheme();

  const baseStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow ${theme.transition}, background ${theme.transition};
    ${fullWidth ? 'width: 100%;' : ''}
    &:active:not(:disabled) { transform: scale(0.98); }
    &:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
  `;

  const loadingStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  `;

  const dotStyle = css`
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: currentColor;
    animation: pulse 1s ease-in-out infinite;
    &:nth-of-type(2) { animation-delay: 0.15s; }
    &:nth-of-type(3) { animation-delay: 0.3s; }
    @keyframes pulse { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      css={[baseStyle, variants[variant]?.(theme) ?? variants.primary(theme), sizes[size] ?? sizes.md]}
      className={className}
      style={style}
    >
      {loading ? (
        <span css={loadingStyle}>
          <span css={dotStyle} />
          <span css={dotStyle} />
          <span css={dotStyle} />
        </span>
      ) : (
        <>
          {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
          {children}
          {iconRight && <span style={{ display: 'flex', alignItems: 'center' }}>{iconRight}</span>}
        </>
      )}
    </button>
  );
}
