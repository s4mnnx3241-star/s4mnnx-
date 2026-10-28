/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Tournament, 
  User, 
  Transaction, 
  WithdrawalRequest, 
  LeaderboardPlayer,
  GameMode,
  MapType,
  DepositSubmission,
  VipInfo
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_TOURNAMENTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_LEADERBOARD, 
  INITIAL_WITHDRAWALS,
  INITIAL_DEPOSIT_SUBMISSIONS,
  ASSET_PATHS 
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { TournamentCard } from './components/TournamentCard';
import { JoinMatchModal } from './components/JoinMatchModal';
import { SlotSelectionPage } from './components/SlotSelectionPage';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { RulesModal } from './components/RulesModal';
import { WalletView } from './components/WalletView';
import { MyMatchesView } from './components/MyMatchesView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { AuthScreens } from './components/AuthScreens';
import { AdminPanel } from './components/AdminPanel';
import { 
  Flame, 
  Trophy, 
  Search, 
  Swords, 
  ShieldCheck, 
  Sparkles, 
  Crosshair,
  SlidersHorizontal,
  Bell
} from 'lucide-react';

export default function App() {
  // Session State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('skillwar_logged_in') === 'true';
  });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('skillwar_admin_unlocked') === 'true';
  });
  const [activeTab, setActiveTab] = useState<NavTab>('lobby');
  const [isAdminViewOpen, setIsAdminViewOpen] = useState<boolean>(false);
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(false);

  // App Data State
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('skillwar_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('skillwar_tournaments');
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('skillwar_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('skillwar_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>(() => {
    const saved = localStorage.getItem('skillwar_leaderboard');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const [depositSubmissions, setDepositSubmissions] = useState<DepositSubmission[]>(() => {
    const saved = localStorage.getItem('skillwar_deposit_submissions');
    return saved ? JSON.parse(saved) : INITIAL_DEPOSIT_SUBMISSIONS;
  });

  const [vip, setVip] = useState<VipInfo>(() => {
    const saved = localStorage.getItem('vip');
    return saved ? JSON.parse(saved) : { active: false, expiry: 0 };
  });

  const isVipActive = vip.active && vip.expiry > Date.now();

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('skillwar_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('skillwar_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('skillwar_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('skillwar_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('skillwar_deposit_submissions', JSON.stringify(depositSubmissions));
  }, [depositSubmissions]);

  useEffect(() => {
    localStorage.setItem('vip', JSON.stringify(vip));
  }, [vip]);

  // Filtering State
  const [modeFilter, setModeFilter] = useState<'All' | GameMode | 'Scrim'>('All');
  const [mapFilter, setMapFilter] = useState<'All' | MapType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedJoinMatch, setSelectedJoinMatch] = useState<Tournament | null>(null);
  const [selectedRoomMatch, setSelectedRoomMatch] = useState<Tournament | null>(null);
  const [selectedRulesMatch, setSelectedRulesMatch] = useState<Tournament | null>(null);

  // Notifications & Confetti
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. Join Match Handler
  const handleConfirmJoin = (data: { ign: string; uid: string; slotNumber?: number; teammates?: string[] }) => {
    if (!selectedJoinMatch) return;

    // Check balance
    const totalBal = user.wallet.deposit + user.wallet.winning + user.wallet.bonus;
    if (totalBal < selectedJoinMatch.entryFee) {
      showToast('Insufficient wallet balance!');
      return;
    }

    // Deduct entry fee: take from deposit first, then winning, then bonus
    let remainingToDeduct = selectedJoinMatch.entryFee;
    let newDeposit = user.wallet.deposit;
    let newWinning = user.wallet.winning;
    let newBonus = user.wallet.bonus;

    if (remainingToDeduct > 0 && newDeposit > 0) {
      const take = Math.min(newDeposit, remainingToDeduct);
      newDeposit -= take;
      remainingToDeduct -= take;
    }
    if (remainingToDeduct > 0 && newWinning > 0) {
      const take = Math.min(newWinning, remainingToDeduct);
      newWinning -= take;
      remainingToDeduct -= take;
    }
    if (remainingToDeduct > 0 && newBonus > 0) {
      const take = Math.min(newBonus, remainingToDeduct);
      newBonus -= take;
      remainingToDeduct -= take;
    }

    const updatedUser: User = {
      ...user,
      ffIgn: data.ign,
      ffUid: data.uid,
      wallet: {
        deposit: newDeposit,
        winning: newWinning,
        bonus: newBonus,
      },
      stats: {
        ...user.stats,
        matchesPlayed: user.stats.matchesPlayed + 1,
      },
    };
    setUser(updatedUser);

    const slotAssigned = data.slotNumber || (selectedJoinMatch.joinedSpots + 1);

    // Add transaction
    if (selectedJoinMatch.entryFee > 0) {
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'entry_fee',
        amount: selectedJoinMatch.entryFee,
        title: `Entry Fee: ${selectedJoinMatch.title} (Slot #${slotAssigned})`,
        timestamp: 'Just now',
        status: 'completed',
        referenceId: `REG-${selectedJoinMatch.id}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    // Update tournament player slots
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === selectedJoinMatch.id) {
          return {
            ...t,
            joinedSpots: Math.min(t.maxSpots, t.joinedSpots + 1),
            registeredPlayers: [
              ...t.registeredPlayers,
              {
                userId: user.id,
                username: user.username,
                ign: data.ign,
                uid: data.uid,
                teammateIgns: data.teammates,
                slotNumber: slotAssigned,
              },
            ],
          };
        }
        return t;
      })
    );

    setSelectedJoinMatch(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2800);
    showToast(`🎉 Registered successfully! Slot #${slotAssigned} booked.`);
  };

  // 2. Add Cash Handler
  const handleAddCash = (amount: number, method: string, utr?: string) => {
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        deposit: prev.wallet.deposit + amount,
      },
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount,
      title: `UPI Deposit (${method})`,
      timestamp: 'Just now',
      status: 'completed',
      referenceId: utr ? `UTR-${utr}` : `UPI/${Date.now().toString().slice(-6)}`,
      utrNumber: utr,
      paymentMethod: method,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Submit Payment for Admin Verification
  const handleSubmitPayment = (amount: number, utr: string, screenshotName?: string) => {
    const newSubmission: DepositSubmission = {
      id: `dep_${Date.now()}`,
      userId: user.id,
      username: user.username,
      amount,
      utr,
      screenshotName,
      timestamp: 'Just now',
      status: 'pending',
    };
    setDepositSubmissions((prev) => [newSubmission, ...prev]);
    showToast(`Payment submitted (UTR: ${utr})! Admin will verify.`);
  };

  // Admin approves payment and adds balance to player wallet
  const handleApproveDeposit = (id: string) => {
    const sub = depositSubmissions.find((s) => s.id === id);
    if (!sub || sub.status === 'approved') return;

    setDepositSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
    );

    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        deposit: prev.wallet.deposit + sub.amount,
      },
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount: sub.amount,
      title: `UPI Deposit Approved (UTR: ${sub.utr})`,
      timestamp: 'Just now',
      status: 'completed',
      referenceId: `UTR-${sub.utr}`,
      utrNumber: sub.utr,
      paymentMethod: 'UPI (9884184962@upi)',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Approved! ₹${sub.amount} added to ${sub.username}'s wallet.`);
  };

  const handleRejectDeposit = (id: string) => {
    setDepositSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
    showToast('Payment submission rejected.');
  };

  // Admin Match Schedule - 10 Min SMS
  const handleSetMatchSchedule = (mTime: string, rId: string, rPass: string) => {
    const newTournament: Tournament = {
      id: `ff-${Date.now().toString().slice(-3)}`,
      title: 'Full Map Solo || Skin On || Horse Ban',
      gameMode: 'Solo',
      map: 'Bermuda',
      matchType: 'Daily',
      entryFee: 20,
      perKill: 10,
      prizePool: 600,
      prizes: [
        { rank: 1, prize: 300, label: '1st (Booyah)' },
        { rank: 2, prize: 180, label: '2nd Place' },
        { rank: 3, prize: 120, label: '3rd Place' },
      ],
      maxSpots: 48,
      joinedSpots: 1,
      startTime: mTime.replace('T', ' '),
      startEpoch: new Date(mTime).getTime() || Date.now() + 1000 * 60 * 60,
      status: 'upcoming',
      roomId: rId,
      roomPassword: rPass,
      rules: ['Full Map Solo', 'Skin On', 'Horse Ban', 'Mobile Only'],
      registeredPlayers: [
        {
          userId: user.id,
          username: user.username,
          ign: user.ffIgn,
          uid: user.ffUid,
          slotNumber: 1,
        },
      ],
    };
    setTournaments((prev) => [newTournament, ...prev]);
    showToast(`Match scheduled! 10 min age 9884184962 te SMS jabe.`);
  };

  // 3. Withdrawal Request Handler
  const handleRequestWithdrawal = (
    amount: number,
    method: 'UPI' | 'Paytm' | 'Bank',
    payee: string
  ) => {
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        winning: prev.wallet.winning - amount,
      },
    }));

    const newRequest: WithdrawalRequest = {
      id: `wd_${Date.now()}`,
      userId: user.id,
      username: user.username,
      amount,
      method,
      payeeAddress: payee,
      status: 'pending',
      createdAt: 'Just now',
    };
    setWithdrawals((prev) => [newRequest, ...prev]);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount,
      title: `Withdrawal via ${method}`,
      timestamp: 'Just now',
      status: 'pending',
      referenceId: newRequest.id,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // 4. Admin Handlers
  const handleCreateTournament = (
    data: Omit<Tournament, 'id' | 'joinedSpots' | 'registeredPlayers'>
  ) => {
    const newTournament: Tournament = {
      ...data,
      id: `ff-${Date.now().toString().slice(-3)}`,
      joinedSpots: 0,
      registeredPlayers: [],
    };
    setTournaments((prev) => [newTournament, ...prev]);
  };

  const handleUpdateRoomDetails = (tournamentId: string, roomId: string, roomPass: string) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            roomId,
            roomPassword: roomPass,
            status: 'upcoming',
          };
        }
        return t;
      })
    );
  };

  const handleSettleMatch = (
    tournamentId: string,
    results: { userId: string; kills: number; rank: number }[]
  ) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return;

    // Credit prizes to user if registered
    results.forEach((res) => {
      let prizeWon = 0;
      // Per kill bounty
      prizeWon += res.kills * tournament.perKill;
      // Placement prize
      if (res.rank === 1) prizeWon += tournament.prizes[0]?.prize || 0;
      if (res.rank === 2) prizeWon += tournament.prizes[1]?.prize || 0;
      if (res.rank === 3) prizeWon += tournament.prizes[2]?.prize || 0;

      if (res.userId === user.id) {
        setUser((prev) => ({
          ...prev,
          wallet: {
            ...prev.wallet,
            winning: prev.wallet.winning + prizeWon,
          },
          stats: {
            ...prev.stats,
            totalKills: prev.stats.totalKills + res.kills,
            booyahs: res.rank === 1 ? prev.stats.booyahs + 1 : prev.stats.booyahs,
            totalWinnings: prev.stats.totalWinnings + prizeWon,
          },
        }));

        if (prizeWon > 0) {
          const rewardTx: Transaction = {
            id: `tx_${Date.now()}_${res.userId}`,
            type: res.rank === 1 ? 'booyah_reward' : 'kill_reward',
            amount: prizeWon,
            title: `${tournament.title} Payout (${res.kills} Kills, #${res.rank})`,
            timestamp: 'Just now',
            status: 'completed',
            referenceId: tournament.id,
          };
          setTransactions((prev) => [rewardTx, ...prev]);
        }
      }
    });

    // Mark tournament as completed
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            status: 'completed',
            registeredPlayers: t.registeredPlayers.map((player) => {
              const res = results.find((r) => r.userId === player.userId);
              return res
                ? {
                    ...player,
                    kills: res.kills,
                    rank: res.rank,
                    winnings: (res.kills * t.perKill) + (res.rank === 1 ? (t.prizes[0]?.prize || 0) : 0),
                  }
                : player;
            }),
          };
        }
        return t;
      })
    );
  };

  const handleApproveWithdrawal = (withdrawalId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'approved' } : w))
    );
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.referenceId === withdrawalId ? { ...tx, status: 'completed' } : tx
      )
    );
    showToast('Withdrawal marked approved and sent via UPI!');
  };

  const handleRejectWithdrawal = (withdrawalId: string) => {
    const wd = withdrawals.find((w) => w.id === withdrawalId);
    if (!wd) return;

    // Refund back to winning wallet
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        winning: prev.wallet.winning + wd.amount,
      },
    }));

    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'rejected' } : w))
    );
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.referenceId === withdrawalId ? { ...tx, status: 'failed' } : tx
      )
    );
    showToast('Withdrawal rejected. Amount refunded to player wallet.');
  };

  const handleResetData = () => {
    setUser(INITIAL_USER);
    setTournaments(INITIAL_TOURNAMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setLeaderboard(INITIAL_LEADERBOARD);
    localStorage.clear();
    showToast('Application reset to fresh tournament state.');
  };

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter((t) => {
    if (modeFilter === 'Scrim' && t.matchType !== 'Scrim') return false;
    if (modeFilter !== 'All' && modeFilter !== 'Scrim' && t.gameMode !== modeFilter) return false;
    if (mapFilter !== 'All' && t.map !== mapFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.map.toLowerCase().includes(q) ||
        t.gameMode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const joinedMatchesCount = tournaments.filter((t) =>
    t.registeredPlayers.some((p) => p.userId === user.id || p.username === user.username) &&
    t.status !== 'completed'
  ).length;

  // If logged out, show the user's authentic Login & Signup screens
  if (!isLoggedIn) {
    return (
      <AuthScreens
        onLoginSuccess={(username) => {
          setIsLoggedIn(true);
          localStorage.setItem('skillwar_logged_in', 'true');
          setUser((prev) => ({ ...prev, username: username || 's4mnxx' }));
        }}
        onAdminUnlock={() => {
          setIsAdminUnlocked(true);
          localStorage.setItem('skillwar_admin_unlocked', 'true');
        }}
        isAdminUnlocked={isAdminUnlocked}
      />
    );
  }

  // If Admin View is explicitly open
  if (isAdminViewOpen) {
    return (
      <AdminPanel
        tournaments={tournaments}
        withdrawals={withdrawals}
        onClose={() => setIsAdminViewOpen(false)}
        onCreateTournament={handleCreateTournament}
        onUpdateRoomDetails={handleUpdateRoomDetails}
        onSettleMatch={handleSettleMatch}
        onApproveWithdrawal={handleApproveWithdrawal}
        onRejectWithdrawal={handleRejectWithdrawal}
        onResetData={handleResetData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex justify-center selection:bg-[#8b5cf6] selection:text-white relative overflow-x-hidden font-sans">
      {/* Ambient Blurred Gradient Orbs (#8b5cf6 and #ec4899) */}
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-[#8b5cf6]/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-20 -right-20 w-96 h-96 bg-[#ec4899]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-grid-pattern opacity-35 pointer-events-none z-0" />

      {/* Confetti Effect with Emojis 🎉 on Join */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[99999] flex items-center justify-center overflow-hidden">
          {['🎉', '🏆', '⭐', '💥', '✨', '👑', '🎉', '🔥', '⚡', '🏆', '🎉', '✨'].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-3xl sm:text-4xl animate-confetti select-none"
              style={{
                left: `${10 + (i * 7.5)}%`,
                top: `${15 + (i % 4) * 15}%`,
                animationDelay: `${i * 0.12}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      {/* TOAST 2 NO - SUCCESS */}
      {toastMsg && (
        <div 
          id="toast" 
          className="fixed top-4 right-4 bg-[#22c55e] text-black px-5 py-3 rounded-2xl shadow-win z-[9999] text-[13px] font-black transition-all animate-in fade-in flex items-center gap-2 border border-green-300"
        >
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container: Adapts between Phone Simulator Frame and Full Responsive Layout */}
      <div
        className={`w-full bg-[#0d0d12]/95 backdrop-blur-xl min-h-screen relative pb-24 z-10 ${
          isSimulatorMode
            ? 'max-w-[430px] my-4 rounded-[40px] border-4 border-white/10 shadow-[0_0_60px_-15px_rgba(139,92,246,0.35)] overflow-hidden'
            : 'max-w-4xl mx-auto border-x border-white/5 shadow-2xl'
        }`}
      >
        {/* Sticky Mobile/Desktop Header */}
        <Header
          user={user}
          onOpenWallet={() => setActiveTab('wallet')}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenAdmin={() => setIsAdminViewOpen(true)}
          isSimulatorMode={isSimulatorMode}
          onToggleSimulator={() => setIsSimulatorMode(!isSimulatorMode)}
          adminUnlocked={isAdminUnlocked}
          isVipActive={isVipActive}
        />

        {/* TAB 1: TOURNAMENTS LOBBY */}
        {activeTab === 'lobby' && (
          <main className="p-4 space-y-5">
            {/* Hero Tournament Banner - Ultra Pro Glass Container */}
            <div className="relative rounded-[24px] overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src={ASSET_PATHS.heroBanner}
                alt="Free Fire Championship"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-black/50 to-transparent" />

              <div className="absolute inset-0 p-4.5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Live Season 2026
                  </span>
                  <span className="bg-black/60 text-white/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                    Garena FF MAX
                  </span>
                </div>
                <h1 className="text-2xl font-black uppercase text-white tracking-tight drop-shadow-lg">
                  Skill War Champions League
                </h1>
                <p className="text-xs text-white/70 flex items-center gap-2 mt-1 font-medium">
                  <span className="text-[#fbbf24] font-semibold">₹10,000+ Daily Pools</span>
                  <span>·</span>
                  <span>Per-Kill Cash Rewards</span>
                  <span>·</span>
                  <span>Custom Rooms</span>
                </p>
              </div>
            </div>

            {/* Search and Quick Map Selector */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search matches by map, mode, or tournament title..."
                  className="w-full backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#8b5cf6] transition-colors shadow-inner"
                />
              </div>

              {/* Game Mode Filters */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {(['All', 'Solo', 'Duo', 'Squad', 'CS 4v4', 'Scrim'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setModeFilter(mode)}
                    className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      modeFilter === mode
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-105'
                        : 'backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.1] text-white/60 border border-white/10 hover:text-white'
                    }`}
                  >
                    {mode === 'Scrim' ? 'Free Scrims' : mode}
                  </button>
                ))}
              </div>

              {/* Map Filter chips */}
              <div className="flex items-center gap-2 text-[11px] text-white/50 overflow-x-auto no-scrollbar">
                <span className="shrink-0 font-bold uppercase tracking-wider text-[10px]">Map:</span>
                {(['All', 'Bermuda', 'Purgatory', 'Kalahari', 'Alpine'] as const).map((map) => (
                  <button
                    key={map}
                    onClick={() => setMapFilter(map)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer font-bold ${
                      mapFilter === map
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {map}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournaments Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-[#ec4899]" />
                  Available Tournaments ({filteredTournaments.length})
                </h2>
                <span className="text-[11px] text-white/50 font-semibold">Custom Room Pass 15m Prior</span>
              </div>

              {filteredTournaments.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] p-8 text-center space-y-3">
                  <p className="text-sm font-black text-white">No tournaments match your filter</p>
                  <p className="text-xs text-white/60">Try switching game mode or map filters.</p>
                  <button
                    onClick={() => {
                      setModeFilter('All');
                      setMapFilter('All');
                      setSearchQuery('');
                    }}
                    className="py-2 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-xs font-black cursor-pointer shadow-md hover:scale-105 transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTournaments.map((tournament) => {
                    const isRegistered = tournament.registeredPlayers.some(
                      (p) => p.userId === user.id || p.username === user.username
                    );

                    return (
                      <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                        isRegistered={isRegistered}
                        onJoin={(t) => setSelectedJoinMatch(t)}
                        onViewRoom={(t) => setSelectedRoomMatch(t)}
                        onViewRules={(t) => setSelectedRulesMatch(t)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        )}

        {/* TAB 2: MY MATCHES */}
        {activeTab === 'matches' && (
          <main className="p-4">
            <MyMatchesView
              tournaments={tournaments}
              user={user}
              onViewRoom={(t) => setSelectedRoomMatch(t)}
              onExploreTournaments={() => setActiveTab('lobby')}
            />
          </main>
        )}

        {/* TAB 3: WALLET */}
        {activeTab === 'wallet' && (
          <main className="p-4">
            <WalletView
              user={user}
              transactions={transactions}
              withdrawals={withdrawals}
              depositSubmissions={depositSubmissions}
              onAddCash={handleAddCash}
              onSubmitPayment={handleSubmitPayment}
              onApproveDeposit={handleApproveDeposit}
              onRejectDeposit={handleRejectDeposit}
              onRequestWithdrawal={handleRequestWithdrawal}
              onGoHome={() => setActiveTab('lobby')}
              onSetMatchSchedule={handleSetMatchSchedule}
              vip={vip}
              onUpdateVip={setVip}
            />
          </main>
        )}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <main className="p-4">
            <LeaderboardView players={leaderboard} currentUser={user} />
          </main>
        )}

        {/* TAB 5: PROFILE / ACCOUNT */}
        {activeTab === 'profile' && (
          <main>
            <ProfileView
              user={user}
              onUpdateProfile={(updated) => {
                setUser((prev) => ({ ...prev, ...updated }));
                showToast('Profile updated!');
              }}
              onLogout={() => {
                setIsLoggedIn(false);
                localStorage.removeItem('skillwar_logged_in');
                showToast('Logged out');
              }}
              onOpenAdmin={() => setIsAdminViewOpen(true)}
              adminUnlocked={isAdminUnlocked}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </main>
        )}

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          joinedCount={joinedMatchesCount}
        />
      </div>

      {/* ========== SLOT SELECTION PAGE ========== */}
      {selectedJoinMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black animate-in fade-in">
          <div className="max-w-[440px] md:max-w-2xl mx-auto min-h-screen">
            <SlotSelectionPage
              tournament={selectedJoinMatch}
              user={user}
              onBack={() => setSelectedJoinMatch(null)}
              onConfirmJoin={handleConfirmJoin}
              onOpenAddCash={() => {
                setSelectedJoinMatch(null);
                setActiveTab('wallet');
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL 2: ROOM DETAILS */}
      {selectedRoomMatch && (
        <RoomDetailsModal
          tournament={selectedRoomMatch}
          onClose={() => setSelectedRoomMatch(null)}
          playerSlot={
            selectedRoomMatch.registeredPlayers.find(
              (p) => p.userId === user.id || p.username === user.username
            )?.slotNumber
          }
        />
      )}

      {/* MODAL 3: RULES MODAL */}
      {selectedRulesMatch && (
        <RulesModal
          tournament={selectedRulesMatch}
          onClose={() => setSelectedRulesMatch(null)}
        />
      )}
    </div>
  );
}
