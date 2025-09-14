export interface Reputation {
  score: bigint;
  totalRatings: bigint;
}

export interface Meetup {
  id: bigint;
  title: string;
  description: string;
  organizer: string;
  maxParticipants: bigint;
  startDate: bigint;
  endDate: bigint;
  participants: string[];
}

export interface ExpenseChannel {
  id: string;
  participants: string[];
  totalAmount: bigint;
  isSettled: boolean;
}