import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  padding = 'md',
  shadow = 'md',
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
