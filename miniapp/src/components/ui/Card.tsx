import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
    <div
        className={`bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 ${className}`}
        onClick={onClick}
    >
        {children}
    </div>
);
