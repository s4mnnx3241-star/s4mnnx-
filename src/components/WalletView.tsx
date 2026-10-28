import React, { useState, useEffect } from 'react';
import { 
  User, 
  Transaction, 
  WithdrawalRequest, 
  DepositSubmission, 
  VipInfo, 
  VipRequest, 
  WinnerPayout 
} from '../types';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  History, 
  Sparkles, 
  X, 
  Crown,
  Trophy,
  Clock,
  ShieldCheck,
  Send,
  Calendar,
  Wallet as WalletIcon,
  Zap,
  CheckCheck
} from 'lucide-react';
import { ActivityChart } from './ActivityChart';

interface WalletViewProps {
  user: User;
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  depositSubmissions: DepositSubmission[];
  onAddCash: (amount: number, method: string, utr?: string) => void;
  onSubmitPayment: (amount: number, utr: string, screenshotName?: string) => void;
  onApproveDeposit: (id: string) => void;
  onRejectDeposit: (id: string) => void;
  onRequestWithdrawal: (amount: number, method: 'UPI' | 'Paytm' | 'Bank', payee: string) => void;
  onGoHome?: () => void;
  onSetMatchSchedule?: (mTime: string, rId: string, rPass: string) => void;
  vip?: VipInfo;
  onUpdateVip?: (vip: VipInfo) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  user,
  transactions,
  withdrawals,
  depositSubmissions,
  onAddCash,
  onSubmitPayment,
  onApproveDeposit,
  onRejectDeposit,
  onRequestWithdrawal,
  onGoHome,
  onSetMatchSchedule,
  vip,
  onUpdateVip,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'withdraw' | 'history'>('add');

  // VIP State
  const [vipData, setVipData] = useState<VipInfo>(() => {
    if (vip) return vip;
    const saved = localStorage.getItem('vip');
    return saved ? JSON.parse(saved) : { active: false, expiry: 0 };
  });

  useEffect(() => {
    if (vip) {
      setVipData(vip);
    }
  }, [vip]);

  const isVipActive = vipData.active && vipData.expiry > Date.now();

  const [showVipPay, setShowVipPay] = useState<boolean>(false);
  const [vipUtr, setVipUtr] = useState<string>('');
  const [vipRequests, setVipRequests] = useState<VipRequest[]>(() => {
    const saved = localStorage.getItem('vipReq');
    return saved ? JSON.parse(saved) : [
      { id: 101, utr: '492019482019', time: 'Today 11:20 AM' }
    ];
  });

  // Winner Payout State
  const [winRoom, setWinRoom] = useState<string>('');
  const [winName, setWinName] = useState<string>('');
  const [winUpi, setWinUpi] = useState<string>('');
  const [winPrize, setWinPrize] = useState<string>('');
  const [winners, setWinners] = useState<WinnerPayout[]>(() => {
    const saved = localStorage.getItem('winners');
    return saved ? JSON.parse(saved) : [
      { room: '8492019', name: '4MNXX', upi: 'winner@upi', amt: 500, time: 'Today 12:45 PM' }
    ];
  });

