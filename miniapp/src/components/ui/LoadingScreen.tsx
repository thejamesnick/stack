import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { Coins, House, Plus, History as HistoryIcon } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
            {/* Header Skeleton */}
            <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-sm">
                            <Coins className="text-white w-6 h-6" />
                        </div>
                        <span className="font-display font-bold text-2xl text-slate-800 tracking-tight">Stack</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Hero Balance Skeleton */}
                <section className="mb-8">
                    <div className="bg-brand-500 rounded-3xl p-6 text-white shadow-bubbly relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-brand-100 uppercase tracking-widest text-xs mb-1">Total Stacked</p>
                                <Skeleton className="w-40 h-10 md:h-12 rounded-lg bg-white/20" />
                            </div>
                        </div>
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute right-10 -bottom-10 w-24 h-24 bg-brand-900 opacity-20 rounded-full blur-xl"></div>
                    </div>
                </section>

                {/* Stacks Grid Skeleton - MATCHES REAL CARD SIZE */}
                <div>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="font-display font-bold text-2xl text-slate-800">Your Stacks</h3>
                        <div className="bg-slate-100 px-3 py-1 rounded-lg">
                            <Skeleton className="w-16 h-4 rounded-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1].map((i) => (
                            <div key={i} className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-5 relative">
                                {/* Progress bar placeholder */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 rounded-t-3xl" />

                                {/* Break button placeholder */}
                                <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-slate-200" />

                                {/* Emoji + Name section - matches real card */}
                                <div className="flex justify-between items-start mt-2 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[52px] h-[52px] bg-slate-50 rounded-2xl border border-slate-100" />
                                        <div className="space-y-1.5">
                                            <Skeleton className="w-28 h-5 rounded-lg" />
                                            <Skeleton className="w-24 h-3 rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Saved vs Goal section */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Saved So Far</p>
                                            <Skeleton className="w-24 h-7 rounded-lg" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Goal</p>
                                            <Skeleton className="w-20 h-5 rounded-lg ml-auto" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 pb-6">
                <button className="flex flex-col items-center gap-1 text-brand-500">
                    <House className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <div className="bg-brand-500 p-3 rounded-full -mt-8 shadow-bubbly border-4 border-white hover:scale-105 transition-transform active:scale-95">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <HistoryIcon className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">History</span>
                </button>
            </div>
        </div>
    );
};
