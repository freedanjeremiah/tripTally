'use client';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { UserProvider } from './providers/user';

const config = getDefaultConfig({
  appName: 'TripTally',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [sepolia], // Start with just Sepolia for testnet
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}