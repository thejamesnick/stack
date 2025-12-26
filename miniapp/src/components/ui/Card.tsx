import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 ${className}`}>
        {children}
    </div>
);
