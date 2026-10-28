export type GameMode = 'Solo' | 'Duo' | 'Squad' | 'CS 4v4';
export type MapType = 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra';
export type MatchStatus = 'upcoming' | 'filling' | 'live' | 'completed';

export interface PrizeBreakdown {
  rank: number;
  prize: number;
  label: string;
}

export interface RegisteredPlayer {
  userId: string;
  username: string;
  ign: string;
  uid: string;
  teammateIgns?: string[];
  slotNumber: number;
  kills?: number;
  rank?: number;
  winnings?: number;
}

export interface Tournament {
  id: string;
  title: string;
  gameMode: GameMode;
  map: MapType;
  matchType: 'Daily' | 'Mega' | 'Scrim' | 'Rush';
  entryFee: number;
  perKill: number;
  prizePool: number;
  prizes: PrizeBreakdown[];
  maxSpots: number;
  joinedSpots: number;
  startTime: string; // e.g. "Today 08:30 PM"
  startEpoch: number;
  status: MatchStatus;
  roomId: string | null;
  roomPassword: string | null;
  rules: string[];
  registeredPlayers: RegisteredPlayer[];
}

export interface UserWallet {
  deposit: number;
  winning: number;
  bonus: number;
}

export interface UserStats {
  matchesPlayed: number;
  totalKills: number;
  booyahs: number;
  totalWinnings: number;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ffUid: string;
  ffIgn: string;
  avatar: string;
  wallet: UserWallet;
  stats: UserStats;
  isAdmin: boolean;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'kill_reward' | 'booyah_reward' | 'referral_bonus';
  amount: number;
  title: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  referenceId?: string;
  utrNumber?: string;
  paymentMethod?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: 'UPI' | 'Paytm' | 'Bank';
  payeeAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface DepositSubmission {
  id: string;
  userId: string;
  username: string;
  amount: number;
  utr: string;
  screenshotName?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface LeaderboardPlayer {
  id: string;
  rank: number;
  username: string;
  ign: string;
  avatar: string;
  kills: number;
  booyahs: number;
  totalEarnings: number;
  tier: 'Grandmaster' | 'Master' | 'Heroic' | 'Diamond';
}

export interface VipInfo {
  active: boolean;
  expiry: number;
}

export interface VipRequest {
  id: number;
  utr: string;
  time: string;
}

export interface WinnerPayout {
  id?: number;
  room: string;
  name: string;
  upi: string;
  amt: number;
  time: string;
}

