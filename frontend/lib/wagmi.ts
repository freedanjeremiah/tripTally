// This file is kept for future contract interactions and chain configurations
import { mainnet, sepolia } from 'wagmi/chains';

export const supportedChains = [mainnet, sepolia];

// Add contract addresses per chain
export const contractAddresses: Record<number, string> = {
  // Example:
  // [mainnet.id]: '0x...', // mainnet
  // [sepolia.id]: '0x...', // sepolia
};