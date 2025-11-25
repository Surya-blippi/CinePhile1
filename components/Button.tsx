import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    // Bold Yellow/Amber gradient with Black text
    primary: "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 shadow-xl shadow-yellow-400/30 hover:shadow-yellow-400/50 border border-transparent",
    
    // White background, hover turns slightly yellow
    secondary: "bg-white hover:bg-yellow-50 text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:border-yellow-200",
    
    // Transparent background, border only
    outline: "bg-transparent border-2 border-slate-300 text-slate-600 hover:border-yellow-500 hover:text-slate-900 hover:bg-yellow-50"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};