import React, { useState } from 'react';
import { Lock, KeyRound, User, AlertCircle, Sparkles, CheckCircle2, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder login credentials
    if (username.trim().toLowerCase() === 'admin' && password === 'password123') {
      setError(null);
      onLoginSuccess();
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดใช้ admin / password123)');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 border border-amber-400/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            เข้าสู่ระบบผู้ดูแลระบบ (Map Editor)
          </h2>
          <p className="text-xs text-slate-400 font-light">
            การเข้าถึงส่วนแก้ไขโครงข่ายแผนที่ผ่านช่องทางลับ <code className="text-amber-400 font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">/mapedit</code>
          </p>
        </div>

        {/* Demo Credentials Alert Box */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>บัญชีสำหรับทดสอบ (Demo Credentials):</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400/40 transition font-medium"
            >
              กรอกอัตโนมัติ
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded-xl border border-amber-500/20">
            <div>Username: <strong className="text-white">admin</strong></div>
            <div>Password: <strong className="text-white">password123</strong></div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>ชื่อผู้ใช้งาน (Username)</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้งาน"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>รหัสผ่าน (Password)</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>เข้าสู่ระบบระบบผู้ดูแล (Login)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
