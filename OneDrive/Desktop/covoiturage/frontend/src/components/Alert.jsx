import React, { useEffect } from 'react';
import { css, useTheme } from '@emotion/react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const configs = {
  success: { icon: FiCheckCircle,   bgKey: 'successBg',  colorKey: 'success',  borderKey: 'success' },
  error:   { icon: FiAlertCircle,   bgKey: 'dangerBg',   colorKey: 'danger',   borderKey: 'danger'  },
  warning: { icon: FiAlertTriangle, bgKey: 'warningBg',  colorKey: 'warning',  borderKey: 'warning' },
  info:    { icon: FiInfo,          bgKey: 'infoBg',     colorKey: 'info',     borderKey: 'info' },
};

export default function Alert({ type = 'info', children, onClose, dismissAfter, style }) {
  const theme = useTheme();
  const cfg = configs[type] || configs.info;
  const Icon = cfg.icon;
  const color = theme.colors[cfg.colorKey];
  const bg    = theme.colors[cfg.bgKey];

  useEffect(() => {
    if (!dismissAfter || !onClose) return undefined;
    const timer = window.setTimeout(onClose, dismissAfter);
    return () => window.clearTimeout(timer);
  }, [dismissAfter, onClose]);

  const alertStyle = css`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    border-radius: ${theme.radiusSm};
    background: ${bg};
    border: 1px solid ${color}33;
    font-size: 0.92rem;
    font-weight: 500;
    color: ${color};
    margin-bottom: 18px;
    animation: slideIn 0.3s ease forwards;
  `;

  return (
    <div css={alertStyle} style={style} role="alert">
      <Icon size={18} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ flex: 1, lineHeight: 1.5 }}>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          css={css`
            background: none;
            border: none;
            cursor: pointer;
            color: ${color};
            padding: 0;
            display: flex;
            align-items: center;
            opacity: 0.75;
            transition: opacity ${theme.transition};
            &:hover { opacity: 1; }
          `}
          aria-label="Fermer"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
