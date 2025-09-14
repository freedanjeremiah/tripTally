'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createMeetup, getMeetup } from '@/lib/hooks';
import type { MeetupCreationParams, Meetup } from '@/lib/types';

export default function Dashboard() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [meetups, setMeetups] = useState<Array<Meetup & { index: number }>>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load meetups on mount
  useEffect(() => {
    const loadMeetups = async () => {
      try {
        // In a real implementation, we would have a way to get the total number of meetups
        // For now, let's try to get the latest 10 meetups
        const latestMeetups = await Promise.all(
          Array.from({ length: 10 }, async (_, i) => {
            try {
              const meetup = await getMeetup(i);
              return meetup ? { ...meetup, index: i } : null;
            } catch {
              return null;
            }
          })
        );
        setMeetups(latestMeetups.filter((m): m is Meetup & { index: number } => m !== null));
      } catch (error) {
        console.error('Error loading meetups:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMeetups();
  }, []);

  // Form state
  const [formData, setFormData] = useState<MeetupCreationParams>({
    title: '',
    description: '',
    maxParticipants: 5,
    startTime: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createMeetup(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        maxParticipants: 5,
        startTime: Math.floor(Date.now() / 1000) + 3600
      });
      // Reload meetups to show the new one
      const newMeetup = await getMeetup(meetups.length);
      if (newMeetup) {
        setMeetups([...meetups, { ...newMeetup, index: meetups.length }]);
      }
    } catch (error) {
      console.error('Error creating meetup:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Wallet Connection */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Travel Meetups</h1>
        <ConnectButton />
      </div>
      
      {/* Create Meetup Form - Only shown when wallet is connected */}
      {isConnected ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Meetup</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Participants</label>
              <input
                type="number"
                min="2"
                max="20"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                value={new Date(formData.startTime * 1000).toISOString().slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, startTime: Math.floor(new Date(e.target.value).getTime() / 1000) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isCreating ? 'Creating...' : 'Create Meetup'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
          <p className="text-gray-600">Connect your wallet to create a new meetup</p>
        </div>
      )}

      {/* Meetups List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading meetups...</div>
        ) : meetups.length > 0 ? (
          meetups.map((meetup) => (
            <Link
              key={meetup.index}
              href={`/meetup/${meetup.index}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{meetup.title}</h3>
                <p className="text-gray-600 mb-4">{meetup.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{meetup.participants.length}/{meetup.maxParticipants} participants</span>
                  <span>{new Date(meetup.startTime * 1000).toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600">
            No meetups found
          </div>
        )}
      </div>
    </div>
  );
}