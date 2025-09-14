import { ethers } from 'ethers';
import { ABIS, CONTRACT_ADDRESSES } from './contracts';
import type { Meetup, MeetupCreationParams } from './types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Get Ethereum provider and signer
const getProviderAndSigner = async () => {
  // Check if MetaMask is installed
  if (typeof window !== 'undefined' && window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  }
  throw new Error('Please install MetaMask!');
};

// Contract instance getters
const getMeetupManagerContract = async (requireSigner = false) => {
  const { provider, signer } = await getProviderAndSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.MEETUP_MANAGER,
    ABIS.MeetupManager,
    requireSigner ? signer : provider
  );
};

const getReputationLedgerContract = async (requireSigner = false) => {
  const { provider, signer } = await getProviderAndSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.REPUTATION_LEDGER,
    ABIS.ReputationLedger,
    requireSigner ? signer : provider
  );
};

const getExpenseChannelContract = async (requireSigner = false) => {
  const { provider, signer } = await getProviderAndSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.EXPENSE_CHANNEL,
    ABIS.ExpenseChannel,
    requireSigner ? signer : provider
  );
};

// Meetup Manager Functions
export async function createMeetup(params: MeetupCreationParams) {
  const contract = await getMeetupManagerContract(true);
  const tx = await contract.createMeetup(
    params.title,
    params.description,
    params.maxParticipants,
    params.startTime
  );
  return tx.wait();
}

export async function joinMeetup(meetupId: number) {
  const contract = await getMeetupManagerContract(true);
  const tx = await contract.joinMeetup(meetupId);
  return tx.wait();
}

export async function getMeetup(meetupId: number): Promise<Meetup> {
  const contract = await getMeetupManagerContract();
  return contract.getMeetup(meetupId);
}

// Reputation Ledger Functions
export async function getUserReputation(address: string): Promise<number> {
  const contract = await getReputationLedgerContract();
  const reputation = await contract.getReputation(address);
  return Number(reputation);
}

export async function rateUser(address: string, rating: number) {
  const contract = await getReputationLedgerContract(true);
  const tx = await contract.rateUser(address, rating);
  return tx.wait();
}

// Expense Channel Functions
export async function createExpenseChannel(meetupId: number) {
  const contract = await getExpenseChannelContract(true);
  const tx = await contract.createExpenseChannel(meetupId);
  return tx.wait();
}

export async function addExpense(meetupId: number, amount: bigint) {
  const contract = await getExpenseChannelContract(true);
  const tx = await contract.addExpense(meetupId, amount);
  return tx.wait();
}

export async function settleExpenses(meetupId: number) {
  const contract = await getExpenseChannelContract(true);
  const tx = await contract.settleExpenses(meetupId);
  return tx.wait();
}
