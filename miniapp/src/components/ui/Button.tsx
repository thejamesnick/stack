import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = "font-display font-bold uppercase tracking-wide transition-all transform active:translate-y-1 rounded-2xl flex items-center justify-center";

    const variants = {
        primary: "bg-brand-500 text-white hover:bg-brand-600 border-b-4 border-brand-900",
        secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 border-b-4 border-slate-300",
        danger: "bg-accent-red text-white hover:bg-accent-redDark border-b-4 border-red-900",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 border-none font-sans normal-case tracking-normal",
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
