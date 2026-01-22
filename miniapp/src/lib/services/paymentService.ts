// Payment logging service
import { supabase } from './unifiedUserService'; // Re-use the client

export const paymentService = {
    async recordPayment(userAddress: string, txHash: string, amount: string) {
        await supabase.from('payments').insert({
            user_address: userAddress, // Can be farcaster_FID or 0xWallet
            transaction_hash: txHash,
            amount,
            status: 'confirmed'
            // In prod, check tx status on-chain or use webhook before confirming
        });

        // Unlock user account (example feature)
        await supabase.from('users')
            .update({ has_paid: true })
            .eq('wallet_address', userAddress);
    }
}
