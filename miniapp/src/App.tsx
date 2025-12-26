import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/Button';
import { CreateStackModal } from './components/features/CreateStackModal';
import { BreakStackModal } from './components/features/BreakStackModal';
import { ProfileModal } from './components/features/ProfileModal';
import { StackCard } from './components/features/StackCard';
import { SavingsStack, StackStatus, UserWallet } from './types';
import { Wallet, Coins, Settings, Bell, History as HistoryIcon, House, Plus } from 'lucide-react';
import { MOCK_WALLET, MOCK_STACKS } from './data/mock';


function App() {
    const [wallet, setWallet] = useState<UserWallet | null>(null);
    const [stacks, setStacks] = useState<SavingsStack[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [breakingStackId, setBreakingStackId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'home' | 'history'>('home');

    useEffect(() => {
        // Simulate initial data load
        setTimeout(() => {
            setWallet(MOCK_WALLET);
            setStacks(MOCK_STACKS);
        }, 500);
    }, []);

    const handleConnectWallet = () => {
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
            endDate: new Date().toISOString(), // In reality calc based on duration
            status: StackStatus.ACTIVE,
            asset: 'USDC',
            emoji: data.emoji
        };
        setStacks([newStack, ...stacks]);
        setShowCreateModal(false);
        setCurrentView('home'); // Switch to home to see new stack
    };

    const handleRequestBreak = (id: string) => {
        setBreakingStackId(id);
    };

    const handleConfirmBreak = () => {
        if (breakingStackId) {
            setStacks(stacks.map(s => s.id === breakingStackId ? { ...s, status: StackStatus.BROKEN } : s));
            setBreakingStackId(null);
            setCurrentView('history'); // Switch to history so user sees where the broken stack went
        }
    };

    if (!wallet) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-brand-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-bubbly transform rotate-3">
                    <Coins className="text-white w-12 h-12" />
                </div>
                <h1 className="font-display font-bold text-5xl text-slate-800 mb-4">Stack</h1>
                <p className="text-slate-500 text-lg max-w-md mb-10 font-medium">
                    The fun, automated way to build wealth on Base. Connect your wallet to start stacking today.
                </p>
                <Button size="lg" onClick={handleConnectWallet}>
                    Connect Wallet
                </Button>
                <div className="mt-12 flex gap-8 text-slate-400">
                    <span className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider"><Wallet className="w-4 h-4" /> Secure</span>
                    <span className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider"><Settings className="w-4 h-4" /> Automated</span>
                </div>
            </div>
        );
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
                    <>
                        {/* Hero Dashboard Section */}
                        <section className="mb-8">
                            <div className="bg-brand-500 rounded-3xl p-6 text-white shadow-bubbly relative overflow-hidden">
                                <div className="relative z-10 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-brand-100 uppercase tracking-widest text-xs mb-1">Total Stacked</p>
                                        <h2 className="font-display font-bold text-4xl md:text-5xl">${totalActiveSaved.toLocaleString()}</h2>
                                    </div>

                                    <div>
                                        <Button variant="secondary" onClick={() => setShowCreateModal(true)} className="border-none shadow-lg px-4 py-2 text-sm whitespace-nowrap">
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Stack
                                        </Button>
                                    </div>
                                </div>
                                {/* Decorative Circles */}
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                                <div className="absolute right-10 -bottom-10 w-24 h-24 bg-brand-900 opacity-20 rounded-full blur-xl"></div>
                            </div>
                        </section>

                        {/* Active Stacks Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display font-bold text-2xl text-slate-800">Your Stacks</h3>
                                <span className="font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg text-sm">{activeStacks.length} Active</span>
                            </div>

                            {activeStacks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activeStacks.map(stack => (
                                        <StackCard key={stack.id} stack={stack} onBreak={handleRequestBreak} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-slate-600">No active stacks</h3>
                                    <p className="text-slate-400 text-sm mb-6">Start saving for your next goal today!</p>
                                    <Button onClick={() => setShowCreateModal(true)} className="mx-auto">Create First Stack</Button>
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <>
                        {/* History Header */}
                        <section className="mb-6">
                            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
                                <div className="relative z-10 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-1">Lifetime Volume</p>
                                        <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-100">${totalLifetimeVolume.toLocaleString()}</h2>
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-xl">
                                        <History className="w-6 h-6 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* History List */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display font-bold text-2xl text-slate-800">History</h3>
                                <span className="font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg text-sm">{historyStacks.length} Past</span>
                            </div>

                            {historyStacks.length > 0 ? (
                                <div className="space-y-4">
                                    {historyStacks.map(stack => (
                                        <div key={stack.id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl bg-slate-50 p-2 rounded-xl">
                                                    {stack.emoji}
                                                </div>
                                                <div>
                                                    <h4 className="font-display font-bold text-slate-700">{stack.name}</h4>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stack.status}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">${stack.currentAmount.toLocaleString()}</p>
                                                <p className="text-xs text-slate-400">Target: ${stack.targetAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-400 font-medium">No completed or broken stacks yet.</p>
                                </div>
                            )}
                        </section>
                    </>
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
                    <History className="w-6 h-6" />
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
        </div>
    );
}

export default App;