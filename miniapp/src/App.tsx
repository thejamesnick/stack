import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/Button';
import { CreateStackModal } from './components/features/CreateStackModal';
import { BreakStackModal } from './components/features/BreakStackModal';
import { ProfileModal } from './components/features/ProfileModal';
import { ShareSuccessModal } from './components/features/ShareSuccessModal';
import { StackCard } from './components/features/StackCard';
import { SavingsStack, StackStatus, UserWallet } from './types';
import { Wallet, Coins, Settings, Bell, History as HistoryIcon, House, Plus } from 'lucide-react';
import { MOCK_WALLET, MOCK_STACKS } from './data/mock';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Onboarding } from './components/features/Onboarding';
import { LoadingScreen } from './components/ui/LoadingScreen';

function App() {
    const [wallet, setWallet] = useState<UserWallet | null>(null);
    const [stacks, setStacks] = useState<SavingsStack[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [newlyCreatedStack, setNewlyCreatedStack] = useState<SavingsStack | null>(null);
    const [breakingStackId, setBreakingStackId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'home' | 'history'>('home');

    const [splashVisible, setSplashVisible] = useState(true);

    const [hasOnboarded, setHasOnboarded] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('stack_has_onboarded') === 'true';
        }
        return false;
    });

    // Simulate loading stacks data separately from auth
    useEffect(() => {
        setStacks(MOCK_STACKS);
    }, []);

    // Auto-connect flow for returning users
    useEffect(() => {
        if (hasOnboarded && !wallet) {
            // Show splash for 2.5s
            const splashTimer = setTimeout(() => {
                setSplashVisible(false);

                // Then show skeleton/loading for a bit before "connecting"
                const connectTimer = setTimeout(() => {
                    setWallet(MOCK_WALLET);
                }, 1000); // 1s of skeleton loading after splash

                return () => clearTimeout(connectTimer);
            }, 2500);

            return () => clearTimeout(splashTimer);
        } else if (!hasOnboarded) {
            // If not onboarded, hide splash immediately to show onboarding
            setSplashVisible(false);
        }
    }, [hasOnboarded, wallet]);

    const handleConnectWallet = () => {
        setWallet(MOCK_WALLET);
    };

    const handleOnboardingComplete = () => {
        localStorage.setItem('stack_has_onboarded', 'true');
        setHasOnboarded(true);
        setWallet(MOCK_WALLET);
    };

    const handleCreateStack = (data: any) => {
        const newStack: SavingsStack = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name,
            targetAmount: data.targetAmount,
            currentAmount: 0,
            frequency: data.frequency,
            amountPerPull: data.amountPerPull,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            status: StackStatus.ACTIVE,
            asset: 'USDC',
            emoji: data.emoji
        };
        setStacks([newStack, ...stacks]);
        setShowCreateModal(false);

        // Show share modal after creating stack
        setNewlyCreatedStack(newStack);
        setShowShareModal(true);

        setCurrentView('home');
    };

    const handleRequestBreak = (id: string) => {
        setBreakingStackId(id);
    };

    const handleConfirmBreak = () => {
        if (breakingStackId) {
            setStacks(stacks.map(s => s.id === breakingStackId ? { ...s, status: StackStatus.BROKEN } : s));
            setBreakingStackId(null);
            setCurrentView('history');
        }
    };

    if (!wallet) {
        if (!hasOnboarded) {
            // If they haven't onboarded, show onboarding (which handles its own flow)
            // But we created a logic above where splashVisible starts true. 
            // We should ensure onboarding users don't see brief splash or just show onboarding.
            // My effect updates splashVisible to false immediately if !hasOnboarded.
            // But react might render once with splashVisible=true.
            // Let's rely on the effect.
            // Ideally we Check if hasOnboarded is false, we want Onboarding immediately.
            return <Onboarding onComplete={handleOnboardingComplete} />;
        }

        if (splashVisible) {
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
        }

        return <LoadingScreen />;
    }

    const activeStacks = stacks.filter(s => s.status === StackStatus.ACTIVE);
    const historyStacks = stacks.filter(s => s.status !== StackStatus.ACTIVE);

    // Total currently active savings
    const totalActiveSaved = activeStacks.reduce((acc, curr) => acc + curr.currentAmount, 0);
    // Total lifetime volume (for history view)
    const totalLifetimeVolume = historyStacks.reduce((acc, curr) => acc + curr.currentAmount, 0);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
            {/* Top Navigation */}
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
                            onClick={() => setShowProfileModal(true)}
                            className="flex items-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-full pl-1 pr-4 py-1 transition-all shadow-sm hover:shadow-md active:scale-95 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                🦊
                            </div>
                            <div className="flex flex-col items-start hidden sm:flex">
                                <span className="font-bold text-slate-800 text-xs leading-none group-hover:text-brand-600 transition-colors">based_saver.eth</span>
                                <span className="font-mono text-[10px] text-slate-400 leading-none mt-0.5">{wallet.address?.slice(0, 6)}...</span>
                            </div>
                        </button>

                        <div className="relative">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-brand-50 cursor-pointer transition-colors group">
                                <Bell className="w-5 h-5 text-slate-400 group-hover:text-brand-500" />
                            </div>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-accent-red rounded-full border-2 border-white"></span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {currentView === 'home' ? (
                    <Home
                        totalActiveSaved={totalActiveSaved}
                        activeStacks={activeStacks}
                        onOpenCreate={() => setShowCreateModal(true)}
                        onRequestBreak={handleRequestBreak}
                    />
                ) : (
                    <History
                        totalLifetimeVolume={totalLifetimeVolume}
                        historyStacks={historyStacks}
                    />
                )}
            </main>

            {/* Mobile Bottom Nav */}
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
                    onClick={() => setShowCreateModal(true)}
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

            {showCreateModal && (
                <CreateStackModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateStack}
                    userBalance={wallet.balance}
                />
            )}

            {breakingStackId && (
                <BreakStackModal
                    stack={stacks.find(s => s.id === breakingStackId)!}
                    onClose={() => setBreakingStackId(null)}
                    onConfirm={handleConfirmBreak}
                />
            )}

            {showProfileModal && wallet && (
                <ProfileModal
                    wallet={wallet}
                    onClose={() => setShowProfileModal(false)}
                    stats={{
                        totalSaved: totalActiveSaved + totalLifetimeVolume,
                        activeStacks: activeStacks.length,
                        completedStacks: historyStacks.filter(s => s.status === StackStatus.COMPLETED).length
                    }}
                />
            )}

            {showShareModal && newlyCreatedStack && (
                <ShareSuccessModal
                    isOpen={showShareModal}
                    onClose={() => {
                        setShowShareModal(false);
                        setNewlyCreatedStack(null);
                    }}
                    stack={newlyCreatedStack}
                    platform="farcaster"
                />
            )}
        </div>
    );
}

export default App;