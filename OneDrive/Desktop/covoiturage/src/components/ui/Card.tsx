import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`bg-white border border-border rounded-2xl p-5 shadow-premium transition-all duration-300 ${
        hoverable ? 'hover:-translate-y-1 hover:shadow-premium-hover cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return <div className={`flex flex-col gap-1.5 pb-4 mb-4 border-b border-slate-100 ${className}`} {...props}>{children}</div>;
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return <div className={`text-sm text-text/80 leading-relaxed ${className}`} {...props}>{children}</div>;
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return <div className={`flex items-center justify-between pt-4 mt-4 border-t border-slate-100 ${className}`} {...props}>{children}</div>;
};
