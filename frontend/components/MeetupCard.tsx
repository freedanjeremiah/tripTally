'use client';

import Link from 'next/link';
import { ReputationBadge } from '@/components/ReputationBadge';
import type { Meetup } from '@/lib/types';

interface MeetupCardProps {
  meetup: Meetup & { index: number };
  showOrganizer?: boolean;
  className?: string;
}

export function MeetupCard({ meetup, showOrganizer = false, className = '' }: MeetupCardProps) {
  const isStarted = meetup.startTime * 1000 <= Date.now();
  const isFull = meetup.participants.length >= meetup.maxParticipants;
  const isUpcoming = meetup.startTime * 1000 > Date.now();
  const timeUntilStart = isUpcoming ? meetup.startTime * 1000 - Date.now() : 0;
  
  // Format time until start
  const formatTimeUntilStart = () => {
    if (!isUpcoming) return 'Started';
    const hours = Math.floor(timeUntilStart / (1000 * 60 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    }
    return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
  };
  
  return (
    <Link
      href={`/meetup/${meetup.index}`}
      className={`block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
    >
      <div>
        {/* Meetup Title and Description */}
        <h3 className="text-xl font-semibold mb-2">{meetup.title}</h3>
        <p className="text-gray-600 mb-4">{meetup.description}</p>

        {/* Organizer Info (if showOrganizer is true) */}
        {showOrganizer && (
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-500 mr-2">Organized by:</span>
            <Link href={`/profile/${meetup.organizer}`} className="hover:underline">
              <ReputationBadge address={meetup.organizer} />
            </Link>
          </div>
        )}

        {/* Meetup Stats */}
        <div className="flex flex-wrap justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {meetup.participants.length}/{meetup.maxParticipants}
          </span>
          
          <span className="flex items-center" title={new Date(meetup.startTime * 1000).toLocaleString()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTimeUntilStart()}
          </span>

          {/* Status Tags */}
          <div className="w-full mt-3 flex flex-wrap gap-2">
            {isStarted && (
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                Active
              </span>
            )}
            {isUpcoming && (
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                Upcoming
              </span>
            )}
            {isFull && (
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                Full
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}