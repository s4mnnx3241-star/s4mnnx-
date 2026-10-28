import React, { useState } from 'react';
import { LeaderboardPlayer, User } from '../types';
import { Crown, Trophy, Sparkles } from 'lucide-react';

interface LeaderboardViewProps {
  players: LeaderboardPlayer[];
  currentUser: User;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  players,
  currentUser,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'allTime'>('weekly');

  // Specific top 3 matching user's screenshot
  const rank1 = players.find(p => p.username === 'harshexe') || {
    username: 'harshexe',
    ign: 'harshexe',
    avatar: 'https://i.pravatar.cc/100?img=2',
    totalEarnings: 1875,
    kills: 285,
  };

  const rank2 = players.find(p => p.username === 'zrex') || {
    username: 'zrex',
    ign: 'zrex',
    avatar: 'https://i.pravatar.cc/100?img=1',
    totalEarnings: 1280,
    kills: 198,
  };

  const rank3 = players.find(p => p.username === 'Nxttiger') || {
    username: 'Nxttiger',
    ign: 'Nxttiger',
    avatar: 'https://i.pravatar.cc/100?img=3',
    totalEarnings: 1194,
    kills: 174,
  };

  const remaining = players.filter(p => !['harshexe', 'zrex', 'Nxttiger'].includes(p.username));

  return (
    <div id="p-rank" className="bg-black min-h-screen text-white pb-20">
      {/* TOP PODIUM HEADER MATCHING USER'S SCREENSHOT */}
      <div className="bg-[#7c3aed] rounded-b-[40px] p-6 text-center flex justify-around items-end shadow-2xl relative overflow-hidden">
        {/* Rank 2 (zrex) */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={rank2.avatar}
            alt={rank2.ign}
            className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white/40 shadow-md"
          />
          <p className="font-bold text-sm mt-1.5">{rank2.ign}</p>
          <p className="text-[11px] text-purple-200 font-mono font-semibold">
            WIN - {rank2.totalEarnings}
          </p>
          <span className="text-[10px] bg-black/30 text-white font-mono px-2 py-0.5 rounded-full mt-1">
            2nd Place
          </span>
        </div>

        {/* Rank 1 (harshexe - Winner with yellow border) */}
        <div className="flex-1 flex flex-col items-center -mt-4">
          <Crown className="w-6 h-6 text-yellow-300 mx-auto mb-1 animate-bounce" />
          <img
            src={rank1.avatar}
            alt={rank1.ign}
            className="w-20 h-20 rounded-full mx-auto border-4 border-yellow-400 object-cover shadow-xl ring-4 ring-yellow-400/30"
          />
          <p className="font-bold text-base mt-1.5 text-yellow-300">{rank1.ign}</p>
          <p className="text-xs text-white font-mono font-black">
            WIN - {rank1.totalEarnings}
          </p>
          <span className="text-[10px] bg-yellow-400 text-black font-black px-2 py-0.5 rounded-full mt-1">
            CHAMPION
          </span>
        </div>

        {/* Rank 3 (Nxttiger) */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={rank3.avatar}
            alt={rank3.ign}
            className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white/40 shadow-md"
          />
          <p className="font-bold text-sm mt-1.5">{rank3.ign}</p>
          <p className="text-[11px] text-purple-200 font-mono font-semibold">
            WIN - {rank3.totalEarnings}
          </p>
          <span className="text-[10px] bg-black/30 text-white font-mono px-2 py-0.5 rounded-full mt-1">
            3rd Place
          </span>
        </div>
      </div>

      {/* Ranks 4+ List and controls */}
      <div className="p-4 space-y-4">
        {/* Timeframe switch */}
        <div className="flex bg-[#121622] p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              timeframe === 'weekly' ? 'bg-[#7c3aed] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Champions
          </button>
          <button
            onClick={() => setTimeframe('allTime')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              timeframe === 'allTime' ? 'bg-[#7c3aed] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time Hall of Fame
          </button>
        </div>

        {/* Table of runners up */}
        <div className="bg-[#121622] rounded-2xl border border-white/10 p-3 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            <span>Rank & Player</span>
            <div className="flex gap-8">
              <span>Kills</span>
              <span>Winnings</span>
            </div>
          </div>

          {remaining.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-2.5 bg-[#0a0d14] rounded-xl border border-white/5 flex items-center justify-between text-xs hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-400 w-4 text-center">
                  #{idx + 4}
                </span>
                <div className="w-8 h-8 rounded-full bg-purple-950 flex items-center justify-center text-sm font-bold border border-purple-500/30">
                  {p.avatar && p.avatar.startsWith('http') ? (
                    <img src={p.avatar} alt={p.ign} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    p.avatar || '⚡'
                  )}
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">{p.ign}</p>
                  <p className="text-[10px] text-purple-300">{p.tier || 'Heroic'}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <span className="font-mono font-bold text-amber-400 text-xs w-10 text-center">
                  {p.kills}
                </span>
                <span className="font-mono font-bold text-emerald-400 text-xs w-16">
                  WIN - {p.totalEarnings}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Standing Card */}
        <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-[#1e103f] to-indigo-950/80 border border-purple-500/50 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-black text-white text-base">
              {currentUser.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white">Your Rank: #02</p>
              <p className="text-[11px] text-purple-300">
                {currentUser.stats.totalKills} Kills · {currentUser.stats.booyahs} Booyahs
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono font-black text-emerald-400 text-sm">
              WIN - {currentUser.stats.totalWinnings}
            </p>
            <span className="text-[9px] text-slate-400 font-semibold uppercase">Total Won</span>
          </div>
        </div>
      </div>
    </div>
  );
};
