import { useContractRead, useContractWrite } from 'wagmi';
import { CONTRACT_ADDRESSES } from './constants';
import MeetupManagerABI from './abis/MeetupManager.json';
import ReputationLedgerABI from './abis/ReputationLedger.json';
import ExpenseChannelABI from './abis/ExpenseChannel.json';

// Meetup Manager Hooks
export function useMeetups() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.MeetupManager as `0x${string}`,
    abi: MeetupManagerABI,
    functionName: 'getAllMeetups',
  });
}

export function useCreateMeetup() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.MeetupManager as `0x${string}`,
    abi: MeetupManagerABI,
    functionName: 'createMeetup',
  });
}

export function useJoinMeetup() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.MeetupManager as `0x${string}`,
    abi: MeetupManagerABI,
    functionName: 'joinMeetup',
  });
}

// Reputation Ledger Hooks
export function useUserReputation(address: string) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.ReputationLedger as `0x${string}`,
    abi: ReputationLedgerABI,
    functionName: 'getReputation',
    args: [address],
  });
}

export function useRateUser() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.ReputationLedger as `0x${string}`,
    abi: ReputationLedgerABI,
    functionName: 'rateUser',
  });
}

// Expense Channel Hooks
export function useExpenseChannel(channelId: string) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.ExpenseChannel as `0x${string}`,
    abi: ExpenseChannelABI,
    functionName: 'getChannel',
    args: [channelId],
  });
}

export function useCreateExpense() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.ExpenseChannel as `0x${string}`,
    abi: ExpenseChannelABI,
    functionName: 'createExpense',
  });
}

export function useSettleExpense() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.ExpenseChannel as `0x${string}`,
    abi: ExpenseChannelABI,
    functionName: 'settleExpense',
  });
}