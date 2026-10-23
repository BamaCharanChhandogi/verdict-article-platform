import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setIsLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } else {
      const res = await register(name, email, password);
      setIsLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Registration failed.');
      }
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@verdict.com');
    setPassword('password123');
    setMode('login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-[#FAF7F2] dark:bg-[#171B22] p-8 text-left shadow-2xl border border-[#EAE4D9] dark:border-[#262C3A] transition-all">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-1.5 text-zinc-400 hover:text-black dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <h2 className="font-editorial text-3xl font-bold text-[#141416] dark:text-white">
              Verdict<span className="text-[#9E5A38] dark:text-[#E05A30]">.</span>
            </h2>
            <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {mode === 'login' 
                ? 'Sign in to access your curated reading list and publish stories.' 
                : 'Join our community of thoughtful writers and curious readers.'
              }
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-full bg-[#EAE4D9]/60 dark:bg-[#1F2430] p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#262C3A] text-[#141416] dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-[#262C3A] text-[#141416] dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Hayes"
                    className="w-full bg-white dark:bg-[#1F2430] text-xs text-[#141416] dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#EAE4D9] dark:border-[#262C3A] focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-white dark:bg-[#1F2430] text-xs text-[#141416] dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#EAE4D9] dark:border-[#262C3A] focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-[#1F2430] text-xs text-[#141416] dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#EAE4D9] dark:border-[#262C3A] focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#141416] dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-full transition-all shadow-md cursor-pointer"
            >
              {isLoading 
                ? 'Processing...' 
                : mode === 'login' ? 'Sign In to Verdict' : 'Create My Account'
              }
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Pill */}
          <div className="mt-6 pt-5 border-t border-[#EAE4D9] dark:border-[#262C3A] text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center space-x-1.5 text-xs text-[#2E4A3E] dark:text-emerald-400 hover:text-black dark:hover:text-white font-semibold bg-[#EBF1EE] dark:bg-emerald-950/40 hover:bg-[#dfe9e3] dark:hover:bg-emerald-950/70 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Evaluator Demo Credentials</span>
            </button>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
              demo@verdict.com &bull; password123
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
