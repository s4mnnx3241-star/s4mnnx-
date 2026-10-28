import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthScreensProps {
  onLoginSuccess: (username: string) => void;
  onAdminUnlock: () => void;
  isAdminUnlocked: boolean;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  onLoginSuccess,
  onAdminUnlock,
  isAdminUnlocked,
}) => {
  const [screen, setScreen] = useState<'login' | 'signup'>('login');
  
  // Login fields
  const [loginUser, setLoginUser] = useState('s4mnxx');
  const [loginPass, setLoginPass] = useState('123456');

  // Sign up fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpUser, setSignUpUser] = useState('s4mnxx');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('s4mnnx3241@gmail.com');
  const [promoCode, setPromoCode] = useState('SKILL2026');
  const [signUpPass, setSignUpPass] = useState('123456');
  const [confirmPass, setConfirmPass] = useState('123456');

  // Admin secret tap counter
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  // Forgot password modal
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleAdminTap = () => {
    const newCount = adminTapCount + 1;
    setAdminTapCount(newCount);

    if (newCount === 5) {
      onAdminUnlock();
      setAdminNotification('🛡️ Admin Mode Activated! You can now manage tournaments & approve payouts.');
      setTimeout(() => setAdminNotification(null), 4000);
      setAdminTapCount(0);
    } else if (newCount >= 2 && newCount < 5) {
      setAdminNotification(`Admin tap: ${newCount}/5...`);
      setTimeout(() => setAdminNotification(null), 1200);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(loginUser || 's4mnxx');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(signUpUser || 's4mnxx');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgot(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-[#671eff]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Secret Admin tap feedback toast */}
      {adminNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#121622] border border-red-500/50 text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl animate-bounce">
          <Shield className="w-4 h-4 text-red-400" />
          <span>{adminNotification}</span>
        </div>
      )}

      {/* LOGIN SCREEN - NO DEMO FINAL */}
      {screen === 'login' ? (
        <div id="p-login" className="max-w-[420px] mx-auto w-full p-6 pt-20">
          <h1
            onClick={handleAdminTap}
            className="text-[38px] font-bold leading-[42px] cursor-pointer select-none"
          >
            Welcome to,<br />Login
          </h1>
          <p className="text-[11px] text-white/20 mt-2">Tip: Tap 5 times for Admin</p>

          <form onSubmit={handleLoginSubmit}>
            <div className="mt-8 space-y-4">
              <input
                id="lu"
                type="text"
                placeholder="Email/Mobile No/Username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="pill-input w-full px-6 py-[18px] text-[15px] outline-none text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="pill-input w-full px-6 py-[18px] text-[15px] outline-none text-white"
              />
            </div>

            <p
              onClick={() => setShowForgot(true)}
              className="text-right mt-3 text-[13px] text-white/40 cursor-pointer hover:text-white"
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              className="pill-btn w-full py-[18px] mt-6 font-bold text-[16px]"
            >
              LOGIN
            </button>
          </form>

          <p className="text-center mt-6 text-[14px] text-white/40">or Login with</p>

          <p className="text-center mt-12 text-[14px]">
            Don't have an account?{' '}
            <span
              onClick={() => setScreen('signup')}
              className="font-bold cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      ) : (
        /* SIGN UP SCREEN */
        <div className="max-w-[420px] mx-auto w-full pt-4">
          <h1 className="text-[36px] font-bold leading-[40px] tracking-tight">
            Welcome to,<br />Sign Up
          </h1>

          <form onSubmit={handleSignUpSubmit} className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pill-input w-full px-5 py-[15px] text-[14px] outline-none"
              />
              <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="pill-input w-full px-5 py-[15px] text-[14px] outline-none"
              />
            </div>

            <input
              id="un"
              placeholder="Username"
              value={signUpUser}
              onChange={(e) => setSignUpUser(e.target.value)}
              required
              className="pill-input w-full px-6 py-[15px] text-[14px] outline-none"
            />

            <div className="flex gap-2">
              <div className="pill-input px-4 py-[15px] text-[14px] min-w-[85px] flex items-center justify-center font-bold">
                +91 ▼
              </div>
              <input
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pill-input flex-1 px-6 py-[15px] text-[14px] outline-none"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pill-input w-full px-6 py-[15px] text-[14px] outline-none"
            />

            <input
              placeholder="Promo Code (Optional - 'SKILL2026' for ₹20)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="pill-input w-full px-6 py-[15px] text-[14px] outline-none placeholder:text-purple-200"
            />

            <input
              type="password"
              placeholder="Password"
              value={signUpPass}
              onChange={(e) => setSignUpPass(e.target.value)}
              required
              className="pill-input w-full px-6 py-[15px] text-[14px] outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              className="pill-input w-full px-6 py-[15px] text-[14px] outline-none"
            />

            <p className="text-center mt-4 text-[11px] leading-4 text-white/70">
              By Registering, I agree to Skill War's<br />
              <b className="text-white">Terms and Conditions</b> and <b className="text-white">Privacy Policy</b>
            </p>

            <button
              type="submit"
              className="pill-btn w-full py-[16px] mt-4 font-bold uppercase tracking-wide shadow-xl shadow-purple-950/40"
            >
              SIGN UP
            </button>
          </form>

          <p className="text-center mt-5 text-[14px] text-white/80">
            Already have account?{' '}
            <button
              type="button"
              onClick={() => setScreen('login')}
              className="font-bold cursor-pointer text-white underline underline-offset-4 decoration-purple-500"
            >
              Login
            </button>
          </p>
        </div>
      )}

      {/* Forgot password simulation modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#121622] border border-white/10 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-white font-bold text-sm">Reset Password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered mobile or email to receive a Free Fire OTP reset link.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Reset code dispatched via SMS & Email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Email or Mobile"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="py-2 px-3 rounded-xl border border-white/10 text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 pill-btn text-xs font-bold"
                  >
                    Send OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
