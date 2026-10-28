import React, { useState } from 'react';
import { Tournament, User } from '../types';
import { X, ShieldCheck, AlertCircle, PlusCircle } from 'lucide-react';

interface JoinMatchModalProps {
  tournament: Tournament;
  user: User;
  onClose: () => void;
  onConfirmJoin: (data: {
    ign: string;
    uid: string;
    teammates?: string[];
  }) => void;
  onOpenAddCash: () => void;
}

export const JoinMatchModal: React.FC<JoinMatchModalProps> = ({
  tournament,
  user,
  onClose,
  onConfirmJoin,
  onOpenAddCash,
}) => {
  const [ign, setIgn] = useState(user.ffIgn || user.username);
  const [uid, setUid] = useState(user.ffUid || '2849102941');
  const [mate1, setMate1] = useState('');
  const [mate2, setMate2] = useState('');
  const [mate3, setMate3] = useState('');
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState('');

  const totalBalance = user.wallet.deposit + user.wallet.winning + user.wallet.bonus;
  const hasEnoughBalance = totalBalance >= tournament.entryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ign.trim()) {
      setError('Please provide your Free Fire In-Game Name (IGN)');
      return;
    }
    if (!uid.trim()) {
      setError('Please enter your Free Fire UID (e.g. 2849102941)');
      return;
    }
    if (!agree) {
      setError('You must accept the tournament fair-play rules.');
      return;
    }
    if (!hasEnoughBalance) {
      setError('Insufficient wallet balance. Please add cash first.');
      return;
    }

    const teammates: string[] = [];
    if (tournament.gameMode === 'Duo' && mate1.trim()) teammates.push(mate1.trim());
    if (tournament.gameMode === 'Squad') {
      if (mate1.trim()) teammates.push(mate1.trim());
      if (mate2.trim()) teammates.push(mate2.trim());
      if (mate3.trim()) teammates.push(mate3.trim());
    }

    onConfirmJoin({
      ign: ign.trim(),
      uid: uid.trim(),
      teammates: teammates.length > 0 ? teammates : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121622] border border-white/10 rounded-2xl max-w-md w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold text-base">Register for Tournament</h3>
            <p className="text-xs text-slate-400">{tournament.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tournament Summary strip */}
        <div className="mt-4 p-3 bg-[#0a0d14] rounded-xl border border-white/5 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Mode: </span>
            <span className="text-white font-bold">{tournament.gameMode} ({tournament.map})</span>
          </div>
          <div>
            <span className="text-slate-400">Entry: </span>
            <span className="text-emerald-400 font-mono font-bold">
              {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Per Kill: </span>
            <span className="text-amber-400 font-mono font-bold">₹{tournament.perKill}</span>
          </div>
        </div>

        {/* Balance Status */}
        <div className="mt-3 p-3 rounded-xl bg-[#182030] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">Wallet Balance</p>
            <p className="text-sm font-mono font-bold text-white">₹{totalBalance}</p>
          </div>
          {!hasEnoughBalance && tournament.entryFee > 0 ? (
            <button
              type="button"
              onClick={onOpenAddCash}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Cash
            </button>
          ) : (
            <span className="text-[11px] text-emerald-400 font-medium">Balance OK ✓</span>
          )}
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* IGN */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Free Fire In-Game Name (IGN) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              placeholder="e.g. s4mnxx_亗"
              className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Must exactly match your in-game name.</p>
          </div>

          {/* UID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Free Fire UID <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="e.g. 2849102941"
              className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Teammates for Duo / Squad */}
          {(tournament.gameMode === 'Duo' || tournament.gameMode === 'Squad') && (
            <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-2">
              <p className="text-xs font-bold text-purple-300">Teammate In-Game Names (Optional now, can update)</p>
              <div>
                <input
                  type="text"
                  value={mate1}
                  onChange={(e) => setMate1(e.target.value)}
                  placeholder="Teammate 1 IGN"
                  className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
              {tournament.gameMode === 'Squad' && (
                <>
                  <input
                    type="text"
                    value={mate2}
                    onChange={(e) => setMate2(e.target.value)}
                    placeholder="Teammate 2 IGN"
                    className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={mate3}
                    onChange={(e) => setMate3(e.target.value)}
                    placeholder="Teammate 3 IGN"
                    className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </>
              )}
            </div>
          )}

          {/* Rule agreement */}
          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-[11px] text-slate-300 leading-tight">
              I agree to fair-play rules (No hacks, No emulators, Mobile Free Fire MAX only). Violation leads to immediate ban.
            </span>
          </label>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasEnoughBalance && tournament.entryFee > 0}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg ${
                !hasEnoughBalance && tournament.entryFee > 0
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'pill-btn'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {tournament.entryFee === 0
                  ? 'Confirm Free Registration'
                  : `Pay ₹${tournament.entryFee} & Join`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
