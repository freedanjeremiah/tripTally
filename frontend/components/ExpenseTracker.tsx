'use client';

import { useState } from 'react';
import { ReputationBadge } from './ReputationBadge';
import { addExpense, settleExpenses } from '@/lib/hooks';
import type { Expense, Address } from '@/lib/types';

interface ExpenseTrackerProps {
  meetupId: number;
  expenses: Expense[];
  participants: Address[];
  isSettled: boolean;
  onExpenseAdded?: () => void;
  onExpensesSettled?: () => void;
  className?: string;
}

export function ExpenseTracker({
  meetupId,
  expenses,
  participants,
  isSettled,
  onExpenseAdded,
  onExpensesSettled,
  className = ''
}: ExpenseTrackerProps) {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  // Calculate total expenses per person
  const expensesByPerson = expenses.reduce((acc, expense) => {
    acc[expense.payer] = (acc[expense.payer] || BigInt(0)) + expense.amount;
    return acc;
  }, {} as Record<Address, bigint>);

  // Calculate total and split amount
  const totalExpenses = Object.values(expensesByPerson).reduce(
    (sum, amount) => sum + amount,
    BigInt(0)
  );
  const splitAmount = totalExpenses / BigInt(participants.length);

  // Handle adding new expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setIsAddingExpense(true);
    try {
      const amountInWei = BigInt(parseFloat(amount) * 1e18); // Convert ETH to Wei
      await addExpense(meetupId, amountInWei);
      setAmount('');
      setDescription('');
      onExpenseAdded?.();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsAddingExpense(false);
    }
  };

  // Handle settling all expenses
  const handleSettle = async () => {
    setIsSettling(true);
    try {
      await settleExpenses(meetupId);
      onExpensesSettled?.();
    } catch (error) {
      console.error('Error settling expenses:', error);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Add Expense Form */}
      {!isSettled && (
        <form onSubmit={handleAddExpense} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (ETH)</label>
              <input
                type="number"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., Dinner at Restaurant"
              />
            </div>
            <button
              type="submit"
              disabled={isAddingExpense}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isAddingExpense ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Expenses</h3>
        
        {expenses.length > 0 ? (
          <div className="space-y-4">
            {/* Individual Expenses */}
            <div className="space-y-2">
              {expenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <ReputationBadge address={expense.payer} showAddress={false} />
                      <span className="text-gray-600">{formatAddress(expense.payer)}</span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-gray-500 mt-1">{expense.description}</p>
                    )}
                  </div>
                  <span className="font-medium">
                    {formatEth(expense.amount)} ETH
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Expenses:</span>
                <span>{formatEth(totalExpenses)} ETH</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Split per person:</span>
                <span>{formatEth(splitAmount)} ETH</span>
              </div>
            </div>

            {/* Settlement Button */}
            {!isSettled && (
              <button
                onClick={handleSettle}
                disabled={isSettling}
                className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              >
                {isSettling ? 'Settling...' : 'Settle Expenses'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No expenses recorded yet</p>
        )}
      </div>
    </div>
  );
}

// Helper function to format ETH amounts
function formatEth(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4);
}

// Helper function to format addresses
function formatAddress(address: Address): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}