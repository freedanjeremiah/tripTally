import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { CONTRACT_ADDRESSES } from './contracts/constants';

export const config = getDefaultConfig({
  appName: 'TripTally',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [sepolia],
});