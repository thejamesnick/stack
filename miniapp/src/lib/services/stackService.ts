// Stack Service - Manage Savings Stacks in Supabase
import { supabase } from './unifiedUserService';
import { SavingsStack, StackStatus, Frequency } from '../../types';

export const stackService = {

    /**
     * Get all stacks for a specific user (by FID or Wallet Address)
     */
    async getUserStacks(fid: number): Promise<SavingsStack[]> {
        if (!fid) return [];

        try {
            const { data, error } = await supabase
                .from('stacks')
                .select('*')
                .eq('fid', fid)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching stacks:', error);
                return [];
            }

            // Map DB columns (snake_case) to Frontend types (camelCase)
            return (data || []).map((row: any) => ({
                id: row.id,
                name: row.name,
                targetAmount: Number(row.target_amount),
                currentAmount: Number(row.current_amount),
                frequency: row.frequency as Frequency,
                amountPerPull: Number(row.amount_per_pull),
                startDate: row.start_date,
                endDate: row.end_date,
                status: row.status as StackStatus,
                asset: row.asset,
                emoji: row.emoji,
                fid: row.fid
            }));
        } catch (e) {
            console.error('Stack service error:', e);
            return [];
        }
    },

    /**
     * Create a new stack in the database
     */
    async createStack(stack: Omit<SavingsStack, 'id'>, fid: number): Promise<SavingsStack | null> {
        try {
            const dbPayload = {
                fid,
                name: stack.name,
                emoji: stack.emoji,
                target_amount: stack.targetAmount,
                current_amount: 0,
                frequency: stack.frequency,
                amount_per_pull: stack.amountPerPull,
                asset: stack.asset,
                start_date: new Date().toISOString(),
                end_date: stack.endDate,
                status: 'active'
            };

            const { data, error } = await supabase
                .from('stacks')
                .insert(dbPayload)
                .select()
                .single();

            if (error) {
                console.error('Error creating stack:', error);
                throw error;
            }

            // Return the created object formatted for frontend
            return {
                id: data.id,
                name: data.name,
                targetAmount: Number(data.target_amount),
                currentAmount: Number(data.current_amount),
                frequency: data.frequency as Frequency,
                amountPerPull: Number(data.amount_per_pull),
                startDate: data.start_date,
                endDate: data.end_date,
                status: data.status as StackStatus,
                asset: data.asset,
                emoji: data.emoji,
                fid: data.fid
            };

        } catch (e) {
            console.error('Create stack error:', e);
            return null;
        }
    },

    /**
     * Mark a stack as broken
     */
    async breakStack(stackId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('stacks')
                .update({ status: 'broken' })
                .eq('id', stackId);

            return !error;
        } catch (e) {
            return false;
        }
    }
};
