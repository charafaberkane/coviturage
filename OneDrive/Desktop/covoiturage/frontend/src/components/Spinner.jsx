import React from 'react';
import { css, useTheme } from '@emotion/react';

const sizes = {
  sm: 16,
  md: 32,
  lg: 48,
};

export default function Spinner({ size = 'md', label = 'Chargement...', overlay = false }) {
  const theme = useTheme();
  const spinnerSize = sizes[size] || size;

  const spinnerStyle = css`
    width: ${spinnerSize}px;
    height: ${spinnerSize}px;
    position: relative;
  `;

  const ringStyle = css`
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    border: 3px solid ${theme.colors.border};
    border-radius: 50%;
    border-top-color: ${theme.colors.primary};
    animation: ring-spin 0.9s linear infinite;
  `;

  const overlayStyle = css`
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  `;

  return (
    <div css={overlay ? overlayStyle : css`display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:24px; color:${theme.colors.textMuted};`}>
      <div css={spinnerStyle}>
        <span css={ringStyle} />
      </div>
      {label && <p css={css`font-size:0.9rem; font-weight:500;`}>{label}</p>}
    </div>
  );
}
