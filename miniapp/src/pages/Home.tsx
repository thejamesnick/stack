import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StackCard } from '../components/features/StackCard';
import { SavingsStack } from '../types';

interface HomeProps {
    totalActiveSaved: number;
    activeStacks: SavingsStack[];
    onOpenCreate: () => void;
    onRequestBreak: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({
    totalActiveSaved,
    activeStacks,
    onOpenCreate,
    onRequestBreak
}) => {
    return (
        <>
            {/* Hero Dashboard Section */}
            <section className="mb-8">
                <div className="bg-brand-500 rounded-3xl p-6 text-white shadow-bubbly relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-bold text-brand-100 uppercase tracking-widest text-xs mb-1">Total Stacked</p>
                            <h2 className="font-display font-bold text-4xl md:text-5xl">${totalActiveSaved.toLocaleString()}</h2>
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
                            <StackCard key={stack.id} stack={stack} onBreak={onRequestBreak} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-slate-600">No active stacks</h3>
                        <p className="text-slate-400 text-sm mb-6">Start saving for your next goal today!</p>
                        <Button onClick={onOpenCreate} className="mx-auto">Create First Stack</Button>
                    </div>
                )}
            </section>
        </>
    );
};
