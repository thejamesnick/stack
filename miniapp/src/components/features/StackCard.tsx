import React from 'react';
import { SavingsStack, StackStatus } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TrendingUp, Ban } from 'lucide-react';

interface StackCardProps {
    stack: SavingsStack;
    onBreak: (id: string) => void;
    onClick?: () => void;
}

export const StackCard: React.FC<StackCardProps> = ({ stack, onBreak, onClick }) => {
    const progress = Math.min((stack.currentAmount / stack.targetAmount) * 100, 100);

    // Calculate time remaining
    const calculateTimeRemaining = () => {
        if (stack.status !== StackStatus.ACTIVE) return null;

        const endDate = new Date(stack.endDate);
        const now = new Date();
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return 'Overdue';
        if (daysLeft === 0) return 'Today';
        if (daysLeft === 1) return '1 day left';
        if (daysLeft < 7) return `${daysLeft} days left`;

        const weeksLeft = Math.ceil(daysLeft / 7);
        if (weeksLeft === 1) return '1 week left';
        if (weeksLeft < 4) return `${weeksLeft} weeks left`;

        const monthsLeft = Math.ceil(daysLeft / 30);
        return monthsLeft === 1 ? '1 month left' : `${monthsLeft} months left`;
    };

    const timeRemaining = calculateTimeRemaining();

    const handleBreakClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onBreak(stack.id);
    };

    return (
        <Card
            className="relative overflow-hidden group hover:border-brand-200 transition-colors p-5 cursor-pointer"
            onClick={onClick}
        >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                <div
                    className={`h-full rounded-r-full transition-all duration-1000 ${stack.status === StackStatus.BROKEN ? 'bg-accent-red' : 'bg-accent-green'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Break Button (Only for Active Stacks) */}
            {stack.status === StackStatus.ACTIVE && (
                <button
                    onClick={handleBreakClick}
                    className="absolute top-4 right-4 text-slate-300 hover:text-accent-red transition-colors p-1"
                    title="Break Stack Early"
                >
                    <Ban className="w-5 h-5" />
                </button>
            )}

            <div className="flex justify-between items-start mt-2 mb-3">
                <div className="flex items-center gap-3">
                    <div className="text-3xl bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        {stack.emoji}
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-lg text-slate-800">{stack.name}</h3>
                        <p className="text-slate-500 text-xs font-medium flex items-center gap-1">
                            {stack.frequency} Pull • {stack.amountPerPull} {stack.asset}
                        </p>
                    </div>
                </div>

                {/* Only show badge if NOT active, to avoid clutter since Active is default */}
                {stack.status !== StackStatus.ACTIVE && (
                    <Badge color={stack.status === StackStatus.COMPLETED ? 'green' : 'yellow'}>
                        {stack.status}
                    </Badge>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Saved So Far</p>
                        <p className={`font-display font-bold text-2xl ${stack.status === StackStatus.BROKEN ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            ${stack.currentAmount.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Goal</p>
                        <p className="font-bold text-slate-600">
                            ${stack.targetAmount.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Yield feature - Coming soon! */}
                {/* {stack.status === StackStatus.ACTIVE && (
                    <div className="bg-brand-50 rounded-xl p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-brand-500" />
                            <span className="text-brand-900 text-xs font-bold">Yield Boost Active</span>
                        </div>
                        <span className="text-brand-600 text-xs font-bold">+2.4% APY</span>
                    </div>
                )} */}
            </div>
        </Card>
    );
};
