import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

const Card = ({
  title,
  subtitle,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="p-6 pb-0">
          {title && (
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={title || subtitle ? 'p-6 pt-0' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;