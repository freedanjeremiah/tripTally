'use client';

import { useState, useEffect } from 'react';
import { createExpenseChannel, addExpense, settleExpenses, getMeetup } from '@/lib/hooks';
import type { Meetup } from '@/lib/types';

export default function ExpensesPage({ params }: { params: { id: string } }) {
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  // Load meetup details
  useEffect(() => {
    const loadMeetup = async () => {
      try {
        const data = await getMeetup(parseInt(params.id));
        setMeetup(data);
      } catch (error) {
        console.error('Error loading meetup:', error);
      }
    };
    loadMeetup();
  }, [params.id]);

  // Handle create expense channel
  const handleCreateChannel = async () => {
    setIsCreatingChannel(true);
    try {
      await createExpenseChannel(parseInt(params.id));
    } catch (error) {
      console.error('Error creating expense channel:', error);
    } finally {
      setIsCreatingChannel(false);
    }
  };

  // Handle add expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingExpense(true);
    try {
      const amountInWei = BigInt(parseFloat(amount) * 1e18); // Convert ETH to Wei
      await addExpense(parseInt(params.id), amountInWei);
      setAmount(''); // Reset form
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsAddingExpense(false);
    }
  };

  // Handle settle expenses
  const handleSettle = async () => {
    setIsSettling(true);
    try {
      await settleExpenses(parseInt(params.id));
    } catch (error) {
      console.error('Error settling expenses:', error);
    } finally {
      setIsSettling(false);
    }
  };

  if (!meetup) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Expenses</h1>
          <p className="text-gray-600">Meetup: {meetup.title}</p>
        </div>

        {/* Create Channel Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateChannel}
            disabled={isCreatingChannel}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            {isCreatingChannel ? 'Creating...' : 'Create Expense Channel'}
          </button>
        </div>

        {/* Add Expense Form */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAddingExpense}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isAddingExpense ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>

        {/* Settle Expenses Button */}
        <div>
          <button
            onClick={handleSettle}
            disabled={isSettling}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400"
          >
            {isSettling ? 'Settling...' : 'Settle All Expenses'}
          </button>
        </div>
      </div>
    </div>
  );
}