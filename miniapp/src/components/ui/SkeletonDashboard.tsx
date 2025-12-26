import React from 'react';

export const SkeletonDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 animate-pulse">
            {/* Header Skeleton */}
            <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                        <div className="w-24 h-8 bg-slate-200 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block w-48 h-10 bg-slate-200 rounded-xl" />
                        <div className="w-32 h-10 bg-slate-200 rounded-full" />
                        <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Hero Balance Skeleton */}
                <div className="h-48 bg-slate-200 rounded-3xl" />

                {/* Stacks Grid Skeleton */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="w-32 h-8 bg-slate-200 rounded-lg" />
                        <div className="w-20 h-8 bg-slate-200 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-6 border-2 border-slate-100 h-64 space-y-4">
                                <div className="flex justify-between">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                                    <div className="w-16 h-6 bg-slate-100 rounded-full" />
                                </div>
                                <div className="w-32 h-8 bg-slate-100 rounded-lg" />
                                <div className="space-y-2">
                                    <div className="w-full h-4 bg-slate-100 rounded-full" />
                                    <div className="w-2/3 h-4 bg-slate-100 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Mobile Nav Skeleton */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center z-40">
                <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                <div className="w-16 h-16 bg-slate-200 rounded-full -mt-8 border-4 border-white" />
                <div className="w-12 h-12 bg-slate-200 rounded-lg" />
            </div>
        </div>
    );
};
