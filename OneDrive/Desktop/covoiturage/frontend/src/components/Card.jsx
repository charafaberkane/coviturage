import React from 'react';
import { css, useTheme } from '@emotion/react';

export default function Card({
  children,
  header,
  footer,
  variant = 'default',
  style,
  padding = '24px',
  className = '',
}) {
  const theme = useTheme();

  const background = variant === 'gradient'
    ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`
    : theme.colors.surface;
  const border = variant === 'outlined' ? `1px solid ${theme.colors.border}` : '1px solid transparent';
  const color = variant === 'gradient' ? '#fff' : theme.colors.text;

  const cardStyle = css`
    background: ${background};
    color: ${color};
    border-radius: ${theme.radius};
    border: ${border};
    box-shadow: ${theme.shadowMd};
    padding: ${padding};
    position: relative;
    overflow: hidden;
    transition: transform ${theme.transition}, box-shadow ${theme.transition};
    animation: fadeInUp 0.45s ease forwards;
    opacity: 0;
    &:hover { transform: translateY(-3px); box-shadow: ${theme.shadowLg}; }
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      background: ${variant === 'gradient' ? 'rgba(255,255,255,0.08)' : 'transparent'};
      pointer-events: none;
    }
  `;

  const headerStyle = css`
    margin-bottom: 16px;
    font-size: 1rem;
    font-weight: 700;
  `;

  const footerStyle = css`
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid ${theme.colors.border};
  `;

  return (
    <div css={cardStyle} style={style} className={className}>
      {header && <div css={headerStyle}>{header}</div>}
      {children}
      {footer && <div css={footerStyle}>{footer}</div>}
    </div>
  );
}
