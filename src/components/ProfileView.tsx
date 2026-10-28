import React, { useState } from 'react';
import { User } from '../types';
import { NavTab } from './BottomNav';
import { X, Check, Copy, Shield, Bell } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onUpdateProfile: (updated: Partial<User>) => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  adminUnlocked: boolean;
  onNavigateTab?: (tab: NavTab) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  onLogout,
  onOpenAdmin,
  adminUnlocked,
  onNavigateTab,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Profile edit fields
  const [ign, setIgn] = useState(user.ffIgn || 's4mnxx_亗');
  const [uid, setUid] = useState(user.ffUid || '2849102941');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Bengali'>('English');

  const totalBalance = user.wallet.deposit + user.wallet.winning + user.wallet.bonus;
  const whatsappUrl = 'https://wa.me/919884184962?text=Hi%20Skill%20War%20Support';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ffIgn: ign.trim() || user.username,
      ffUid: uid.trim(),
    });
    setActiveModal(null);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`SKILL-${user.username.toUpperCase()}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div id="p-account" className="bg-black min-h-screen text-white pb-[80px]">
      {/* Top Bar matching user's exact specification */}
      <div className="flex justify-between items-center p-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="S4 Avatar"
            className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
          />
          <div>
            <h2 className="font-bold text-[16px] leading-tight">
              {user.username.length <= 4 ? user.username.toUpperCase() : 'S4'}
            </h2>
            <p className="text-[12px] text-purple-400">Skill War</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Customer Support direct WhatsApp link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat with Support on WhatsApp"
            className="text-purple-500 hover:text-purple-400 text-2xl transition-transform active:scale-95"
          >
            🎧
          </a>

          {/* Wallet Pill */}
          <div
            onClick={() => onNavigateTab && onNavigateTab('wallet')}
            className="bg-[#1e1e1e] hover:bg-[#282828] border border-purple-500 px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <span>💳</span>
            <span className="font-mono text-sm font-bold tabular-nums">
              {totalBalance.toFixed(2)}
            </span>
            <span className="text-purple-400 font-bold">| +</span>
          </div>
        </div>
      </div>

      {/* Profile Circle matching S4 Style */}
      <div className="text-center py-6">
        <div className="w-28 h-28 mx-auto rounded-full border-4 border-white bg-[#1a0a2e] flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.3)]">
          <span className="text-[40px] font-black text-purple-400 italic">SW</span>
        </div>
        <h1 className="mt-3 font-black text-[20px] tracking-tight">
          {user.username.length <= 4 ? user.username.toUpperCase() : 'S4'}
        </h1>
        <p className="text-green-500 font-bold text-sm flex items-center justify-center gap-1 mt-0.5">
          <span>✓</span> Kyc Verified
        </p>
      </div>

      {/* Stats Box */}
      <div className="mx-4 bg-[#1e103f] rounded-xl flex justify-around py-4 text-center border border-purple-900/40 shadow-lg">
        <div className="flex-1">
          <p className="font-black text-[18px] text-white tabular-nums">
            {user.stats.matchesPlayed}
          </p>
          <p className="text-[13px] text-white/80 leading-tight">
            Matches<br />Played
          </p>
        </div>

        <div className="w-[1px] bg-white/20 self-stretch my-1" />

        <div className="flex-1">
          <p className="font-black text-[18px] text-amber-400 tabular-nums">
            {user.stats.totalKills}
          </p>
          <p className="text-[13px] text-white/80 leading-tight">
            Total<br />Killed
          </p>
        </div>

        <div className="w-[1px] bg-white/20 self-stretch my-1" />

        <div className="flex-1">
          <p className="font-black text-[18px] text-emerald-400 tabular-nums">
            🪙 {user.stats.totalWinnings}
          </p>
          <p className="text-[13px] text-white/80 leading-tight">
            Amount<br />Won
          </p>
        </div>
      </div>

      {/* Menu List matching user's layout & NEW WHATSAPP 9884184962 */}
      <div className="mt-6 space-y-2 px-2 text-sm font-semibold">
        {/* Admin Dashboard (if unlocked) */}
        {adminUnlocked && (
          <div
            onClick={onOpenAdmin}
            className="bg-red-950/60 border border-red-500/40 p-4 flex justify-between items-center rounded-lg cursor-pointer hover:bg-red-900/60 transition-colors text-red-300 font-bold"
          >
            <span>🛡️ Admin Management Console</span>
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">OPEN</span>
          </div>
        )}

        {/* 1. Push Notification */}
        <div
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className="bg-[#1e103f] p-4 flex justify-between items-center rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>🔔 Push Notification</span>
          <span
            className={`w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              notificationsEnabled ? 'bg-purple-600' : 'bg-white/20'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </span>
        </div>

        {/* 2. My Profile */}
        <div
          onClick={() => setActiveModal('profile')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>👤 My Profile</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 3. My Wallet */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('wallet')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>💳 My Wallet</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 4. My Matches */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('matches')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>🎮 My Matches</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 5. My Order */}
        <div
          onClick={() => setActiveModal('orders')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>🛒 My Order</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 6. My Rewards */}
        <div
          onClick={() => setActiveModal('rewards')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>🎁 My Rewards</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 7. My Referrals */}
        <div
          onClick={() => setActiveModal('referrals')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>👥 My Referrals</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 8. Announcement */}
        <div
          onClick={() => setActiveModal('announcement')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>📢 Announcement</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 9. App Tutorial */}
        <div
          onClick={() => setActiveModal('tutorial')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>❓ App Tutorial</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 10. About us */}
        <div
          onClick={() => setActiveModal('about')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>ℹ️ About us</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* CUSTOMER SUPPORT - NEW NUMBER 9884184962 */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1e103f] p-4 flex justify-between border border-green-500/50 rounded-lg hover:bg-green-950/30 transition-colors text-green-400 font-bold block"
        >
          <span>🎧 Customer Support - 9884184962</span>
          <span>&gt;</span>
        </a>

        {/* 11. Share App */}
        <div
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Skill War - Free Fire Tournament',
                text: 'Join Skill War and win daily cash prizes in Free Fire tournaments!',
                url: window.location.href,
              }).catch(() => {});
            } else {
              handleCopyReferral();
              alert('Link copied to clipboard!');
            }
          }}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>🔗 Share App</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 12. Terms & Conditions */}
        <div
          onClick={() => setActiveModal('terms')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>📄 Terms & Conditions</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 13. Change Language */}
        <div
          onClick={() => setActiveModal('language')}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-[#25144f] transition-colors"
        >
          <span>🌐 Change Language ({selectedLanguage})</span>
          <span className="text-white/40">&gt;</span>
        </div>

        {/* 14. Logout */}
        <div
          onClick={onLogout}
          className="bg-[#1e103f] p-4 flex justify-between rounded-lg cursor-pointer hover:bg-rose-950/40 text-rose-400 transition-colors"
        >
          <span>⏻ Logout</span>
          <span className="text-rose-400/60">&gt;</span>
        </div>
      </div>

      {/* MODAL HANDLERS */}
      {/* 1. My Profile Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1e103f] border border-purple-500/40 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">Edit In-Game Profile</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Free Fire In-Game Name (IGN)</label>
                <input
                  type="text"
                  value={ign}
                  onChange={(e) => setIgn(e.target.value)}
                  className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Free Fire UID (Numeric)</label>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <button type="submit" className="w-full py-2.5 pill-btn text-xs font-bold mt-2">
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. My Referrals Modal */}
      {activeModal === 'referrals' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1e103f] border border-purple-500/40 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-center">
            <h3 className="font-bold text-white text-base">Refer & Earn</h3>
            <p className="text-xs text-slate-300">
              Invite your squad to Skill War. You get <b>₹15 Bonus Cash</b> when they play their first tournament!
            </p>

            <div className="p-3 bg-black/50 border border-purple-500/40 rounded-xl font-mono text-purple-300 font-bold text-sm tracking-wider">
              SKILL-{user.username.toUpperCase()}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyReferral}
                className="flex-1 py-2.5 pill-btn text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReferral ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. App Tutorial Modal */}
      {activeModal === 'tutorial' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1e103f] border border-purple-500/40 rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <h3 className="font-bold text-white text-base">How to Join Matches</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <li>Open <b>Lobby</b> and select a tournament.</li>
              <li>Pick your preferred <b>Match Position Slot</b>.</li>
              <li>15 minutes before the match, open <b>My Matches</b> to view <b>Room ID & Password</b>.</li>
              <li>Open Free Fire MAX → Custom → Join with Room ID & Password.</li>
              <li>Occupy your chosen slot number and Booyah!</li>
            </ol>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold mt-2"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* 4. Change Language Modal */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1e103f] border border-purple-500/40 rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <h3 className="font-bold text-white text-base">Select Language</h3>
            <div className="space-y-2">
              {(['English', 'Hindi', 'Bengali'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold text-left flex items-center justify-between border ${
                    selectedLanguage === lang
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-black/40 text-slate-300 border-white/10'
                  }`}
                >
                  <span>{lang === 'English' ? 'English' : lang === 'Hindi' ? 'हिन्दी (Hindi)' : 'বাংলা (Bengali)'}</span>
                  {selectedLanguage === lang && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-white/10 text-white rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 5. Generic Info Modal (Announcement, Orders, Rewards, Terms, About) */}
      {['announcement', 'orders', 'rewards', 'terms', 'about'].includes(activeModal || '') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1e103f] border border-purple-500/40 rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <h3 className="font-bold text-white text-base capitalize">
              {activeModal === 'about' ? 'About Skill War' : activeModal}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModal === 'announcement' && '🔥 Weekend Mega Tournament announcement: Bermuda Squad with ₹5,000 pool starts Sunday 09:00 PM! Register early.'}
              {activeModal === 'orders' && '📦 No pending merchandise orders. Tournament entries are automatically activated.'}
              {activeModal === 'rewards' && '🎁 Complete 5 matches this week to earn ₹50 Bonus Cash in your wallet!'}
              {activeModal === 'terms' && '📜 Fair Play terms: No third-party hacks, mobile devices only, no teaming up in solo matches. Disqualification leads to wallet freeze.'}
              {activeModal === 'about' && '⚔️ Skill War is India\'s trusted Free Fire esports tournament platform providing daily custom rooms, per-kill cash rewards, and instant UPI payouts.'}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
