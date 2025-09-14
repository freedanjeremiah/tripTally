export type Address = `0x${string}`;

export interface Meetup {
  title: string;
  description: string;
  organizer: Address;
  maxParticipants: number;
  startTime: number;
  participants: Address[];
}

export interface MeetupCreationParams {
  title: string;
  description: string;
  maxParticipants: number;
  startTime: number;
}

export interface UserReputation {
  score: number;
  totalRatings: number;
}

export interface Expense {
  id: number;
  meetupId: number;
  payer: Address;
  amount: bigint;
  description: string;
  timestamp: number;
}

export interface ExpenseChannelState {
  meetupId: number;
  participants: Address[];
  totalAmount: bigint;
  isSettled: boolean;
  expenses: Expense[];
}