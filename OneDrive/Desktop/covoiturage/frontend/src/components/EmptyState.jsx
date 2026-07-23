import React from 'react';
import { css, useTheme } from '@emotion/react';

export default function EmptyState({ icon, title = 'Aucun résultat', description = 'Il n’y a rien à afficher pour le moment.', actionLabel, onAction }) {
  const theme = useTheme();

  return (
    <div css={css`
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:18px;
      padding:48px 24px;
      background:${theme.colors.surface};
      border:1px solid ${theme.colors.border};
      border-radius:${theme.radius};
      text-align:center;
      box-shadow:${theme.shadow};
      animation: fadeIn 0.35s ease;
    `}>
      <div css={css`
        width:92px;
        height:92px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        background: linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.surface2});
        color:${theme.colors.primary};
        font-size:2rem;
        box-shadow:${theme.shadowSm};
      `}>
        {icon || '☁️'}
      </div>
      <h3 css={css`margin:0; font-size:1.2rem; font-weight:700; color:${theme.colors.text};`}>{title}</h3>
      <p css={css`margin:0; max-width:420px; color:${theme.colors.textSecondary}; line-height:1.7;`}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          css={css`
            padding: 12px 20px;
            border-radius: ${theme.radius};
            border: 1px solid ${theme.colors.primary};
            background: ${theme.colors.primary};
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            transition: background ${theme.transition}, transform 0.15s ease;
            &:hover { background: ${theme.colors.primaryHover}; transform: translateY(-1px); }
          `}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
