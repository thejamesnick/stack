import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'yellow' }> = ({ children, color = 'blue' }) => {
    const colors = {
        green: "bg-accent-green text-white",
        blue: "bg-brand-500 text-white",
        yellow: "bg-accent-yellow text-slate-900",
    };
    return (
        <span className={`${colors[color]} px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider`}>
            {children}
        </span>
    );
};
