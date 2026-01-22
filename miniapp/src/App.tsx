import React, { useState, useEffect } from 'react';
import { CreateStackModal } from './components/features/CreateStackModal';
import { BreakStackModal } from './components/features/BreakStackModal';
import { ProfileModal } from './components/features/ProfileModal';
import { ShareSuccessModal } from './components/features/ShareSuccessModal';
import { StackDetailsModal } from './components/features/StackDetailsModal';
import { SavingsStack, StackStatus, UserWallet } from './types';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Onboarding } from './components/features/Onboarding';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { SplashScreen } from './components/ui/SplashScreen';
import { WagmiProviders } from './lib/wagmi/providers';
import { authenticate, AuthenticatedUser } from './lib/auth/authenticate';
import { unifiedUserService } from './lib/services/unifiedUserService';
import { stackService } from './lib/services/stackService';
import { sdk } from '@farcaster/miniapp-sdk';
import { TopNavigation } from './components/layout/TopNavigation';
import { MobileNavigation } from './components/layout/MobileNavigation';

function App() {
    // State
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [wallet, setWallet] = useState<UserWallet | null>(null);
    const [stacks, setStacks] = useState<SavingsStack[]>([]);

    // Auth & Onboarding State - DB Driven
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [splashVisible, setSplashVisible] = useState(true);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [newlyCreatedStack, setNewlyCreatedStack] = useState<SavingsStack | null>(null);
    const [selectedStack, setSelectedStack] = useState<SavingsStack | null>(null);
    const [breakingStackId, setBreakingStackId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'home' | 'history'>('home');

    // Initialize Farcaster SDK & Splash Timer
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sdk.actions.ready();
        }
        const timer = setTimeout(() => setSplashVisible(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // Authenticate user & Sync with DB
    useEffect(() => {
        const initAuth = async () => {
            try {
                const authenticatedUser = await authenticate();
                if (authenticatedUser) {
                    setUser(authenticatedUser);

                    // Legacy wallet support
                    setWallet({
                        address: authenticatedUser.walletAddress,
                        balance: 0,
                        isConnected: true
                    });

                    // Sync User to DB
                    if (authenticatedUser.fid > 0) {
                        const dbUser = await unifiedUserService.getOrCreateUser(
                            authenticatedUser.fid,
                            authenticatedUser.username || `User ${authenticatedUser.fid}`,
                            authenticatedUser.pfpUrl || '',
                            authenticatedUser.walletAddress
                        );

                        // CHECK DB FOR ONBOARDING STATUS
                        if (dbUser && dbUser.has_completed_onboarding) {
                            setHasOnboarded(true);
                        }

                        // Fetch Stacks
                        const userStacks = await stackService.getUserStacks(authenticatedUser.fid);
                        setStacks(userStacks);
                    }
                }
            } catch (err) {
                console.error("Auth init failed:", err);
            } finally {
                setAuthLoading(false);
            }
        };
        initAuth();
    }, []);

    const handleOnboardingComplete = async () => {
        if (user && user.fid > 0) {
            // Update DB Status
            await unifiedUserService.completeOnboarding(user.fid);
            setHasOnboarded(true);
        } else {
            // Fallback if auth failed during onboarding (shouldn't happen in real flow)
            await handleConnectWallet();
        }
    };

    const handleConnectWallet = async () => {
        const authenticatedUser = await authenticate();
        if (authenticatedUser) {
            // Reload to trigger main auth flow again or just set user
            window.location.reload();
        }
    };

    const handleCreateStack = async (data: any) => {
        if (!user?.fid) return;

        // Save to DB
        const created = await stackService.createStack({
            name: data.name,
            targetAmount: data.targetAmount,
            currentAmount: 0,
            frequency: data.frequency,
            amountPerPull: data.amountPerPull,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            status: StackStatus.ACTIVE,
            asset: 'USDC',
            emoji: data.emoji,
            fid: user.fid
        } as any, user.fid);

        if (created) {
            setStacks([created, ...stacks]);
            setNewlyCreatedStack(created);
            setShowShareModal(true);
            setCurrentView('home');
        }
        setShowCreateModal(false);
    };

    const handleRequestBreak = (id: string) => {
        setBreakingStackId(id);
    };

    const handleConfirmBreak = async () => {
        if (breakingStackId) {
            await stackService.breakStack(breakingStackId);
            setStacks(stacks.map(s => s.id === breakingStackId ? { ...s, status: StackStatus.BROKEN } : s));
            setBreakingStackId(null);
            setCurrentView('history');
        }
    };

    if (splashVisible) return <SplashScreen />;

    // Loading State (Checking Auth & DB)
    if (authLoading) return <LoadingScreen />;

    // Not Authenticated -> Show Loading or Error (Auth should have happened)
    if (!user) {
        // In a real mini-app, auth happens automatically. 
        // If failed, we might show a "Connect" button or keep loading.
        return <LoadingScreen />;
    }

    // Authenticated but Not Onboarded -> Show Onboarding
    if (!hasOnboarded) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    // Authenticated & Onboarded -> Show App
    const activeStacks = stacks.filter(s => s.status === StackStatus.ACTIVE);
    const historyStacks = stacks.filter(s => s.status !== StackStatus.ACTIVE);
    const totalActiveSaved = activeStacks.reduce((acc, curr) => acc + curr.currentAmount, 0);
    const totalLifetimeVolume = historyStacks.reduce((acc, curr) => acc + curr.currentAmount, 0);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
            <TopNavigation
                currentView={currentView}
                setCurrentView={setCurrentView}
                onProfileClick={() => setShowProfileModal(true)}
                user={user}
                wallet={wallet}
            />

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {currentView === 'home' ? (
                    <Home
                        totalActiveSaved={totalActiveSaved}
                        activeStacks={activeStacks}
                        onOpenCreate={() => setShowCreateModal(true)}
                        onRequestBreak={handleRequestBreak}
                        onStackClick={(stack) => setSelectedStack(stack)}
                    />
                ) : (
                    <History
                        totalLifetimeVolume={totalLifetimeVolume}
                        historyStacks={historyStacks}
                    />
                )}
            </main>

            <MobileNavigation
                currentView={currentView}
                setCurrentView={setCurrentView}
                onCreateClick={() => setShowCreateModal(true)}
            />

            {showCreateModal && (
                <CreateStackModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateStack}
                />
            )}

            {breakingStackId && (
                <BreakStackModal
                    stack={stacks.find(s => s.id === breakingStackId)!}
                    onClose={() => setBreakingStackId(null)}
                    onConfirm={handleConfirmBreak}
                />
            )}

            {showProfileModal && wallet && (
                <ProfileModal
                    wallet={wallet}
                    onClose={() => setShowProfileModal(false)}
                    stats={{
                        totalSaved: totalActiveSaved + totalLifetimeVolume,
                        activeStacks: activeStacks.length,
                        completedStacks: historyStacks.filter(s => s.status === StackStatus.COMPLETED).length
                    }}
                />
            )}

            {showShareModal && newlyCreatedStack && (
                <ShareSuccessModal
                    isOpen={showShareModal}
                    onClose={() => {
                        setShowShareModal(false);
                        setNewlyCreatedStack(null);
                    }}
                    stack={newlyCreatedStack}
                    platform="farcaster"
                />
            )}

            {selectedStack && (
                <StackDetailsModal
                    stack={selectedStack}
                    onClose={() => setSelectedStack(null)}
                    onBreak={() => {
                        handleRequestBreak(selectedStack.id);
                        setSelectedStack(null);
                    }}
                    onShare={() => {
                        setNewlyCreatedStack(selectedStack);
                        setShowShareModal(true);
                        setSelectedStack(null);
                    }}
                />
            )}
        </div>
    );
}

export default function Root() {
    return (
        <WagmiProviders>
            <App />
        </WagmiProviders>
    );
}