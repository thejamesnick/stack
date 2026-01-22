// Farcaster Social & Engagement Service
import { supabase } from './unifiedUserService';
import { sdk } from '@farcaster/miniapp-sdk';

export const farcasterService = {
    // Save Farcaster Profile to DB
    async linkFarcasterAccount(walletAddress: string, profile: any) {
        await supabase.from('users').update({
            farcaster_fid: profile.fid,
            username: profile.username, // Normalized field name
            avatar: profile.pfpUrl      // Normalized field name from users table
        }).eq('wallet_address', walletAddress);
    },

    // Track if they viewed/played (Analytics)
    async trackInteraction(fid: number, type: string) {
        await supabase.from('farcaster_interactions').insert({
            fid,
            interaction_type: type, // 'view', 'play', 'share'
        });
    }
};

export const socialService = {
    // Generate the "Share" text
    generateShareText(type: string, data: any) {
        if (type === 'share_stack') {
            return `I just started saving for ${data.name} 💰\n\nJoin me on Stack!`;
        }
        return 'Check out Stack on Base!';
    },

    // Record that a user shared (for analytics)
    async recordShare(userAddress: string, platform: string, type: string) {
        await supabase.from('social_shares').insert({
            user_address: userAddress, // Farcaster FID or Wallet
            platform, // 'farcaster', 'twitter'
            share_type: type
        });
    }
};
