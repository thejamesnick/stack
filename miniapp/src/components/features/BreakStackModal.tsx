import React from 'react';
import { SavingsStack } from '../../types';
import { Button } from '../ui/Button';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';

interface BreakStackModalProps {
    stack: SavingsStack;
    onClose: () => void;
    onConfirm: () => void;
}

export const BreakStackModal: React.FC<BreakStackModalProps> = ({ stack, onClose, onConfirm }) => {
    const feePercentage = 0.02;
    const feeAmount = stack.currentAmount * feePercentage;
    const returnAmount = stack.currentAmount - feeAmount;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-accent-red" />
                    </div>
                    <h2 className="font-display font-bold text-2xl text-slate-800">Break Stack?</h2>
                    <p className="text-slate-500 font-medium mt-1">
                        You're about to break <span className="font-bold text-slate-700">{stack.name}</span> early.
                    </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Total Saved</span>
                        <span className="font-bold text-slate-800">${stack.currentAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Early Exit Fee (2%)</span>
                        <span className="font-bold text-accent-red">-${feeAmount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-slate-700">You Receive</span>
                        <span className="font-display font-bold text-xl text-brand-600">${returnAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button variant="danger" onClick={onConfirm} className="w-full justify-between group">
                        <span>Break & Withdraw</span>
                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full">
                        No, Keep Stacking
                    </Button>
                </div>
            </div>
        </div>
    );
};
