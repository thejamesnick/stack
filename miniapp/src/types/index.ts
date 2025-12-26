export enum Frequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export enum StackStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  BROKEN = 'Broken',
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
}

export interface UserWallet {
  address: string | null;
  balance: number; // In USDC for simplicity
  isConnected: boolean;
}
