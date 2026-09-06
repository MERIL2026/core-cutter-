import React from 'react';
import { clsx } from 'clsx';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'default',
  ...props
}) => {
  return (
    <div
      className={clsx(
        'mx-auto w-full px-5 sm:px-6 md:px-8',
        {
          'max-w-7xl': size === 'default',
          'max-w-4xl': size === 'narrow',
          'max-w-[1400px]': size === 'wide',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
