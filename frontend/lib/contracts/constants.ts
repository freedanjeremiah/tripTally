// Contract addresses will be populated after deployment
export const CONTRACT_ADDRESSES = {
  MeetupManager: process.env.NEXT_PUBLIC_MEETUP_MANAGER_ADDRESS || '',
  ReputationLedger: process.env.NEXT_PUBLIC_REPUTATION_LEDGER_ADDRESS || '',
  ExpenseChannel: process.env.NEXT_PUBLIC_EXPENSE_CHANNEL_ADDRESS || '',
} as const;

export const SUPPORTED_CHAINS = {
  testnet: {
    chainId: 11155111, // Sepolia
    name: 'Sepolia',
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorer: 'https://sepolia.etherscan.io',
  },
} as const;