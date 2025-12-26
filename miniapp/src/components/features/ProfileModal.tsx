import React from 'react';
import { UserWallet } from '../../types';
import { X, ExternalLink, Wallet, ShieldCheck, Copy } from 'lucide-react';

interface ProfileModalProps {
    wallet: UserWallet;
    onClose: () => void;
    stats: {
        totalSaved: number;
        activeStacks: number;
        completedStacks: number;
    };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    wallet,
    onClose,
    stats
}) => {
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-sm w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">

                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-brand-500 to-brand-600 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6 -mt-12">

                    {/* Avatar & Identity */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 shadow-md mb-3 flex items-center justify-center text-4xl overflow-hidden relative group cursor-pointer">
                            {/* Mock Avatar Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-400 via-accent-green to-brand-600"></div>
                            <span className="relative z-10 drop-shadow-md">🦊</span>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-display font-bold text-2xl text-slate-800">based_saver.eth</h2>
                            <ShieldCheck className="w-5 h-5 text-brand-500" fill="currentColor" stroke="white" />
                        </div>

                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors group">
                            <Wallet className="w-3 h-3 text-slate-400" />
                            <span className="font-mono text-xs font-bold text-slate-500">{wallet.address}</span>
                            <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col justify-center">
                            <div className="font-display font-bold text-xl text-slate-800">${stats.totalSaved.toLocaleString()}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Saved</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col justify-center">
                            <div className="font-display font-bold text-xl text-slate-800">{stats.activeStacks}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Stacks</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-brand-200 hover:bg-slate-50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-700">View on BaseScan</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Powered by Base</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
