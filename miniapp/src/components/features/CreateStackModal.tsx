import React, { useState } from 'react';
import { Frequency } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface CreateStackModalProps {
    onClose: () => void;
    onCreate: (data: any) => void;
    userBalance: number;
}

export const CreateStackModal: React.FC<CreateStackModalProps> = ({ onClose, onCreate, userBalance }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<string>('10');
    const [frequency, setFrequency] = useState<Frequency>(Frequency.WEEKLY);
    const [duration, setDuration] = useState<number>(12); // weeks/months etc
    const [emoji, setEmoji] = useState('💰');

    const totalProjected = (Number(amount) || 0) * duration;

    const handleSubmit = () => {
        onCreate({
            name,
            amountPerPull: Number(amount) || 0,
            frequency,
            targetAmount: totalProjected,
            emoji
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">New Stack</h2>
                    <p className="text-slate-500 font-medium">Step {step} of 2</p>
                    <div className="flex gap-2 mt-4">
                        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-brand-500' : 'bg-slate-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-brand-500' : 'bg-slate-200'}`} />
                    </div>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                                What are you saving for?
                            </label>
                            <div className="flex gap-2">
                                <button
                                    className="bg-slate-100 rounded-2xl w-14 h-14 flex items-center justify-center text-2xl border-2 border-transparent hover:border-brand-500 focus:border-brand-500 outline-none"
                                    onClick={() => setEmoji(emoji === '💰' ? '🚗' : emoji === '🚗' ? '✈️' : '💰')}
                                >
                                    {emoji}
                                </button>
                                <input
                                    type="text"
                                    className="flex-1 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-brand-500 rounded-2xl px-4 font-bold text-slate-800 outline-none transition-colors"
                                    placeholder="e.g. New Laptop"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                                How often?
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.values(Frequency).map((freq) => (
                                    <button
                                        key={freq}
                                        onClick={() => setFrequency(freq)}
                                        className={`py-3 rounded-2xl font-bold border-b-4 transition-all ${frequency === freq
                                            ? 'bg-brand-100 text-brand-600 border-brand-500'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full mt-4"
                            onClick={() => setStep(2)}
                            disabled={!name}
                        >
                            Next
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Amount per pull (USDC)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-brand-500 rounded-2xl pl-8 pr-4 py-4 font-display font-bold text-2xl text-slate-800 outline-none transition-colors"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min={1}
                                />
                            </div>
                            <p className="text-right text-xs font-bold text-slate-400 mt-2">
                                Wallet Balance: ${userBalance.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Duration ({frequency === Frequency.DAILY ? 'days' : frequency === Frequency.WEEKLY ? 'weeks' : 'months'})
                            </label>
                            <input
                                type="range"
                                min="2"
                                max={frequency === Frequency.DAILY ? 365 : 52}
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full accent-brand-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-center mt-2 font-bold text-brand-600 bg-brand-50 inline-block px-3 py-1 rounded-lg">
                                {duration} {frequency === Frequency.DAILY ? 'Days' : frequency === Frequency.WEEKLY ? 'Weeks' : 'Months'}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-slate-500 font-medium">Total Goal</span>
                                <span className="font-display font-bold text-xl text-slate-800">${totalProjected.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium text-sm">Fees (if broken early)</span>
                                <span className="font-bold text-accent-red text-sm">2%</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                            <Button className="flex-1" onClick={handleSubmit}>
                                Start Stack
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
