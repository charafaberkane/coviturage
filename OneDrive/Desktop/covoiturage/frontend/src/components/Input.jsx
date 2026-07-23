import React from 'react';
import { css, useTheme } from '@emotion/react';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  icon,
  error,
  required = false,
  disabled = false,
  autoComplete,
  min,
  step,
  options,
  multiline = false,
  floatingLabel = false,
  rows = 4,
  className = '',
  style,
}) {
  const theme = useTheme();

  const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 18px;
    position: relative;
  `;

  const labelStyle = css`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${theme.colors.text};
    transition: all ${theme.transition};
  `;

  const floatingLabelStyle = css`
    position: absolute;
    top: 14px;
    left: ${icon ? '46px' : '16px'};
    font-size: 0.95rem;
    color: ${theme.colors.textMuted};
    pointer-events: none;
    transition: transform ${theme.transition}, font-size ${theme.transition}, color ${theme.transition};
    transform-origin: left top;
  `;

  const fieldStyle = css`
    width: 100%;
    min-height: ${multiline ? '120px' : '48px'};
    padding: ${icon ? '18px 14px 12px 46px' : '18px 14px 12px'};
    border: 1.5px solid ${error ? theme.colors.danger : theme.colors.border};
    border-radius: ${theme.radiusSm};
    font-size: 0.95rem;
    font-family: 'Inter', sans-serif;
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
    transition: border-color ${theme.transition}, box-shadow ${theme.transition};
    outline: none;

    &::placeholder { color: transparent; }
    &:focus { border-color: ${error ? theme.colors.danger : theme.colors.primary}; box-shadow: 0 0 0 3px ${error ? theme.colors.danger + '22' : theme.colors.primary + '22'}; }
  `;

  const inputWrapperStyle = css`
    position: relative;
    display: flex;
    align-items: center;
  `;

  const iconStyle = css`
    position: absolute;
    left: 14px;
    color: ${theme.colors.textMuted};
    display: flex;
    align-items: center;
    pointer-events: none;
    font-size: 18px;
  `;

  const errorStyle = css`
    font-size: 0.82rem;
    color: ${theme.colors.danger};
    display: flex;
    align-items: center;
    gap: 6px;
  `;

  const hasValue = value !== undefined && value !== '';
  const renderLabel = floatingLabel ? (
    <label css={css`${floatingLabelStyle}; transform: ${hasValue ? 'translateY(-34px) scale(0.9)' : 'translateY(0)'}; color: ${hasValue ? theme.colors.primary : theme.colors.textMuted};`} htmlFor={name}>
      {label}{required ? ' *' : ''}
    </label>
  ) : (
    label && (
      <label css={labelStyle} htmlFor={name}>
        {label}{required && <span style={{ color: theme.colors.danger }}> *</span>}
      </label>
    )
  );

  return (
    <div css={wrapperStyle} className={className} style={style}>
      {!floatingLabel && renderLabel}
      <div css={inputWrapperStyle}>
        {icon && <span css={iconStyle}>{icon}</span>}
        {options ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            css={fieldStyle}
          >
            <option value="">{placeholder || 'Sélectionner'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            css={fieldStyle}
          />
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={floatingLabel ? ' ' : placeholder}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            min={min}
            step={step}
            css={fieldStyle}
          />
        )}
      </div>
      {renderLabel}
      {error && <span css={errorStyle}>⚠ {error}</span>}
    </div>
  );
}
