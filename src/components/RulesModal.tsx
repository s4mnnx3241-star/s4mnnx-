import React from 'react';
import { Tournament } from '../types';
import { X, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

interface RulesModalProps {
  tournament: Tournament;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ tournament, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121622] border border-white/10 rounded-2xl max-w-md w-full p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Match Rules & Regulations</h3>
              <p className="text-[11px] text-slate-400">{tournament.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prize breakdown */}
        <div className="mt-4 p-3 bg-[#0a0d14] rounded-xl border border-white/5 space-y-2">
          <p className="text-xs font-bold text-white uppercase tracking-wider">Prize Breakdown</p>
          <div className="space-y-1 text-xs">
            {tournament.prizes.map((p) => (
              <div key={p.rank} className="flex justify-between items-center text-slate-300">
                <span>{p.label}</span>
                <span className="font-mono font-bold text-emerald-400">₹{p.prize}</span>
              </div>
            ))}
            {tournament.perKill > 0 && (
              <div className="flex justify-between items-center text-amber-400 pt-1 border-t border-white/5 font-semibold">
                <span>Kill Bounty</span>
                <span className="font-mono">₹{tournament.perKill} per kill</span>
              </div>
            )}
          </div>
        </div>

        {/* Specific rules list */}
        <div className="mt-4 space-y-2.5">
          <p className="text-xs font-bold text-white uppercase tracking-wider">Tournament Guidelines</p>
          <div className="space-y-2">
            {tournament.rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zero tolerance notice */}
        <div className="mt-4 p-3 bg-red-950/30 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
          <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-300">Fair Play Policy</p>
            <p className="text-[11px] text-red-200/80 mt-0.5">
              Teaming, third-party aimbots/config files, or emulator usage is strictly tracked. If caught, your account and winnings will be permanently frozen.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 pill-btn text-xs font-bold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
