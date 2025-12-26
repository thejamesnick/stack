import { SavingsStack, StackStatus, UserWallet, Frequency } from '../types';

export const MOCK_WALLET: UserWallet = {
    address: "0x123...45abc",
    balance: 5430.50,
    isConnected: true
};

export const MOCK_STACKS: SavingsStack[] = [
    {
        id: '1',
        name: 'Summer Trip 🇯🇵',
        targetAmount: 3000,
        currentAmount: 1250,
        frequency: Frequency.WEEKLY,
        amountPerPull: 150,
        startDate: '2023-01-01',
        endDate: '2023-06-01',
        status: StackStatus.ACTIVE,
        asset: 'USDC',
        emoji: '✈️'
    },
    {
        id: '2',
        name: 'New MacBook',
        targetAmount: 2500,
        currentAmount: 2500,
        frequency: Frequency.MONTHLY,
        amountPerPull: 500,
        startDate: '2023-02-01',
        endDate: '2023-07-01',
        status: StackStatus.COMPLETED,
        asset: 'ETH',
        emoji: '💻'
    },
    {
        id: '3',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 1200,
        frequency: Frequency.MONTHLY,
        amountPerPull: 200,
        startDate: '2023-03-01',
        endDate: '2024-03-01',
        status: StackStatus.BROKEN,
        asset: 'USDC',
        emoji: '🚑'
    }
];
