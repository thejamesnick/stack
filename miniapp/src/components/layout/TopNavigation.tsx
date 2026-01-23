import React from 'react';
import { Coins, Bell } from 'lucide-react';
import { AuthenticatedUser } from '../../lib/auth/authenticate';
import { UserWallet } from '../../types';

interface TopNavigationProps {
    currentView: 'home' | 'history';
    setCurrentView: (view: 'home' | 'history') => void;
    onProfileClick: () => void;
    user: AuthenticatedUser | null;
    wallet: UserWallet | null;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
    currentView,
    setCurrentView,
    onProfileClick,
    user
}) => {
    return (
        <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-30">
            <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
                    <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-sm">
                        <Coins className="text-white w-6 h-6" />
                    </div>
                    <span className="font-display font-bold text-2xl text-slate-800 tracking-tight">Stack</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Desktop Tabs */}
                    <div className="hidden md:flex bg-slate-100 p-1 rounded-xl mr-2">
                        <button
                            onClick={() => setCurrentView('home')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${currentView === 'home' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setCurrentView('history')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${currentView === 'history' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            History
                        </button>
                    </div>

                    {/* Profile Pill Button */}
                    <button
                        onClick={onProfileClick}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-full p-1 sm:pr-4 transition-all shadow-sm hover:shadow-md active:scale-95 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg border border-slate-200">
                            {user?.pfpUrl ? (
                                <img src={user.pfpUrl} alt="PFP" className="w-full h-full rounded-full object-cover" />
                            ) : '🦊'}
                        </div>
                        <div className="flex flex-col items-start hidden sm:flex">
                            <span className="font-bold text-slate-800 text-xs leading-none group-hover:text-brand-600 transition-colors">
                                {user?.username || 'based_saver.eth'}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 leading-none mt-0.5">
                                FID: {user?.fid || 'Unknown'}
                            </span>
                        </div>
                    </button>

                    <div className="relative">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-brand-50 cursor-pointer transition-colors group">
                            <Bell className="w-5 h-5 text-slate-400 group-hover:text-brand-500" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
