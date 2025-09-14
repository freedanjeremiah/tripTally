'use client';

import { useState, useEffect } from 'react';
import { getUserReputation, rateUser } from '@/lib/hooks';

export default function ProfilePage({ params }: { params: { address: string } }) {
  const [reputation, setReputation] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [isRating, setIsRating] = useState(false);

  // Load user reputation
  useEffect(() => {
    const loadReputation = async () => {
      try {
        const score = await getUserReputation(params.address);
        setReputation(score);
      } catch (error) {
        console.error('Error loading reputation:', error);
      }
    };
    loadReputation();
  }, [params.address]);

  // Handle rating submission
  const handleRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRating(true);
    try {
      await rateUser(params.address, rating);
      // Refresh reputation
      const updatedScore = await getUserReputation(params.address);
      setReputation(updatedScore);
    } catch (error) {
      console.error('Error rating user:', error);
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">User Profile</h1>
          <p className="font-mono text-sm text-gray-600">{params.address}</p>
        </div>

        {/* Reputation Score */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Reputation Score</h2>
          <div className="text-4xl font-bold text-indigo-600">
            {reputation === null ? '...' : reputation}
          </div>
        </div>

        {/* Rate User Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Rate User</h2>
          <form onSubmit={handleRate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-lg font-semibold mt-2">
                {rating}
              </div>
            </div>
            <button
              type="submit"
              disabled={isRating}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}