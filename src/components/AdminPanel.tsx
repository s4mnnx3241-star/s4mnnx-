import React, { useState } from 'react';
import { Tournament, WithdrawalRequest, GameMode, MapType } from '../types';
import { 
  Shield, 
  Plus, 
  Key, 
  CheckCircle2, 
  X, 
  Trophy, 
  Users, 
  CreditCard, 
  ArrowLeft,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  tournaments: Tournament[];
  withdrawals: WithdrawalRequest[];
  onClose: () => void;
  onCreateTournament: (tournament: Omit<Tournament, 'id' | 'joinedSpots' | 'registeredPlayers'>) => void;
  onUpdateRoomDetails: (tournamentId: string, roomId: string, roomPass: string) => void;
  onSettleMatch: (tournamentId: string, results: { userId: string; kills: number; rank: number }[]) => void;
  onApproveWithdrawal: (withdrawalId: string) => void;
  onRejectWithdrawal: (withdrawalId: string) => void;
  onResetData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  tournaments,
  withdrawals,
  onClose,
  onCreateTournament,
  onUpdateRoomDetails,
  onSettleMatch,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onResetData,
}) => {
  const [tab, setTab] = useState<'tournaments' | 'settlement' | 'withdrawals'>('tournaments');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Tournament form state
  const [title, setTitle] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('Solo');
  const [map, setMap] = useState<MapType>('Bermuda');
  const [entryFee, setEntryFee] = useState<number>(20);
  const [perKill, setPerKill] = useState<number>(10);
  const [prizePool, setPrizePool] = useState<number>(500);
  const [maxSpots, setMaxSpots] = useState<number>(48);
  const [startTime, setStartTime] = useState('Today, 11:30 PM');

  // Room ID state
  const [selectedMatchForRoom, setSelectedMatchForRoom] = useState<string>(tournaments[0]?.id || '');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPassInput, setRoomPassInput] = useState('');

  // Settlement state
  const [settleMatchId, setSettleMatchId] = useState<string>(tournaments[0]?.id || '');
  const selectedSettleTournament = tournaments.find((t) => t.id === settleMatchId);
  const [playerScores, setPlayerScores] = useState<Record<string, { kills: number; rank: number }>>({});

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTournament({
      title: title.trim(),
      gameMode,
      map,
      matchType: entryFee > 50 ? 'Mega' : entryFee === 0 ? 'Scrim' : 'Daily',
      entryFee,
      perKill,
      prizePool,
      prizes: [
        { rank: 1, prize: Math.round(prizePool * 0.6), label: '1st (Booyah)' },
        { rank: 2, prize: Math.round(prizePool * 0.25), label: '2nd Place' },
        { rank: 3, prize: Math.round(prizePool * 0.15), label: '3rd Place' },
      ],
      maxSpots,
      startTime,
      startEpoch: Date.now() + 1000 * 60 * 60,
      status: 'upcoming',
      roomId: null,
      roomPassword: null,
      rules: [
        'Level 20+ Free Fire account required.',
        'Mobile players only. No emulator.',
        'Gun attributes OFF.',
      ],
    });

    setTitle('');
    showToast('Match created successfully!');
  };

  const handlePublishRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomIdInput || !roomPassInput) return;

    onUpdateRoomDetails(selectedMatchForRoom, roomIdInput.trim(), roomPassInput.trim());
    showToast(`Room ID & Password published for match ${selectedMatchForRoom}!`);
    setRoomIdInput('');
    setRoomPassInput('');
  };

  const handleDistributePrizes = () => {
    if (!selectedSettleTournament) return;
    const results = selectedSettleTournament.registeredPlayers.map((p) => {
      const score = playerScores[p.userId] || { kills: 3, rank: 1 };
      return {
        userId: p.userId,
        kills: score.kills,
        rank: score.rank,
      };
    });

    onSettleMatch(settleMatchId, results);
    showToast(`Prizes distributed & winning wallets credited for ${selectedSettleTournament.title}!`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between bg-[#10141f] p-4 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>Skill War Admin Console</span>
                <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                  MASTER
                </span>
              </h1>
              <p className="text-xs text-slate-400">Manage Free Fire rooms, score settlement & UPI payouts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              title="Reset data back to initial mock state"
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
          </div>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex bg-[#10141f] p-1.5 rounded-xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setTab('tournaments')}
            className={`flex-1 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              tab === 'tournaments' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Tournaments & Room Keys</span>
          </button>
          <button
            onClick={() => setTab('settlement')}
            className={`flex-1 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              tab === 'settlement' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Match Results & Auto-Payout</span>
          </button>
          <button
            onClick={() => setTab('withdrawals')}
            className={`flex-1 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              tab === 'withdrawals' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>UPI Withdrawals ({withdrawals.filter(w => w.status === 'pending').length})</span>
          </button>
        </div>

        {/* TAB 1: TOURNAMENTS & ROOM DETAILS */}
        {tab === 'tournaments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Tournament Form */}
            <div className="bg-[#10141f] border border-white/10 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" />
                Host New Free Fire Tournament
              </h2>

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Match Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bermuda Midnight Clash #110"
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Game Mode</label>
                    <select
                      value={gameMode}
                      onChange={(e) => {
                        const m = e.target.value as GameMode;
                        setGameMode(m);
                        setMaxSpots(m === 'CS 4v4' ? 8 : 48);
                      }}
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Solo">Solo (BR)</option>
                      <option value="Duo">Duo (BR)</option>
                      <option value="Squad">Squad (BR)</option>
                      <option value="CS 4v4">Clash Squad (4v4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Map</label>
                    <select
                      value={map}
                      onChange={(e) => setMap(e.target.value as MapType)}
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Bermuda">Bermuda</option>
                      <option value="Purgatory">Purgatory</option>
                      <option value="Kalahari">Kalahari</option>
                      <option value="Alpine">Alpine</option>
                      <option value="NexTerra">NexTerra</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Entry Fee (₹)</label>
                    <input
                      type="number"
                      value={entryFee}
                      onChange={(e) => setEntryFee(Number(e.target.value))}
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Per Kill (₹)</label>
                    <input
                      type="number"
                      value={perKill}
                      onChange={(e) => setPerKill(Number(e.target.value))}
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Prize Pool (₹)</label>
                    <input
                      type="number"
                      value={prizePool}
                      onChange={(e) => setPrizePool(Number(e.target.value))}
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Max Spots</label>
                    <input
                      type="number"
                      value={maxSpots}
                      onChange={(e) => setMaxSpots(Number(e.target.value))}
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Start Schedule</label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="Today, 11:30 PM"
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                >
                  Publish Tournament
                </button>
              </form>
            </div>

            {/* Room ID & Pass Publisher */}
            <div className="bg-[#10141f] border border-white/10 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Publish In-Game Custom Room ID
              </h2>
              <p className="text-xs text-slate-400">
                Created a custom room in Free Fire? Broadcast credentials directly to all registered survivors!
              </p>

              <form onSubmit={handlePublishRoom} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Select Active Match</label>
                  <select
                    value={selectedMatchForRoom}
                    onChange={(e) => setSelectedMatchForRoom(e.target.value)}
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {tournaments
                      .filter((t) => t.status !== 'completed')
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.joinedSpots}/{t.maxSpots} players)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Custom Room ID</label>
                  <input
                    type="text"
                    required
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    placeholder="e.g. 8492019"
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Room Password</label>
                  <input
                    type="text"
                    required
                    value={roomPassInput}
                    onChange={(e) => setRoomPassInput(e.target.value)}
                    placeholder="e.g. 993"
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                >
                  Broadcast Room ID & Pass
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: SETTLEMENT & AUTO-PAYOUT */}
        {tab === 'settlement' && (
          <div className="bg-[#10141f] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Score Settlement & Prize Distribution
                </h2>
                <p className="text-xs text-slate-400">
                  Select a match, verify kills and final ranks, and credit winning wallets with 1-click.
                </p>
              </div>

              <select
                value={settleMatchId}
                onChange={(e) => setSettleMatchId(e.target.value)}
                className="bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} [{t.status}]
                  </option>
                ))}
              </select>
            </div>

            {selectedSettleTournament ? (
              <div className="space-y-4">
                <div className="p-3 bg-[#07090e] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Per Kill Reward: </span>
                    <span className="text-amber-400 font-bold font-mono">₹{selectedSettleTournament.perKill}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">1st Place Pool: </span>
                    <span className="text-emerald-400 font-bold font-mono">₹{selectedSettleTournament.prizes[0]?.prize || 300}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Registered Players: </span>
                    <span className="text-white font-bold">{selectedSettleTournament.registeredPlayers.length}</span>
                  </div>
                </div>

                <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
                  <div className="bg-black/40 p-2.5 grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="col-span-1">Slot</span>
                    <span className="col-span-5">Player (IGN & UID)</span>
                    <span className="col-span-3">Kills Made</span>
                    <span className="col-span-3">Final Rank</span>
                  </div>

                  {selectedSettleTournament.registeredPlayers.map((player) => {
                    const currentScore = playerScores[player.userId] || { kills: 3, rank: 1 };

                    return (
                      <div key={player.userId} className="p-2.5 grid grid-cols-12 items-center text-xs">
                        <span className="col-span-1 font-mono text-slate-400">#{player.slotNumber}</span>
                        <div className="col-span-5">
                          <p className="font-bold text-white">{player.ign}</p>
                          <p className="text-[10px] text-slate-400 font-mono">UID: {player.uid}</p>
                        </div>
                        <div className="col-span-3 pr-2">
                          <input
                            type="number"
                            min="0"
                            value={currentScore.kills}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setPlayerScores((prev) => ({
                                ...prev,
                                [player.userId]: { ...currentScore, kills: val },
                              }));
                            }}
                            className="w-16 bg-[#07090e] border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="col-span-3">
                          <select
                            value={currentScore.rank}
                            onChange={(e) => {
                              const r = Number(e.target.value);
                              setPlayerScores((prev) => ({
                                ...prev,
                                [player.userId]: { ...currentScore, rank: r },
                              }));
                            }}
                            className="bg-[#07090e] border border-white/10 rounded px-2 py-1 text-xs text-white"
                          >
                            <option value={1}>#1 (Booyah)</option>
                            <option value={2}>#2 Place</option>
                            <option value={3}>#3 Place</option>
                            <option value={4}>Survivor (No pod)</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleDistributePrizes}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Distribute Winnings & Auto-Credit Player Wallets</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a tournament to settle results.</p>
            )}
          </div>
        )}

        {/* TAB 3: WITHDRAWAL REQUESTS */}
        {tab === 'withdrawals' && (
          <div className="bg-[#10141f] border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Manage UPI Cash-out Requests
            </h2>
            <p className="text-xs text-slate-400">
              Approve player prize payouts directly to their Google Pay / PhonePe / Paytm VPAs.
            </p>

            <div className="space-y-3">
              {withdrawals.length === 0 ? (
                <p className="text-xs text-slate-400">No withdrawal requests found.</p>
              ) : (
                withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 bg-[#07090e] rounded-xl border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Player: {w.username}</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">₹{w.amount}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {w.method}: {w.payeeAddress} · {w.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {w.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => onApproveWithdrawal(w.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                          >
                            Approve UPI
                          </button>
                          <button
                            onClick={() => onRejectWithdrawal(w.id)}
                            className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg font-bold text-xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            w.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {w.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
