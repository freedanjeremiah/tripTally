'use client';

import { useUser } from './providers/user';
import { useMeetups } from '@/lib/contracts/hooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Home() {
  const { isConnected, address } = useUser();
  const { data: meetups } = useMeetups();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mb-2">Welcome to TripTally</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Connect with fellow travelers and manage shared expenses during your trips!
          </p>
        </div>
        {!isConnected && <ConnectButton />}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2>Featured Meetups</h2>
            {isConnected && (
              <Link
                href="/meetups/create"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Create Meetup
              </Link>
            )}
          </div>
          {isConnected ? (
            meetups && meetups.length > 0 ? (
              <div className="space-y-4">
                {meetups.map((meetup) => (
                  <div key={meetup.id.toString()} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <h3 className="font-medium">{meetup.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {meetup.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {meetup.participants.length} / {meetup.maxParticipants.toString()} participants
                      </span>
                      <Link
                        href={`/meetups/${meetup.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No meetups planned yet. Create one to get started!
              </p>
            )
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Connect your wallet to see and create meetups.
            </p>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2>Recent Expenses</h2>
            {isConnected && (
              <Link
                href="/expenses/create"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Add Expense
              </Link>
            )}
          </div>
          {isConnected ? (
            <p className="text-gray-600 dark:text-gray-300">
              No expenses tracked yet. Join a meetup to start sharing costs!
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Connect your wallet to see and manage expenses.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
