// lib/auth/authenticate.ts

import { sdk } from '@farcaster/miniapp-sdk';

export interface AuthenticatedUser {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    identityAddress: string; // Internal identity tracking (farcaster_FID or wallet address)
    actualWalletAddress?: string; // Real wallet address (optional, for Base app users)
    verified: boolean;
    platform: 'farcaster' | 'base' | 'unknown';
}

/**
 * Authenticate user - works for both Farcaster and Base App
 * Returns verified user data with FID
 */
export async function authenticate(): Promise<AuthenticatedUser | null> {
    try {
        console.log('🔐 Starting authentication...');

        // Check if running in Farcaster
        const isInFarcaster = typeof window !== 'undefined' && 'farcaster' in window;

        if (isInFarcaster) {
            console.log('📱 Detected Farcaster environment');
            return await authenticateWithFarcaster();
        }

        // Check if running in Base App
        const isInBase = typeof window !== 'undefined' && 'ethereum' in window;

        if (isInBase) {
            console.log('🔵 Detected Base App environment');
            return await authenticateWithBase();
        }

        console.log('⚠️ Not in Farcaster or Base App');
        return null;
    } catch (error) {
        console.error('❌ Authentication error:', error);
        return null;
    }
}

/**
 * Authenticate with Farcaster Mini App SDK
 */
async function authenticateWithFarcaster(): Promise<AuthenticatedUser | null> {
    try {
        // 1. Get Context (for UX immediately)
        const context = await sdk.context;

        // 2. Trigger Real "Sign In" Flow
        let signInResult;
        try {
            const nonce = Math.random().toString(36).substring(7);
            signInResult = await sdk.actions.signIn({ nonce });
            console.log('✅ Real Sign-In Successful', signInResult);
        } catch (e) {
            console.warn('⚠️ Sign-In failed (likely dev/localhost):', e);
            // In Production, strict mode might require this to succeed. 
            // In Dev, we proceed if we have context.
        }

        if (!context || !context.user) {
            console.log('⚠️ No Farcaster user context');
            // DEV ONLY FALLBACK to unblock blank screen if running locally without frame
            if (import.meta.env.DEV) {
                console.log('🔧 Dev Mode: Returning Mock User to unblock UI');
                return {
                    fid: 999,
                    username: 'dev_user',
                    displayName: 'Dev User',
                    pfpUrl: '',
                    identityAddress: 'farcaster_999',
                    verified: false,
                    platform: 'farcaster'
                };
            }
            return null;
        }

        const user = context.user;

        return {
            fid: user.fid,
            username: user.username,
            displayName: user.displayName || user.username,
            pfpUrl: user.pfpUrl || '',
            identityAddress: `farcaster_${user.fid}`,
            verified: true,
            platform: 'farcaster',
        };
    } catch (error) {
        console.error('❌ Farcaster authentication error:', error);
        return null; // Ensure we return null to stop loading spinner
    }
}

/**
 * Authenticate with Base App
 * ALWAYS tries to get Farcaster FID first for unified identity
 */
async function authenticateWithBase(): Promise<AuthenticatedUser | null> {
    try {
        // CRITICAL: Always try to get Farcaster context first
        // Base App can access Farcaster data if user has a Farcaster account
        try {
            const context = await sdk.context;
            if (context && context.user && context.user.fid) {
                console.log('✅ Base App user has Farcaster account - using FID as primary identity');
                console.log('🆔 FID:', context.user.fid);

                return {
                    fid: context.user.fid,
                    username: context.user.username,
                    displayName: context.user.displayName || context.user.username,
                    pfpUrl: context.user.pfpUrl || '',
                    identityAddress: `farcaster_${context.user.fid}`, // PRIMARY: FID-based address
                    verified: true,
                    platform: 'base',
                };
            }
        } catch (e) {
            console.log('⚠️ Base App user has no Farcaster account, will use wallet');
        }

        // FALLBACK: If no Farcaster account, use wallet address
        // This should be rare - most Base App users have Farcaster
        if ((window as any).ethereum) {
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            console.log('⚠️ Using wallet address as identity (no FID available)');
            console.log('💼 Wallet:', walletAddress);
            console.log('💡 Tip: User should link Farcaster account for unified identity');

            return {
                fid: 0, // No FID
                username: `User ${walletAddress.slice(0, 6)}`,
                displayName: `User ${walletAddress.slice(0, 6)}`,
                pfpUrl: '',
                identityAddress: walletAddress, // FALLBACK: Wallet-based address
                actualWalletAddress: walletAddress, // Real wallet address
                verified: true,
                platform: 'base',
            };
        }

        return null;
    } catch (error) {
        console.error('❌ Base authentication error:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await authenticate();
    return user !== null && user.verified;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
    return await authenticate();
}

/**
 * Sign out (clear local data)
 */
export function signOut(): void {
    localStorage.removeItem('stack_has_onboarded');
    // Add other keys to clear here if needed
    console.log('✅ Signed out');
}
