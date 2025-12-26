import React from 'react';
import { Button } from '../ui/Button';
import { SavingsStack } from '../../types';
import { generateStackShareMessage, shareToFarcaster, shareToBase } from '../../utils/share';
import { X, Share2 } from 'lucide-react';

interface ShareSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    stack: SavingsStack;
    platform?: 'farcaster' | 'base';
}

export function ShareSuccessModal({ isOpen, onClose, stack, platform = 'farcaster' }: ShareSuccessModalProps) {
    if (!isOpen) return null;

    const shareMessage = generateStackShareMessage(stack);

    const handleShare = async () => {
        if (platform === 'farcaster') {
            await shareToFarcaster(shareMessage);
        } else {
            await shareToBase(shareMessage);
        }
        onClose();
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

                <div className="text-center mb-6">
                    <div className="text-6xl mb-3">{stack.emoji}</div>
                    <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">
                        {stack.name}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Stack created successfully!
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={handleShare}
                        className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white font-semibold"
                    >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Your Goal
                    </Button>

                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full"
                    >
                        View Stack
                    </Button>
                </div>
            </div>
        </div>
    );
}
