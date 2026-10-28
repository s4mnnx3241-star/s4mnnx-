import React, { useState } from 'react';
import { Tournament, User } from '../types';
import { Clock, Key, Award, Trophy, Swords, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { ASSET_PATHS } from '../data/mockData';

interface MyMatchesViewProps {
  tournaments: Tournament[];
  user: User;
  onViewRoom: (tournament: Tournament) => void;
  onExploreTournaments: () => void;
}

export const MyMatchesView: React.FC<MyMatchesViewProps> = ({
  tournaments,
  user,
  onViewRoom,
  onExploreTournaments,
}) => {
  const [filter, setFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [showClaimModal, setShowClaimModal] = useState<Tournament | null>(null);
  const [claimKills, setClaimKills] = useState<string>('5');
  const [claimNote, setClaimNote] = useState<string>('');
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);

  // Filter tournaments where user is in registeredPlayers
  const registeredMatches = tournaments.filter((t) =>
    t.registeredPlayers.some((p) => p.userId === user.id || p.username === user.username)
  );

  const displayedMatches = registeredMatches.filter((t) => {
    if (filter === 'upcoming') {
      return t.status === 'upcoming' || t.status === 'filling' || t.status === 'live';
    }
    return t.status === 'completed';
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setShowClaimModal(null);
    }, 2000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Title & Filter Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">My Free Fire Matches</h2>
          <p className="text-xs text-slate-400">Track registrations, custom room passes & scores</p>
        </div>
      </div>

      <div className="flex bg-[#0f141f] p-1 rounded-xl border border-white/5 text-xs font-semibold">
        <button
          onClick={() => setFilter('upcoming')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            filter === 'upcoming' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Upcoming & Live ({registeredMatches.filter(m => m.status !== 'completed').length})</span>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            filter === 'completed' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Completed ({registeredMatches.filter(m => m.status === 'completed').length})</span>
        </button>
      </div>

      {/* Matches List */}
      {displayedMatches.length === 0 ? (
        <div className="bg-[#121622] border border-white/10 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-sm">No {filter} matches found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {filter === 'upcoming'
              ? 'You have not joined any upcoming Free Fire tournaments yet.'
              : 'You do not have completed match records yet.'}
          </p>
          <button
            onClick={onExploreTournaments}
            className="py-2.5 px-5 pill-btn text-xs font-bold shadow-md shadow-purple-950/40"
          >
            Explore Tournaments
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedMatches.map((match) => {
            const playerInfo = match.registeredPlayers.find(
              (p) => p.userId === user.id || p.username === user.username
            );

            return (
              <div
                key={match.id}
                className="bg-[#121622] border border-white/10 rounded-2xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/20">
                        {match.gameMode}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {match.map} · {match.startTime}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm mt-1">{match.title}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      match.status === 'completed'
                        ? 'bg-slate-800 text-slate-300'
                        : match.status === 'live'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {match.status.toUpperCase()}
                  </span>
                </div>

                {/* Player slot & match info */}
                <div className="grid grid-cols-3 gap-2 bg-[#0a0d14] p-2.5 rounded-xl border border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Your Slot</span>
                    <span className="font-mono font-bold text-white">#{playerInfo?.slotNumber || 14}</span>
                  </div>
                  <div className="border-x border-white/10">
                    <span className="text-[10px] text-slate-400 block font-semibold">Per Kill</span>
                    <span className="font-mono font-bold text-amber-400">₹{match.perKill}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Prize Pool</span>
                    <span className="font-mono font-bold text-emerald-400">₹{match.prizePool}</span>
                  </div>
                </div>

                {/* Status specific actions */}
                {match.status !== 'completed' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onViewRoom(match)}
                      className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{match.roomId ? 'View Room ID & Password' : 'Room ID (Pending Release)'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Result: <span className="text-white font-bold">{playerInfo?.rank ? `#${playerInfo.rank} Place` : 'Rank Pending'}</span>
                      </p>
                      <p className="text-[11px] text-emerald-400 font-bold">
                        Winnings: ₹{playerInfo?.winnings || 0} ({playerInfo?.kills || 0} Kills)
                      </p>
                    </div>

                    <button
                      onClick={() => setShowClaimModal(match)}
                      className="py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-slate-300"
                    >
                      Dispute / Claim
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Claim / Dispute Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#121622] border border-white/10 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-white font-bold text-sm">Submit Match Proof / Claim</h3>
            <p className="text-xs text-slate-400">
              Upload your endgame screenshot or enter your final kills for admin verification.
            </p>

            {claimSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Claim submitted! Our referee will verify and credit any missing amount.</span>
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Total Kills in this Match</label>
                <input
                  type="number"
                  value={claimKills}
                  onChange={(e) => setClaimKills(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Additional Notes</label>
                <textarea
                  value={claimNote}
                  onChange={(e) => setClaimNote(e.target.value)}
                  placeholder="e.g. Booyah with 5 kills, teammate disconnected at round 3"
                  rows={2}
                  className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="p-3 border-2 border-dashed border-white/10 rounded-xl text-center space-y-1 bg-white/5">
                <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">Screenshot Attached (FreeFire_EndGame.jpg)</p>
                <p className="text-[10px] text-slate-400">Verified by optical OCR engine</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(null)}
                  className="py-2.5 px-4 rounded-xl border border-white/10 text-slate-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 pill-btn text-xs font-bold"
                >
                  Submit Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
