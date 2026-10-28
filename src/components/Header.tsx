import React from 'react';
import { User } from '../types';
import { Smartphone, Laptop, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  user: User;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  isSimulatorMode: boolean;
  onToggleSimulator: () => void;
  adminUnlocked: boolean;
  isVipActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenWallet,
  onOpenProfile,
  onOpenAdmin,
  isSimulatorMode,
  onToggleSimulator,
  adminUnlocked,
  isVipActive = false,
}) => {
  const totalBalance = user.wallet.deposit + user.wallet.winning + user.wallet.bonus;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#080808]/85 border-b border-white/10 px-3.5 py-3 flex justify-between items-center transition-all">
      {/* Top Left: Logo with Glowing Orange Dot + Live Indicator + ADMIN & VIP */}
      <div 
        onClick={onOpenProfile}
        className="flex gap-2.5 items-center cursor-pointer group select-none"
      >
        {/* Avatar with glowing orange ping dot */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-lg select-none shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform font-black">
            {user.avatar || '🔥'}
          </div>
          {/* Glowing orange dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border border-black shadow-[0_0_8px_#f97316]"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-black text-sm text-white leading-tight">
              {user.username}
            </p>
            <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded font-black text-white uppercase tracking-wider shadow-sm">
              ADMIN
            </span>
            {/* VIP badge with animate-bounce and shadow-gold */}
            <span 
              id="vipBadge" 
              className={`${isVipActive ? '' : 'hidden'} bg-[#fbbf24] text-black text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-bounce shadow-gold`}
            >
              VIP 👑
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider">
              FREE FIRE MAX
            </p>
            {/* Live Indicator */}
            <span className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Device Mode toggle and Wallet balance pill */}
      <div className="flex items-center gap-2">
        {/* Device toggle (for desktop view testing) */}
        <button
          onClick={onToggleSimulator}
          title={isSimulatorMode ? "Switch to Wide Layout" : "Switch to Phone Frame"}
          className="hidden md:flex items-center gap-1 text-[11px] text-white/50 hover:text-white px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
        >
          {isSimulatorMode ? <Laptop className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
        </button>

        {/* User's signature wallet trigger with font-semibold for money */}
        <button
          onClick={onOpenWallet}
          className="bg-[#151515] hover:bg-[#202020] border border-yellow-500/50 hover:border-yellow-400 px-3.5 py-1.5 rounded-full text-sm flex items-center gap-1.5 font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 text-white shadow-[0_0_15px_rgba(251,191,36,0.15)]"
        >
          <span className="text-yellow-400">₹</span>
          <span id="bal" className="font-semibold text-white tracking-wide">
            {totalBalance}
          </span>
          <span className="text-white/40 text-xs ml-0.5">| +</span>
        </button>
      </div>
    </header>
  );
};
