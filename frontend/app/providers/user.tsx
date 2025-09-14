import { createContext, useContext, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useUserReputation } from '@/lib/contracts/hooks';
import type { Reputation } from '@/lib/contracts/types';

interface UserContextType {
  isConnected: boolean;
  address: string | undefined;
  chainId: number | undefined;
  reputation: {
    score: number;
    totalRatings: number;
  } | null;
}

const UserContext = createContext<UserContextType>({
  isConnected: false,
  address: undefined,
  chainId: undefined,
  reputation: null,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useAccount();
  const { data: reputationData } = useUserReputation(address || '0x0');

  const value: UserContextType = {
    isConnected,
    address,
    chainId: 11155111, // Default to Sepolia
    reputation: reputationData ? {
      score: Number(reputationData?.score || 0n),
      totalRatings: Number(reputationData?.totalRatings || 0n),
    } : null,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}