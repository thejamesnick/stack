import React from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { SavingsStack } from '../types';

interface HistoryProps {
    totalLifetimeVolume: number;
    historyStacks: SavingsStack[];
}

export const History: React.FC<HistoryProps> = ({ totalLifetimeVolume, historyStacks }) => {
    return (
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
                            <HistoryIcon className="w-6 h-6 text-slate-400" />
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
    );
};
