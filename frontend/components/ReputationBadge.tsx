'use client';

import { useEffect, useState } from 'react';
import { getUserReputation } from '@/lib/hooks';
import type { Address } from '@/lib/types';

interface ReputationBadgeProps {
  address: Address;
  showAddress?: boolean;
  className?: string;
}

export function ReputationBadge({ address, showAddress = true, className = '' }: ReputationBadgeProps) {
  const [reputation, setReputation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReputation = async () => {
      try {
        const score = await getUserReputation(address);
        setReputation(score);
      } catch (error) {
        console.error('Error loading reputation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReputation();
  }, [address]);

  // Helper function to determine reputation color
  const getReputationColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-blue-100 text-blue-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function to format address
  const formatAddress = (addr: Address) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showAddress && (
        <span className="font-mono text-sm text-gray-600">
          {formatAddress(address)}
        </span>
      )}
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          isLoading
            ? 'bg-gray-100 text-gray-800'
            : reputation !== null
            ? getReputationColor(reputation)
            : 'bg-red-100 text-red-800'
        }`}
      >
        {isLoading ? (
          'Loading...'
        ) : reputation !== null ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {reputation.toFixed(1)}
          </>
        ) : (
          'N/A'
        )}
      </span>
    </div>
  );
}