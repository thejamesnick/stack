import React from 'react';
import { Button } from '../ui/Button';
import { SavingsStack, StackStatus, Frequency } from '../../types';
import { X, TrendingUp } from 'lucide-react';

interface StackDetailsModalProps {
    stack: SavingsStack;
    onClose: () => void;
    onBreak: () => void;
}

export function StackDetailsModal({ stack, onClose, onBreak }: StackDetailsModalProps) {
    const progress = Math.min((stack.currentAmount / stack.targetAmount) * 100, 100);

    // Calculate stats
    const totalPulls = Math.floor(stack.currentAmount / stack.amountPerPull);
    const estimatedYield = stack.currentAmount * 0.024; // 2.4% APY mock

    // Calculate CORRECT pulls remaining
    const remainingAmount = stack.targetAmount - stack.currentAmount;
    const pullsRemaining = Math.ceil(remainingAmount / stack.amountPerPull);

    // Convert frequency to days
    const frequencyInDays =
        stack.frequency === Frequency.DAILY ? 1 :
            stack.frequency === Frequency.WEEKLY ? 7 :
                30; // Monthly

    const daysLeft = pullsRemaining * frequencyInDays;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center p-6 pb-4">
                    <div className="text-6xl mb-3">{stack.emoji}</div>
                    <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">
                        {stack.name}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm">
                        {stack.frequency} • ${stack.amountPerPull} {stack.asset}
                    </p>
                </div>

                {/* Progress Section */}
                <div className="px-6 pb-6">
                    <div className="bg-slate-50 rounded-2xl p-5 mb-4">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                                    Saved
                                </p>
                                <p className="font-display font-bold text-3xl text-slate-800">
                                    ${stack.currentAmount.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                                    Goal
                                </p>
                                <p className="font-bold text-xl text-slate-600">
                                    ${stack.targetAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${stack.status === StackStatus.BROKEN
                                        ? 'bg-accent-red'
                                        : 'bg-gradient-to-r from-brand-500 to-purple-600'
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-center text-slate-500 text-sm font-semibold mt-2">
                            {progress.toFixed(0)}% Complete
                        </p>
                    </div>

                    {/* Compact Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <p className="text-slate-500 text-xs font-semibold mb-1">Pulls</p>
                            <p className="font-bold text-slate-800 text-lg">{totalPulls}</p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <p className="text-slate-500 text-xs font-semibold mb-1">
                                {stack.status === StackStatus.ACTIVE ? 'Left' : 'Status'}
                            </p>
                            <p className="font-bold text-slate-800 text-lg">
                                {stack.status === StackStatus.ACTIVE
                                    ? pullsRemaining > 0
                                        ? stack.frequency === Frequency.WEEKLY
                                            ? `${pullsRemaining}w`
                                            : stack.frequency === Frequency.MONTHLY
                                                ? `${pullsRemaining}m`
                                                : `${daysLeft}d`
                                        : '0'
                                    : stack.status === StackStatus.COMPLETED ? '✓' : '✗'
                                }
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-3 text-center">
                            <p className="text-green-600 text-xs font-semibold mb-1">Yield</p>
                            <p className="font-bold text-green-600 text-lg">+${estimatedYield.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {stack.status !== StackStatus.ACTIVE && (
                        <div className={`rounded-xl p-3 mb-4 text-center ${stack.status === StackStatus.COMPLETED
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                            <p className="font-semibold text-sm">
                                {stack.status === StackStatus.COMPLETED
                                    ? '🎉 Stack Completed!'
                                    : '⚠️ Stack Broken Early'
                                }
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        {stack.status === StackStatus.ACTIVE && (
                            <Button
                                onClick={onBreak}
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            >
                                Break Stack Early
                            </Button>
                        )}
                        <Button
                            onClick={onClose}
                            className="w-full"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
