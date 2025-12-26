export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum StackStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  BROKEN = 'broken',
}

export interface SavingsStack {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  frequency: Frequency;
  amountPerPull: number;
  startDate: string;
  endDate: string; // Estimated
  status: StackStatus;
  asset: string; // e.g., 'USDC', 'ETH'
  emoji: string;

  // Optional: Database integration fields (added when connecting to Supabase)
  fid?: number; // Farcaster ID
  walletAddress?: string; // Wallet that created this stack
  contractStackId?: number; // Blockchain stack ID
  txHash?: string; // Creation transaction hash
}

export interface UserWallet {
  address: string | null;
  balance: number; // In USDC for simplicity
  isConnected: boolean;
}
