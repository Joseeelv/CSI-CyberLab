import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'critical' | 'glass';
  hoverable?: boolean;
  glowOnHover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = true, glowOnHover = true, className, children, ...props }, ref) => {
    const baseStyles = "relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm transition-all duration-300";
    
    const variants = {
      default: "bg-[var(--surface)] border border-[var(--border)]",
      success: "bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--accent-primary)] bg-gradient-to-r from-[rgba(0,255,159,0.05)] to-transparent",
      warning: "bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--accent-warning)] bg-gradient-to-r from-[rgba(255,179,71,0.05)] to-transparent",
      critical: "bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--accent-danger)] bg-gradient-to-r from-[rgba(255,56,96,0.05)] to-transparent",
      glass: "bg-[rgba(21,25,34,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-2xl"
    };
    
    const hoverStyles = hoverable 
      ? `hover:border-[var(--border-hover)] hover:-translate-y-1 ${glowOnHover ? 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(0,255,159,0.15)]' : 'hover:shadow-xl'}`
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className || ''} group`}
        {...props}
      >
        {/* Borde superior gradiente (se muestra en hover) */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-info)] to-[var(--accent-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 ${className || ''}`} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={`text-2xl font-bold text-[var(--text-primary)] tracking-tight ${className || ''}`} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={`text-sm text-[var(--text-secondary)] leading-relaxed ${className || ''}`} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`pt-4 ${className || ''}`} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`flex items-center pt-4 ${className || ''}`} {...props} />
);
