import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'outline' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';
  
  const variants = {
    primary: 'bg-primary/10 border-primary/20 text-primary',
    secondary: 'bg-secondary/10 border-secondary/20 text-primary',
    accent: 'bg-accent/10 border-accent/20 text-accent',
    danger: 'bg-danger/10 border-danger/20 text-danger',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    slate: 'bg-slate-100 border-slate-200 text-slate-700',
    outline: 'border-slate-300 text-slate-700 bg-white'
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
