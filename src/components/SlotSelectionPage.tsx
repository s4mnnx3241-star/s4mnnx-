import React, { useState } from 'react';
import { Tournament, User } from '../types';
import { UserCheck, Lock, AlertCircle, PlusCircle, Check, Edit3, ShieldAlert } from 'lucide-react';

interface SlotSelectionPageProps {
  tournament: Tournament;
  user: User;
  onBack: () => void;
  onConfirmJoin: (data: {
    ign: string;
    uid: string;
    slotNumber: number;
    teammates?: string[];
  }) => void;
  onOpenAddCash: () => void;
}

export const SlotSelectionPage: React.FC<SlotSelectionPageProps> = ({
  tournament,
  user,
  onBack,
  onConfirmJoin,
  onOpenAddCash,
}) => {
  // Pre-calculate occupied slots
  const totalSlots = tournament.maxSpots || 48;

  // Map of registered slots
  const registeredSlotsMap = new Map<number, { username: string; ign: string; isMe: boolean }>();

  tournament.registeredPlayers.forEach((p) => {
    registeredSlotsMap.set(p.slotNumber, {
      username: p.username,
      ign: p.ign,
      isMe: p.userId === user.id || p.username === user.username,
    });
  });

  // If joinedSpots > registeredPlayers.length, deterministically fill other occupied slots
  const bookedSet = new Set<number>(registeredSlotsMap.keys());
  let seeded = 1;
  while (bookedSet.size < tournament.joinedSpots && seeded <= totalSlots) {
    if (!bookedSet.has(seeded)) {
      bookedSet.add(seeded);
      registeredSlotsMap.set(seeded, {
        username: `player_${seeded}`,
        ign: `PLAYER_${seeded}`,
        isMe: false,
      });
    }
    seeded++;
  }

  // Find first available slot for default selection
  const firstAvailableSlot = (() => {
    for (let i = 1; i <= totalSlots; i++) {
      if (!bookedSet.has(i)) return i;
    }
    return 1;
  })();

  const [selectedSlot, setSelectedSlot] = useState<number>(firstAvailableSlot);
  const [ign, setIgn] = useState(user.ffIgn || user.username);
  const [uid, setUid] = useState(user.ffUid || '2849102941');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalBalance = user.wallet.deposit + user.wallet.winning + user.wallet.bonus;
  const hasEnoughBalance = totalBalance >= tournament.entryFee;

  // Title format matching user's header: "FULL MAP SOLO || SKIN ON || HORSE BAN"
  const formattedTitle = tournament.title.toUpperCase().includes('||')
    ? tournament.title
    : `${tournament.title.toUpperCase()} || ${tournament.gameMode.toUpperCase()} || ${tournament.map.toUpperCase()}`;

  const handleJoinNow = () => {
    setError(null);

    if (!selectedSlot) {
      setError('Please select an available match position slot.');
      return;
    }

    if (bookedSet.has(selectedSlot)) {
      setError(`Slot #${selectedSlot} is already booked. Please choose another slot.`);
      return;
    }

    if (!ign.trim()) {
      setError('Please enter your Free Fire In-Game Name (IGN).');
      return;
    }

    if (!uid.trim()) {
      setError('Please enter your Free Fire UID.');
      return;
    }

    if (!hasEnoughBalance && tournament.entryFee > 0) {
      setError(`Insufficient wallet balance. You need ₹${tournament.entryFee}.`);
      return;
    }

    onConfirmJoin({
      ign: ign.trim(),
      uid: uid.trim(),
      slotNumber: selectedSlot,
    });
  };

  return (
    <div id="p-slot" className="bg-[#080808] min-h-screen text-white pb-28 font-sans">
      {/* HEADER MATCHING USER'S SNIPPET */}
      <div className="bg-gradient-to-r from-[#5f259f] to-[#2a0a4a] p-4 flex items-center gap-3 sticky top-0 z-30 shadow-lg border-b border-white/10 backdrop-blur-xl">
        <span
          onClick={onBack}
          className="text-2xl cursor-pointer select-none hover:text-purple-300 transition-colors"
        >
          ←
        </span>
        <h1 className="text-[15px] font-black truncate tracking-wide">
          {formattedTitle}
        </h1>
      </div>

      <h2 className="text-center py-4 text-[14px] font-black text-white/70 tracking-widest uppercase">
        Select Match Position
      </h2>

      {/* Legend & Slot Status Bar */}
      <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-white/50 mb-4 px-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#161a26] border border-white/20" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_#8b5cf6]" />
          <span className="text-white font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-950/80 border border-red-500/40" />
          <span>Booked</span>
        </div>
      </div>

      {error && (
        <div className="mx-4 mb-4 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          {!hasEnoughBalance && tournament.entryFee > 0 && (
            <button
              onClick={onOpenAddCash}
              className="px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-black text-[11px] shadow-sm"
            >
              Add Cash
            </button>
          )}
        </div>
      )}

      {/* 4-COLUMN SLOT GRID MATCHING: id="slotGrid" class="grid grid-cols-4 gap-3 px-4" */}
      <div className="grid grid-cols-4 gap-3 px-4" id="slotGrid">
        {Array.from({ length: totalSlots }, (_, i) => i + 1).map((slotNum) => {
          const isBooked = bookedSet.has(slotNum);
          const bookingInfo = registeredSlotsMap.get(slotNum);
          const isSelected = selectedSlot === slotNum;
          const isMe = bookingInfo?.isMe;

          return (
            <button
              key={slotNum}
              type="button"
              disabled={isBooked}
              onClick={() => {
                if (!isBooked) {
                  setSelectedSlot(slotNum);
                  setError(null);
                }
              }}
              className={`min-h-[72px] rounded-2xl p-2.5 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_#8b5cf6] scale-105 border-2 border-white ring-2 ring-purple-400'
                  : isMe
                  ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-300'
                  : isBooked
                  ? 'bg-[#121217] border border-red-500/20 text-white/30 cursor-not-allowed opacity-50'
                  : 'bg-[#15151f] border border-white/10 text-white hover:border-[#8b5cf6]/50 hover:bg-[#1c1c2a]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] font-bold opacity-75">
                  #{String(slotNum).padStart(2, '0')}
                </span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : isBooked ? (
                  <Lock className="w-3 h-3 text-red-400" />
                ) : null}
              </div>

              <div className="my-0.5">
                {isMe ? (
                  <span className="font-black text-[11px] text-emerald-300">YOU</span>
                ) : isBooked ? (
                  <span className="font-bold text-[10px] text-red-300/80 truncate block max-w-[60px]">
                    {bookingInfo?.ign || 'TAKEN'}
                  </span>
                ) : (
                  <span className="font-black text-xs">SLOT {slotNum}</span>
                )}
              </div>

              <span
                className={`text-[9px] font-black uppercase ${
                  isSelected ? 'text-purple-100' : isBooked ? 'text-red-400/60' : 'text-[#22c55e]'
                }`}
              >
                {isSelected ? 'SELECTED' : isBooked ? 'BOOKED' : 'OPEN'}
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED POSITION & IN-GAME DETAILS STRIP */}
      <div className="mx-4 mt-6 p-5 backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Chosen Position</span>
            <p className="font-mono font-black text-xl text-[#8b5cf6]">
              Slot #{selectedSlot || 'None'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Entry Fee</span>
            <p className="font-semibold text-xl text-[#22c55e]">
              {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
            </p>
          </div>
        </div>

        {/* Free Fire In-Game Identity */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div>
            <p className="text-white font-black text-sm">Player: {ign}</p>
            <p className="text-white/50 font-mono text-[11px]">FF UID: {uid}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingDetails(!isEditingDetails)}
            className="flex items-center gap-1 text-[11px] text-[#8b5cf6] hover:text-purple-300 font-bold cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingDetails ? 'Done' : 'Change IGN'}</span>
          </button>
        </div>

        {isEditingDetails && (
          <div className="space-y-2 pt-2 border-t border-white/5 animate-in fade-in">
            <div>
              <label className="block text-[10px] text-white/50 mb-1 font-bold">Free Fire IGN (Name)</label>
              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#8b5cf6]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 mb-1 font-bold">Free Fire UID (Numeric)</label>
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-full px-4 py-2 text-xs text-white font-mono outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>
        )}

        {/* Balance Status */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-white/60">Your Wallet Balance:</span>
          <span className={`font-semibold text-sm ${hasEnoughBalance ? 'text-white' : 'text-rose-400'}`}>
            ₹{totalBalance}
          </span>
        </div>
      </div>

      {/* JOIN NOW BUTTON */}
      <div className="p-4 mt-2">
        <button
          onClick={handleJoinNow}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-4 rounded-full font-black text-[16px] shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-95 hover:scale-105 duration-300 transition-all flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          <span>JOIN NOW</span>
          {tournament.entryFee > 0 && <span className="font-semibold text-sm">(₹{tournament.entryFee})</span>}
        </button>
      </div>
    </div>
  );
};