  // Payment Submission State
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastHtml, setToastHtml] = useState<string>('');

  // Admin Match Schedule State
  const [matchTime, setMatchTime] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [roomPassword, setRoomPassword] = useState<string>('');

  // Withdraw State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'Paytm' | 'Bank'>('UPI');
  const [upiId, setUpiId] = useState<string>('s4mnxx@okhdfcbank');
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // History Filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const totalBalance = user.wallet.deposit + user.wallet.winning + user.wallet.bonus;
  const officialUpi = '9884184962@upi';

  const triggerToast = (msg: string) => {
    setToastHtml(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(officialUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Submit Payment function matching user's submitPay()
  const submitPay = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDepositError(null);

    const u = utrNumber.trim();
    if (u.length < 12) {
      setDepositError('12 digit dao! PhonePe te Transaction ID copy koro');
      return;
    }

    const list = JSON.parse(localStorage.getItem('pay') || '[]');
    list.push({
      id: Date.now(),
      utr: u,
      amt: depositAmount || 50,
      status: 'pending',
      time: new Date().toLocaleString(),
    });
    localStorage.setItem('pay', JSON.stringify(list));

    onSubmitPayment(depositAmount || 50, u, 'phonepe_proof.png');
    triggerToast(`✅ Submitted! UTR: ${u}<br><span style="font-size:10px">Verify in 5 mins - 9884184962</span>`);
    setUtrNumber('');
  };

  // VIP handlers matching buyVIP() and submitVip()
  const buyVIP = () => {
    setShowVipPay(true);
  };

  const submitVip = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const u = vipUtr.trim();
    if (u.length < 12) {
      setDepositError('12 digit dao');
      return;
    }

    const list = JSON.parse(localStorage.getItem('vipReq') || '[]');
    const newReq: VipRequest = { id: Date.now(), utr: u, time: new Date().toLocaleString() };
    list.push(newReq);
    localStorage.setItem('vipReq', JSON.stringify(list));
    setVipRequests(list);

    triggerToast(`✅ VIP UTR Submitted! ${u}`);
    setVipUtr('');
  };

  const approveVip = (id: number) => {
    let list = JSON.parse(localStorage.getItem('vipReq') || '[]');
    list = list.filter((p: any) => p.id !== id);
    localStorage.setItem('vipReq', JSON.stringify(list));
    setVipRequests(list);

    const newVip: VipInfo = {
      active: true,
      expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem('vip', JSON.stringify(newVip));
    setVipData(newVip);
    if (onUpdateVip) {
      onUpdateVip(newVip);
    }
    triggerToast('👑 VIP Approved!');
  };

  // Payout Winner matching payoutWinner()
  const payoutWinner = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!winUpi.trim() || !winPrize.trim()) {
      setDepositError('UPI + Prize dao');
      return;
    }

    const amt = parseFloat(winPrize);
    const name = winName.trim() || 'Winner';
    const room = winRoom.trim() || 'CUSTOM';

    const wh = JSON.parse(localStorage.getItem('winners') || '[]');
    const newRecord: WinnerPayout = {
      room,
      name,
      upi: winUpi.trim(),
      amt,
      time: new Date().toLocaleString(),
    };
    wh.push(newRecord);
    localStorage.setItem('winners', JSON.stringify(wh));
    setWinners(wh);

    triggerToast(`✅ ₹${amt} Paid to ${name}!`);
    setWinRoom('');
    setWinName('');
    setWinUpi('');
    setWinPrize('');
  };

  // Match scheduling matching setMatch()
  const setMatch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!matchTime || !roomId) {
      setDepositError('Time + Room ID dao');
      return;
    }

    if (onSetMatchSchedule) {
      onSetMatchSchedule(matchTime, roomId, roomPassword);
    }

    triggerToast('✅ Set! 10 min age 9884184962 te SMS jabe');
    setRoomId('');
    setRoomPassword('');
  };

  // Withdraw Request
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < 50) {
      setWithdrawMsg({ type: 'error', text: 'Minimum withdrawal amount is ₹50.' });
      return;
    }
    if (withdrawAmount > user.wallet.winning) {
      setWithdrawMsg({
        type: 'error',
        text: `Insufficient Winning Cash. You have ₹${user.wallet.winning} available for withdrawal.`,
      });
      return;
    }
    if (!upiId.trim()) {
      setWithdrawMsg({ type: 'error', text: 'Please enter a valid UPI ID or Phone number.' });
      return;
    }

    onRequestWithdrawal(withdrawAmount, withdrawMethod, upiId.trim());
    setWithdrawMsg({
      type: 'success',
      text: `Withdrawal request of ₹${withdrawAmount} submitted! Payout will arrive in your UPI shortly.`,
    });
    setTimeout(() => {
      setWithdrawMsg(null);
      setActiveTab('overview');
    }, 2500);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (historyFilter === 'all') return true;
    const isCredit = ['deposit', 'kill_reward', 'booyah_reward', 'referral_bonus'].includes(tx.type);
    return historyFilter === 'credit' ? isCredit : !isCredit;
  });

  return (
    <div className="p-4 max-w-[500px] mx-auto space-y-4 font-sans text-white">
      {/* TOAST 2 NO - SUCCESS */}
      <div
        id="toast"
        className={`fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl z-[9999] text-[12px] font-bold transition-all duration-300 border border-emerald-400/30 ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none hidden'
        }`}
        dangerouslySetInnerHTML={{ __html: toastHtml }}
      />

      {/* Top Header Card - Ultra Pro Glass Effect */}
      <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] shadow-2xl p-5 relative overflow-hidden">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
              Total Wallet Balance
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-[#fbbf24]">₹</span>
              <span className="text-4xl font-black text-white tracking-tight tabular-nums">
                {totalBalance}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-green-500/20 text-[#22c55e] border border-green-500/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider inline-block">
              100% Safe
            </span>
            <span className="text-[11px] text-white/50 block mt-1 font-semibold">Instant UPI Payouts</span>
          </div>
        </div>

        {/* 3-Way Wallet Breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10">
          <div className="bg-[#151515] p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">Deposit</span>
            <span className="font-semibold text-white text-base">₹{user.wallet.deposit}</span>
          </div>
          <div className="bg-emerald-950/20 p-3 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-[#22c55e] block font-bold flex items-center gap-1 uppercase tracking-wider">
              Winnings
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className="font-semibold text-emerald-300 text-base">₹{user.wallet.winning}</span>
          </div>
          <div className="bg-[#8b5cf6]/10 p-3 rounded-2xl border border-[#8b5cf6]/20">
            <span className="text-[10px] text-[#8b5cf6] block font-bold uppercase tracking-wider">Bonus</span>
            <span className="font-semibold text-purple-300 text-base">₹{user.wallet.bonus}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={() => setActiveTab('add')}
            className="py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-full font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer text-white"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Add Cash</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className="py-3 px-4 bg-[#151515] hover:bg-[#202020] border border-yellow-500/40 text-yellow-300 hover:text-white rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-[#fbbf24]" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher - Glass Capsule */}
      <div className="flex backdrop-blur-xl bg-white/[0.04] p-1.5 rounded-full border border-white/10 text-xs font-black">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2.5 rounded-full transition-all cursor-pointer ${
            activeTab === 'add'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Add Money
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-2.5 rounded-full transition-all cursor-pointer ${
            activeTab === 'withdraw'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Withdraw
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-full transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Passbook
        </button>
      </div>

      {/* Error Banner */}
      {depositError && (
        <div className="p-3.5 bg-rose-500/20 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{depositError}</span>
        </div>
      )}

      {/* TAB: ADD MONEY */}
      {activeTab === 'add' && (
        <div className="space-y-4">
          
          {/* 10 NO - VIP CARD - Ultra Pro Gold Design */}
          <div className="relative bg-gradient-to-br from-[#fbbf24]/20 via-[#151515] to-[#080808] p-[1px] rounded-[24px] shadow-[0_0_25px_rgba(251,191,36,0.2)]">
            <div className="bg-[#121212]/95 backdrop-blur-xl rounded-[23px] p-5 border border-[#fbbf24]/30 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-[15px] flex items-center gap-2 text-white">
                  <Crown className="w-5 h-5 text-[#fbbf24] animate-bounce" />
                  <span>VIP MEMBERSHIP - <span className="text-[#fbbf24] font-semibold">₹99/month</span></span>
                </h3>
                <span className="bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  PRO
                </span>
              </div>

              <ul className="text-[12px] space-y-1.5 font-medium text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-[#22c55e]" /> No Entry Fee - Daily 2 Free Tournaments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-[#22c55e]" /> Verified Green Tick + Glowing VIP Badge
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-[#22c55e]" /> 10% Extra Prize on Every Victory
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-[#22c55e]" /> Priority 24/7 WhatsApp: <b className="text-white">9884184962</b>
                </li>
              </ul>

              <div id="vipStatus" className="text-[12px] font-bold text-[#fbbf24]">
                {isVipActive ? `👑 VIP Active till ${new Date(vipData.expiry).toLocaleDateString()} - Green Tick Verified ✅` : ''}
              </div>

              <button
                id="vipBtn"
                onClick={buyVIP}
                className="w-full bg-[#fbbf24] hover:bg-yellow-300 text-black py-3.5 rounded-full font-black text-sm tracking-wide cursor-pointer shadow-gold transition-all hover:scale-105 active:scale-95"
              >
                {isVipActive ? 'VIP ACTIVE ✓' : 'BUY VIP - ₹99'}
              </button>

              <div id="vipPay" className={`${showVipPay ? '' : 'hidden'} mt-3 bg-black/80 p-4 rounded-2xl border border-[#fbbf24]/30 text-white space-y-2`}>
                <p className="text-[#fbbf24] text-[12px] text-center font-bold">
                  Official UPI: <span className="font-mono">9884184962@upi</span> • ₹99
                </p>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9884184962@upi&am=99"
                  alt="VIP UPI QR"
                  className="bg-white p-2.5 rounded-xl mx-auto my-2 w-32 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowQrModal(true)}
                />
                <input
                  id="vipUtr"
                  placeholder="Enter 12-Digit UTR Number"
                  value={vipUtr}
                  onChange={(e) => setVipUtr(e.target.value)}
                  className="w-full p-3.5 rounded-full bg-[#181818] border border-white/20 text-white font-mono text-xs outline-none focus:border-[#fbbf24]"
                />
                <button
                  onClick={submitVip}
                  className="w-full mt-2 bg-[#fbbf24] hover:bg-yellow-300 text-black py-3.5 rounded-full font-black text-xs uppercase tracking-wide cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Submit VIP UTR
                </button>
              </div>
            </div>
          </div>

          {/* WALLET - Real Payment Only */}
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] shadow-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-[15px] text-white flex items-center gap-2">
                <WalletIcon className="w-4 h-4 text-[#8b5cf6]" />
                <span>Add Money - Instant QR / UPI</span>
              </h3>
              <span className="bg-green-500/20 text-[#22c55e] text-[10px] font-black px-2 py-0.5 rounded-full">
                FAST
              </span>
            </div>

            <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
              <p className="text-[12px] text-white/70">
                UPI: <b className="text-[#fbbf24] font-mono select-all">{officialUpi}</b>
              </p>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="text-[10px] bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold cursor-pointer hover:bg-[#8b5cf6]/30 transition-colors"
              >
                {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${officialUpi}&am=${depositAmount || 50}`}
              alt="UPI QR Code"
              className="bg-white p-2.5 rounded-2xl mx-auto my-3 w-40 cursor-pointer shadow-2xl hover:scale-105 transition-transform"
              onClick={() => setShowQrModal(true)}
            />

            {/* Quick Amount presets */}
            <div className="flex gap-2">
              {[20, 50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    depositAmount === amt
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-105'
                      : 'bg-[#151515] border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <form onSubmit={submitPay} className="space-y-3 pt-1">
              <input
                id="utr"
                placeholder="Enter 12-Digit PhonePe / GPay UTR"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full p-3.5 rounded-full bg-[#151515] border border-white/10 text-white font-mono text-sm outline-none focus:border-[#8b5cf6] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-4 rounded-full font-black text-sm tracking-wide shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-95 transition-all text-white cursor-pointer hover:scale-105 duration-300"
              >
                VERIFY & SUBMIT PAYMENT
              </button>
            </form>
          </div>

          {/* 1 NO - WINNER PAYOUT - Ultra Pro Green Glow */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-[#22c55e]/15 via-[#151515] to-[#080808] border border-[#22c55e]/30 rounded-[24px] shadow-2xl p-5 space-y-3">
            <h3 className="font-black text-[14px] text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#22c55e]" />
              <span>Winner Payout & Instant UPI Transfer</span>
            </h3>
            
            <div className="space-y-2">
              <input
                id="winRoom"
                placeholder="Match Room ID (e.g. 8492019)"
                value={winRoom}
                onChange={(e) => setWinRoom(e.target.value)}
                className="w-full p-3 rounded-full bg-black/60 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#22c55e]"
              />
              <input
                id="winName"
                placeholder="Winner Free Fire IGN - e.g. 4MNXX"
                value={winName}
                onChange={(e) => setWinName(e.target.value)}
                className="w-full p-3 rounded-full bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-[#22c55e]"
              />
              <input
                id="winUPI"
                placeholder="Winner UPI ID - e.g. winner@upi"
                value={winUpi}
                onChange={(e) => setWinUpi(e.target.value)}
                className="w-full p-3 rounded-full bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-[#22c55e]"
              />
              <input
                id="winPrize"
                placeholder="Prize Amount in ₹ (e.g. 500)"
                type="number"
                value={winPrize}
                onChange={(e) => setWinPrize(e.target.value)}
                className="w-full p-3 rounded-full bg-black/60 border border-white/10 text-white text-xs font-semibold outline-none focus:border-[#22c55e]"
              />
            </div>

            <button
              onClick={payoutWinner}
              className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 py-3.5 rounded-full font-black text-xs uppercase tracking-wide cursor-pointer transition-all shadow-win hover:scale-105 active:scale-95 text-white"
            >
              PAYOUT WINNER - INSTANT UPI
            </button>

            <div id="winHistory" className="mt-3 space-y-2">
              {winners.slice(-5).reverse().map((w, idx) => (
                <div
                  key={idx}
                  className="bg-black/60 p-2.5 rounded-xl text-[11px] flex justify-between items-center border border-[#22c55e]/20"
                >
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-[#fbbf24]" />
                    {w.name} - <span className="text-white font-semibold">₹{w.amt}</span> (Room #{w.room})
                  </span>
                  <span className="text-[#22c55e] font-mono text-[10px] font-bold">PAID ✓ {w.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MATCH SET - Ultra Pro Schedule Card */}
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] shadow-2xl p-5 space-y-3">
            <h3 className="font-black text-[14px] text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Match Room & Time Scheduler</span>
            </h3>
            
            <div className="space-y-2">
              <input
                id="mTime"
                type="datetime-local"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                className="w-full p-3 rounded-full bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-[#8b5cf6]"
              />
              <input
                id="rId"
                placeholder="Custom Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-3 rounded-full bg-black/60 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#8b5cf6]"
              />
              <input
                id="rPass"
                placeholder="Room Password"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                className="w-full p-3 rounded-full bg-black/60 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <button
              onClick={setMatch}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 py-3.5 rounded-full font-black w-full text-xs uppercase tracking-wide cursor-pointer transition-all text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95"
            >
              SAVE SCHEDULE (SMS TO 9884184962)
            </button>
          </div>

          {/* PAYMENT REQUESTS & VIP REQUESTS */}
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-[14px] text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8b5cf6]" />
                <span>Admin Pending Verifications</span>
              </h3>
            </div>
            
            <div id="adminList" className="space-y-2">
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Deposit Submissions</p>
              {depositSubmissions.filter((p) => p.status === 'pending').length === 0 ? (
                <p className="text-[11px] text-white/30 text-center py-2">No pending deposit approvals</p>
              ) : (
                depositSubmissions
                  .filter((p) => p.status === 'pending')
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-black/60 p-3 rounded-2xl flex justify-between items-center border border-white/10"
                    >
                      <div>
                        <p className="text-[12px] font-semibold text-white">
                          ₹{p.amount} <span className="font-mono text-white/60">UTR: {p.utr}</span>
                        </p>
                        <p className="text-[10px] text-white/50">{p.timestamp}</p>
                      </div>
                      <button
                        onClick={() => onApproveDeposit(p.id)}
                        className="bg-[#22c55e] hover:bg-green-400 text-black px-3.5 py-1.5 rounded-full text-[11px] font-black cursor-pointer transition-all hover:scale-105 active:scale-95"
                      >
                        APPROVE
                      </button>
                    </div>
                  ))
              )}
            </div>

            <div id="vipReq" className="pt-3 border-t border-white/10 space-y-2">
              <h4 className="text-[12px] font-black text-[#fbbf24] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>VIP Membership Requests</span>
              </h4>
              {vipRequests.length === 0 ? (
                <p className="text-[10px] text-white/40">No pending VIP requests</p>
              ) : (
                vipRequests.map((r) => (
                  <div
                    key={r.id}
                    className="bg-black/60 p-2.5 rounded-2xl flex justify-between items-center text-[11px] border border-white/10"
                  >
                    <span className="font-mono text-white/80">{r.utr} · {r.time}</span>
                    <button
                      onClick={() => approveVip(r.id)}
                      className="bg-[#fbbf24] hover:bg-yellow-300 text-black px-3 py-1 rounded-full font-black cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                      APPROVE
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FEATURE 1 - RECENT CHART */}
          <ActivityChart transactions={transactions} user={user} />
        </div>
      )}

      {/* TAB: WITHDRAW MONEY */}
      {activeTab === 'withdraw' && (
        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] shadow-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-white text-base">Withdraw Cash</h3>
              <p className="text-[12px] text-white/60">
                Winning balance: <span className="text-[#22c55e] font-semibold text-sm">₹{user.wallet.winning}</span>
              </p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-[#22c55e] border border-emerald-500/30 px-3 py-1 rounded-full font-black uppercase">
              Min ₹50
            </span>
          </div>

          {withdrawMsg && (
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs border ${
                withdrawMsg.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              {withdrawMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{withdrawMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-bold">Withdrawal Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-lg font-bold text-white/40">₹</span>
                <input
                  type="number"
                  min="50"
                  max={user.wallet.winning || 50}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-[#151515] border border-white/10 rounded-full pl-9 pr-4 py-3 text-lg font-semibold text-white focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-bold">Transfer Method</label>
              <div className="flex gap-2">
                {(['UPI', 'Paytm', 'Bank'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setWithdrawMethod(method)}
                    className={`flex-1 py-2.5 rounded-full text-xs font-black border transition-all cursor-pointer ${
                      withdrawMethod === method
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                        : 'bg-[#151515] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-bold">
                {withdrawMethod === 'UPI'
                  ? 'Your UPI ID (VPA)'
                  : withdrawMethod === 'Paytm'
                  ? 'Paytm Registered Mobile Number'
                  : 'Bank Account Number & IFSC'}
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder={withdrawMethod === 'UPI' ? 'name@okhdfcbank' : '9876543210'}
                className="w-full bg-[#151515] border border-white/10 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <button
              type="submit"
              disabled={user.wallet.winning < 50}
              className={`w-full py-4 rounded-full text-sm font-black transition-all cursor-pointer ${
                user.wallet.winning < 50
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 duration-300'
              }`}
            >
              CONFIRM WITHDRAWAL TO {withdrawMethod}
            </button>
          </form>
        </div>
      )}

      {/* TAB: PASSBOOK */}
      {activeTab === 'history' && (
        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[24px] shadow-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#8b5cf6]" />
              <h3 className="font-black text-white text-base">Passbook History</h3>
            </div>
            <div className="flex gap-1 bg-black/50 p-1 rounded-full text-[10px]">
              {(['all', 'credit', 'debit'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={`px-3 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                    historyFilter === filter
                      ? 'bg-[#8b5cf6] text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {filter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => {
              const isCredit = ['deposit', 'kill_reward', 'booyah_reward', 'referral_bonus'].includes(
                tx.type
              );

              return (
                <div
                  key={tx.id}
                  className="p-3.5 bg-[#151515] rounded-2xl border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-500/20 text-[#22c55e]'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{tx.title}</p>
                      <p className="text-[10px] text-white/50">
                        {tx.timestamp} · {tx.referenceId}
                        {tx.utrNumber && ` · UTR: ${tx.utrNumber}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        isCredit ? 'text-[#22c55e]' : 'text-white/70'
                      }`}
                    >
                      {isCredit ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                    </p>
                    <span className="text-[9px] text-white/40 block font-medium uppercase">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULLSCREEN QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="backdrop-blur-xl bg-[#121212] border border-[#8b5cf6]/40 rounded-[28px] max-w-sm w-full p-6 space-y-4 text-center shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-black text-sm text-white">Scan & Pay via Any UPI App</h3>
              <button onClick={() => setShowQrModal(false)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${officialUpi}&am=${depositAmount || 50}`}
              alt="UPI QR Fullscreen"
              className="bg-white p-3 rounded-2xl mx-auto w-56 h-56 shadow-2xl"
            />

            <p className="font-mono text-[#fbbf24] text-base font-black">{officialUpi}</p>
            <p className="text-xs text-white/60">PhonePe, Google Pay, Paytm, BHIM</p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-xs font-black cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
