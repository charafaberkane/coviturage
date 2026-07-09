import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary focus:ring-primary shadow-sm hover:shadow',
    secondary: 'bg-secondary/10 text-primary hover:bg-secondary/20 focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-sm hover:shadow',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger shadow-sm hover:shadow',
    outline: 'border border-border bg-white text-text hover:bg-background focus:ring-primary',
    ghost: 'text-text hover:bg-background focus:ring-slate-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      {...(props as any)}
    >
      {isLoading && <Spinner size="sm" className="text-current" />}
      {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </motion.button>
  );
};
