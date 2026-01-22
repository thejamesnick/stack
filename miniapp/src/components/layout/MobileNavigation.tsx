import React from 'react';
import { House, Plus, History as HistoryIcon } from 'lucide-react';

interface MobileNavigationProps {
    currentView: 'home' | 'history';
    setCurrentView: (view: 'home' | 'history') => void;
    onCreateClick: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
    currentView,
    setCurrentView,
    onCreateClick
}) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 pb-6">
            <button
                className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-brand-500' : 'text-slate-400'}`}
                onClick={() => setCurrentView('home')}
            >
                <House className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase">Home</span>
            </button>
            <button
                className="flex flex-col items-center gap-1 text-slate-400"
                onClick={onCreateClick}
            >
                <div className="bg-brand-500 p-3 rounded-full -mt-8 shadow-bubbly border-4 border-white hover:scale-105 transition-transform active:scale-95">
                    <Plus className="w-6 h-6 text-white" />
                </div>
            </button>
            <button
                className={`flex flex-col items-center gap-1 ${currentView === 'history' ? 'text-brand-500' : 'text-slate-400'}`}
                onClick={() => setCurrentView('history')}
            >
                <HistoryIcon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase">History</span>
            </button>
        </div>
    );
};
