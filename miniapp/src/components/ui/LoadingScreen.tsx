import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { Coins, Bell } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
            {/* Header Skeleton - Matches visual weight of real header but using Skeletons */}
            <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                            <Coins className="text-brand-200 w-6 h-6" />
                        </div>
                        <Skeleton className="w-24 h-8" />
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Hero Balance Skeleton */}
                <Skeleton className="h-48 w-full rounded-3xl" />

                {/* Stacks Grid Skeleton */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="w-32 h-8" />
                        <Skeleton className="w-20 h-8" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-6 border-2 border-slate-100 h-64 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="w-12 h-12 rounded-2xl" />
                                        <Skeleton className="w-16 h-6 rounded-full" />
                                    </div>
                                    <Skeleton className="w-32 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="w-full h-4 rounded-full" />
                                    <Skeleton className="w-2/3 h-4 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
