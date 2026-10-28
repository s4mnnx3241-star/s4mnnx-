import React, { useState } from 'react';
import { Tournament } from '../types';
import { X, Copy, Check, Key, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

interface RoomDetailsModalProps {
  tournament: Tournament;
  onClose: () => void;
  playerSlot?: number;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  tournament,
  onClose,
  playerSlot,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const hasRoomDetails = Boolean(tournament.roomId && tournament.roomPassword);

  const handleCopyId = () => {
    if (tournament.roomId) {
      navigator.clipboard.writeText(tournament.roomId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyPass = () => {
    if (tournament.roomPassword) {
      navigator.clipboard.writeText(tournament.roomPassword);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121622] border border-white/10 rounded-2xl max-w-md w-full p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Custom Room Credentials</h3>
              <p className="text-[11px] text-slate-400">{tournament.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room ID and Password Box */}
        {hasRoomDetails ? (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-[#0a0d14] border border-emerald-500/30 rounded-xl space-y-3">
              {/* Room ID */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Custom Room ID</p>
                  <p className="font-mono text-xl font-black text-white tracking-wider">
                    {tournament.roomId}
                  </p>
                </div>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Room Password */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Password</p>
                  <p className="font-mono text-xl font-black text-amber-400 tracking-wider">
                    {tournament.roomPassword}
                  </p>
                </div>
                <button
                  onClick={handleCopyPass}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPass ? 'Copied!' : 'Copy Pass'}</span>
                </button>
              </div>

              {playerSlot && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Your Assigned Slot:</span>
                  <span className="bg-purple-600/30 text-purple-300 font-mono font-bold px-2 py-0.5 rounded">
                    Slot #{playerSlot}
                  </span>
                </div>
              )}
            </div>

            {/* How to join steps */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2 text-xs">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                How to Join in Free Fire:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                <li>Open <b>Free Fire MAX</b> on your mobile device.</li>
                <li>Tap on the game mode selector and select <b>Custom</b>.</li>
                <li>Tap <b>Join</b> and enter the <b>Room ID</b> above.</li>
                <li>Enter the <b>Password</b> and tap Join.</li>
                <li>Sit in your assigned <b>Slot #{playerSlot || 'team slot'}</b> to avoid kick.</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-6 bg-[#0a0d14] rounded-xl border border-white/5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Room Details Not Released Yet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Room ID and Password are published exactly <b>15 minutes</b> prior to match start time ({tournament.startTime}).
              </p>
            </div>
            <div className="p-2.5 bg-white/5 rounded-lg text-[11px] text-slate-300">
              Please stay on this page or check notifications. Keep your Free Fire game ready!
            </div>
          </div>
        )}

        <div className="mt-4 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
