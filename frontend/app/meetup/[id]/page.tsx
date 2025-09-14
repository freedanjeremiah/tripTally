'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getMeetup, joinMeetup, getUserReputation } from '@/lib/hooks';
import type { Meetup } from '@/lib/types';

export default function MeetupDetail({ params }: { params: { id: string } }) {
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [participantReputations, setParticipantReputations] = useState<{[address: string]: number}>({});

  // Load meetup details
  useEffect(() => {
    const loadMeetup = async () => {
      try {
        const data = await getMeetup(parseInt(params.id));
        setMeetup(data);
        
        // Load reputations for all participants
        const reputations: {[address: string]: number} = {};
        for (const participant of data.participants) {
          reputations[participant] = await getUserReputation(participant);
        }
        setParticipantReputations(reputations);
      } catch (error) {
        console.error('Error loading meetup:', error);
      }
    };
    loadMeetup();
  }, [params.id]);

  // Handle join meetup
  const handleJoin = async () => {
    if (!meetup) return;
    setIsJoining(true);
    try {
      await joinMeetup(parseInt(params.id));
      // Refresh meetup data
      const updatedMeetup = await getMeetup(parseInt(params.id));
      setMeetup(updatedMeetup);
    } catch (error) {
      console.error('Error joining meetup:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (!meetup) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const isStarted = meetup.startTime * 1000 <= Date.now();
  const isFull = meetup.participants.length >= meetup.maxParticipants;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{meetup.title}</h1>
        <p className="text-gray-600 mb-6">{meetup.description}</p>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{meetup.participants.length}/{meetup.maxParticipants} participants</span>
            <span>{new Date(meetup.startTime * 1000).toLocaleString()}</span>
          </div>

          {!isStarted && !isFull && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isJoining ? 'Joining...' : 'Join Meetup'}
            </button>
          )}

          {isStarted && (
            <Link
              href={`/expenses/${params.id}`}
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View Expenses
            </Link>
          )}
        </div>

        {/* Participants List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <div className="space-y-3">
            {meetup.participants.map((participant) => (
              <Link 
                key={participant}
                href={`/profile/${participant}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <span className="font-mono text-sm">{participant}</span>
                <span className="text-sm text-gray-500">
                  Reputation: {participantReputations[participant] || '...'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}