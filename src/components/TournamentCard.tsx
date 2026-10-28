import React, { useState, useEffect } from 'react';
import { Tournament } from '../types';
import { Clock, ShieldAlert, Key, Swords, MapPin, Target, Trophy, Flame } from 'lucide-react';
import { ASSET_PATHS } from '../data/mockData';

interface TournamentCardProps {
  tournament: Tournament;
  isRegistered: boolean;
  onJoin: (tournament: Tournament) => void;
  onViewRoom: (tournament: Tournament) => void;
  onViewRules: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  isRegistered,
  onJoin,
  onViewRoom,
  onViewRules,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const diff = tournament.startEpoch - Date.now();
      if (diff <= 0) {
        setTimeLeft(tournament.status === 'completed' ? 'Finished' : 'Started');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        setTimeLeft(`${Math.floor(hours / 24)}d left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [tournament.startEpoch, tournament.status]);

  const spotsLeft = tournament.maxSpots - tournament.joinedSpots;
  const fillPercentage = Math.min(100, Math.round((tournament.joinedSpots / tournament.maxSpots) * 100));

  return (
    <div className="relative bg-gradient-to-br from-[#1e1e2e] via-[#151515] to-black p-[1px] rounded-[24px] shadow-2xl group hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300">
      <div className="bg-[#121212] backdrop-blur-xl rounded-[23px] p-4.5 border border-white/5 space-y-3.5">
        
        {/* Top Badges Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              LIVE
            </span>
            <span className="bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ec4899]" />
              {tournament.map}
            </span>
            <span className="bg-[#8b5cf6]/15 text-[#8b5cf6] border border-[#8b5cf6]/30 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
              {tournament.gameMode}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide flex items-center gap-1 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <Trophy className="w-3 h-3 text-yellow-400" />
              ₹{tournament.prizePool} PRIZE
            </span>
          </div>
        </div>

        {/* Tournament Title & Countdown */}
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-black text-[18px] text-white tracking-tight leading-snug">
              {tournament.title}
            </h3>
            <span className="bg-black/60 text-orange-400 border border-orange-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 mt-0.5">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </span>
          </div>
          <p className="text-[12px] text-white/60 flex items-center gap-1.5 mt-0.5">
            <span>{tournament.startTime}</span>
            <span className="text-white/20">•</span>
            <span className="text-[#ec4899] font-semibold">{tournament.matchType}</span>
          </p>
        </div>

        {/* Stats Matrix: Entry, Per Kill, Total Prize */}
        <div className="grid grid-cols-3 gap-2 bg-[#17171f] p-2.5 rounded-2xl border border-white/5 text-center">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Entry Fee</p>
            <p className="font-semibold text-sm text-white">
              {tournament.entryFee === 0 ? (
                <span className="text-emerald-400 font-black">FREE</span>
              ) : (
                `₹${tournament.entryFee}`
              )}
            </p>
          </div>
          <div className="border-x border-white/10">
            <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold flex items-center justify-center gap-0.5">
              <Target className="w-2.5 h-2.5 text-yellow-400" /> Per Kill
            </p>
            <p className="font-semibold text-sm text-yellow-400">
              ₹{tournament.perKill}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Total Pool</p>
            <p className="font-semibold text-sm text-emerald-400">
              ₹{tournament.prizePool}
            </p>
          </div>
        </div>

        {/* Progress Bar: Prize bar with animate-pulse and gradient flow */}
        <div>
          <div className="w-full bg-black/90 rounded-full h-2.5 overflow-hidden border border-white/5 p-0.5">
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 animate-gradient-flow"
              style={{ width: `${Math.max(8, fillPercentage)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] mt-2 text-white/60">
            <span className="font-medium">
              <strong className="text-white font-semibold">{tournament.joinedSpots}</strong>/{tournament.maxSpots} Joined
            </span>
            <span className="text-orange-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              {spotsLeft > 0 ? `${spotsLeft} Slots Left` : 'Match Full'}
            </span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-1">
          {/* Rules icon button */}
          <button
            onClick={() => onViewRules(tournament)}
            className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Match Rules & Gun Ban Policies"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {isRegistered ? (
            <button
              onClick={() => onViewRoom(tournament)}
              className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-win transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>ROOM ID & PASSWORD</span>
            </button>
          ) : (
            <button
              onClick={() => onJoin(tournament)}
              disabled={spotsLeft <= 0 || tournament.status === 'completed'}
              className={`flex-1 py-3.5 px-4 rounded-full font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                spotsLeft <= 0 || tournament.status === 'completed'
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>
                {spotsLeft <= 0
                  ? 'HOUSE FULL'
                  : tournament.status === 'completed'
                  ? 'COMPLETED'
                  : `JOIN NOW • ${tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}`}
              </span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
