import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({ children, className, hover = true, onClick, ...props }) => {
  const isMotionDiv = !!onClick;
  const Component = isMotionDiv ? motion.div : 'div';
  
  const baseProps = {
    className: cn(
      'bg-white rounded-xl border border-gray-200 shadow-sm',
      hover && 'hover:shadow-md transition-shadow duration-200',
      onClick && 'cursor-pointer',
      className
    ),
    onClick,
    ...props
  };

  const motionProps = isMotionDiv ? {
    whileHover: hover ? { y: -2 } : {},
    transition: { duration: 0.2 }
  } : {};
  
  return (
    <Component {...baseProps} {...motionProps}>
      {children}
    </Component>
  );
};

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

// Create CardBody as alias for CardContent for backward compatibility
export const CardBody = CardContent;

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
