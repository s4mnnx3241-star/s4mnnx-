import React from 'react';
import { Flame, Trophy, Wallet, User as UserIcon, Swords, Percent } from 'lucide-react';

export type NavTab = 'lobby' | 'matches' | 'wallet' | 'leaderboard' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  joinedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  joinedCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[440px] mx-auto md:max-w-none backdrop-blur-xl bg-[#080808]/90 border-t border-white/10 rounded-t-[26px] flex justify-around items-center py-2.5 px-3 select-none shadow-[0_-10px_35px_rgba(139,92,246,0.25)]">
      {/* 1. My Matches */}
      <button
        onClick={() => onChangeTab('matches')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-300 relative cursor-pointer ${
          activeTab === 'matches'
            ? 'text-[#8b5cf6] scale-110 drop-shadow-[0_0_14px_rgba(139,92,246,0.9)]'
            : 'text-white/50 hover:text-white/80 hover:scale-105 active:scale-95'
        }`}
        title="My Matches"
      >
        <div className="relative">
          <Swords className="w-5 h-5 stroke-[2.2]" />
          {joinedCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-md">
              {joinedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-1 tracking-tight">Matches</span>
        {activeTab === 'matches' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mt-0.5 shadow-[0_0_8px_#8b5cf6]" />
        )}
      </button>

      {/* 2. Leaderboard */}
      <button
        onClick={() => onChangeTab('leaderboard')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-300 cursor-pointer ${
          activeTab === 'leaderboard'
            ? 'text-[#8b5cf6] scale-110 drop-shadow-[0_0_14px_rgba(139,92,246,0.9)]'
            : 'text-white/50 hover:text-white/80 hover:scale-105 active:scale-95'
        }`}
        title="Leaderboard"
      >
        <Trophy className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] font-bold mt-1 tracking-tight">Ranking</span>
        {activeTab === 'leaderboard' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mt-0.5 shadow-[0_0_8px_#8b5cf6]" />
        )}
      </button>

      {/* 3. Home / Lobby (Central highlighted item) */}
      <button
        onClick={() => onChangeTab('lobby')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-300 cursor-pointer ${
          activeTab === 'lobby'
            ? 'text-[#8b5cf6] scale-115 drop-shadow-[0_0_16px_rgba(139,92,246,1)]'
            : 'text-white/50 hover:text-white/80 hover:scale-105 active:scale-95'
        }`}
        title="Tournament Lobby"
      >
        <div className={`p-1.5 rounded-full ${activeTab === 'lobby' ? 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/40' : ''}`}>
          <Flame className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[10px] font-black mt-0.5 tracking-tight">Lobby</span>
        {activeTab === 'lobby' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mt-0.5 shadow-[0_0_8px_#8b5cf6]" />
        )}
      </button>

      {/* 4. Wallet */}
      <button
        onClick={() => onChangeTab('wallet')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-300 cursor-pointer ${
          activeTab === 'wallet'
            ? 'text-[#8b5cf6] scale-110 drop-shadow-[0_0_14px_rgba(139,92,246,0.9)]'
            : 'text-white/50 hover:text-white/80 hover:scale-105 active:scale-95'
        }`}
        title="Wallet"
      >
        <Wallet className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] font-bold mt-1 tracking-tight">Wallet</span>
        {activeTab === 'wallet' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mt-0.5 shadow-[0_0_8px_#8b5cf6]" />
        )}
      </button>

      {/* 5. Account / Profile */}
      <button
        onClick={() => onChangeTab('profile')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-300 cursor-pointer ${
          activeTab === 'profile'
            ? 'text-[#8b5cf6] scale-110 drop-shadow-[0_0_14px_rgba(139,92,246,0.9)]'
            : 'text-white/50 hover:text-white/80 hover:scale-105 active:scale-95'
        }`}
        title="Account Profile"
      >
        <UserIcon className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] font-bold mt-1 tracking-tight">Account</span>
        {activeTab === 'profile' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mt-0.5 shadow-[0_0_8px_#8b5cf6]" />
        )}
      </button>
    </div>
  );
};
