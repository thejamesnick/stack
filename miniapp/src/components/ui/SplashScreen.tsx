import React from 'react';
import { Coins } from 'lucide-react';

export const SplashScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-brand-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-bubbly transform rotate-3">
                <Coins className="text-white w-12 h-12" />
            </div>
            <h1 className="font-display font-bold text-5xl text-slate-800 mb-4">Stack</h1>
            <p className="text-slate-500 text-lg max-w-md font-medium">
                The fun, automated way to save on Base.
            </p>
        </div>
    );
};
