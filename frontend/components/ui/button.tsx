import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, fullWidth, className, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 relative overflow-hidden border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    const variants = {
      primary: "relative px-8 py-2 font-semibold rounded-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-[0_0_12px_rgba(0,232,255,0.18)] hover:drop-shadow-[0_0_28px_rgba(0,232,255,0.32)]",
      secondary: "relative px-8 py-2 font-semibold rounded-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-400 drop-shadow-[0_0_12px_rgba(0,232,255,0.18)] hover:drop-shadow-[0_0_28px_rgba(0,232,255,0.32)]",
      danger: "bg-gradient-to-r from-[#ff3860] to-[#ff6b6b] text-white shadow-lg shadow-[#ff3860]/25 hover:shadow-xl hover:shadow-[#ff3860]/35 hover:-translate-y-0.5 active:translate-y-0",
      ghost: "relative px-8 py-2 bg-transparent border border-[rgba(255,255,255,0.06)] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 hover:shadow-[0_0_18px_rgba(0,232,255,0.3)] hover:scale-105 transition-transform duration-300",
      outline: "bg-gradient-to-r from-[#00ff9f] to-[#00d4ff] text-[var(--accent-primary)] border-2 border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:scale-105 transition-transform duration-300",
<<<<<<< HEAD
<<<<<<< HEAD
      inverse: "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9f] to-[#00d4ff] hover:shadow-[0_0_18px_rgba(0,232,255,0.2)] hover:scale-105 transition-transform duration-300"
=======
      close: "absolute top-4 right-0 p-2 left-100 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300 hover:scale-110 hover:transition-transform duration-500 text-white",
      link: "absolute transition-colors duration-300 hover:scale-110 hover:transition-transform duration-500 text-gray-400",
      linkselected: "absolute underline font-bold text-lg transition-colors duration-300 hover:scale-110 hover:transition-transform duration-500 text-white",
>>>>>>> 4da23b1 (feat: add Docker integration and environment configuration)
=======
      close: "absolute top-4 right-0 p-2 left-100 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300 hover:scale-110 hover:transition-transform duration-500 z-20 text-white",
      link: "absolute underline transition-colors duration-300 hover:scale-110 hover:transition-transform duration-500 z-20 text-white",
      linkselected: "absolute underline font-bold text-lg transition-colors duration-300 hover:scale-110 hover:transition-transform duration-500 z-20 text-cyan-400",
>>>>>>> c1c4440 (Revert "Backend lab entity fix")
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthClass} ${className || ''}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
