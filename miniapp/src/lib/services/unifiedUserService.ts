// Unified User Service - Manages Identity & Database
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Use your own env vars later)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

export const unifiedUserService = {
    // Get or Create User (Idempotent)
    async getOrCreateUser(fid: number, username: string, avatar: string, connectedWallet?: string) {
        const primaryAddress = `farcaster_${fid}`;

        // 1. Check if user exists
        const { data: existing } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', primaryAddress)
            .single();

        if (existing) {
            // Optional: Link connected wallet if present
            if (connectedWallet?.startsWith('0x')) {
                await this.linkWalletToFID(fid, connectedWallet);
            }
            return existing;
        }

        // 2. Check for migration (Did they pay with a wallet before having an FID?)
        if (connectedWallet?.startsWith('0x')) {
            const migrated = await this.migrateWalletAccountToFID(connectedWallet, fid, username, avatar);
            if (migrated) return migrated;
        }

        // 3. Create new user
        const { data: newUser } = await supabase
            .from('users')
            .insert({
                wallet_address: primaryAddress,
                farcaster_fid: fid,
                username,
                avatar,
                base_wallet_address: connectedWallet || null,
                has_paid: false,
                total_points: 0,
                // joined_date: new Date().toISOString(), // DB handles this via default now()
            })
            .select()
            .single();

        return newUser;
    },

    // Link a 0x wallet to an FID
    async linkWalletToFID(fid: number, walletAddress: string) {
        const primaryAddress = `farcaster_${fid}`;
        await supabase
            .from('users')
            .update({ base_wallet_address: walletAddress })
            .eq('wallet_address', primaryAddress);
    },

    // Migrate old wallet-only account to FID account
    async migrateWalletAccountToFID(walletAddress: string, fid: number, username: string, avatar: string) {
        const { data: oldUser } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();

        if (!oldUser) return null;

        // Update to FID-based identity
        const primaryAddress = `farcaster_${fid}`;
        const { data: updated } = await supabase
            .from('users')
            .update({
                wallet_address: primaryAddress, // CHANGE PRIMARY KEY (Logic concept)
                farcaster_fid: fid,
                username,
                avatar,
                base_wallet_address: walletAddress // Keep 0x as linked
            })
            .eq('wallet_address', walletAddress)
            .select()
            .single();

        return updated;
    },

    // Mark onboarding as complete in DB
    async completeOnboarding(fid: number) {
        const primaryAddress = `farcaster_${fid}`;
        const { error } = await supabase
            .from('users')
            .update({
                has_completed_onboarding: true,
                onboarding_completed_at: new Date().toISOString()
            })
            .eq('farcaster_fid', fid); // specific to FID

        if (error) console.error('Failed to complete onboarding:', error);
        return !error;
    }
};
