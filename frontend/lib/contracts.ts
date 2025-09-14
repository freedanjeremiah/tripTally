import { sepolia } from 'wagmi/chains';
import MeetupManagerABI from './contracts/MeetupManager.json';
import ReputationLedgerABI from './contracts/ReputationLedger.json';
import ExpenseChannelABI from './contracts/ExpenseChannel.json';

export const CHAIN_ID = sepolia.id;

export const CONTRACT_ADDRESSES = {
  // Replace these with actual deployed contract addresses
  MEETUP_MANAGER: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  REPUTATION_LEDGER: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  EXPENSE_CHANNEL: '0x0000000000000000000000000000000000000000' as `0x${string}`,
} as const;

export const ABIS = {
  MeetupManager: MeetupManagerABI.abi,
  ReputationLedger: ReputationLedgerABI.abi,
  ExpenseChannel: ExpenseChannelABI.abi,
} as const;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
export type ContractABIs = typeof ABIS;