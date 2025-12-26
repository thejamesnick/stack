import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { ShieldCheck, Wallet } from 'lucide-react';

interface TransactionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: number;
    title: string;
    amountLabel?: string;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    title,
    amountLabel = 'Amount'
}) => {
    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-600 text-white p-2 rounded-xl">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Confirm Transaction</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Coinbase Smart Wallet
                        </div>
                    </div>
                </div>

                {/* Transaction Details Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Action</p>
                            <p className="font-bold text-slate-800 text-lg">{title}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Asset</p>
                            <p className="font-bold text-slate-800 text-lg">USDC</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">{amountLabel}</span>
                            <span className="font-bold text-slate-800">${amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Network Cost</span>
                            <span className="font-bold text-green-600">Free</span>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="flex gap-2 items-start bg-blue-50 p-3 rounded-xl text-blue-700 text-xs font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>This transaction is simulated. No real funds will be moved.</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="secondary" onClick={onClose}>
                        Reject
                    </Button>
                    <Button onClick={onConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};
