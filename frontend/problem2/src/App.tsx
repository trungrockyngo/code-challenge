import React, { useState, useEffect, useMemo } from 'react';
import { ArrowDownUp, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchTokenPrices } from './services/api';
import type { Token, InputMode } from './types';
import { SwapInput } from './components/SwapInput';
import { TokenModal } from './components/TokenModal';

export default function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [modalMode, setModalMode] = useState<InputMode | null>(null);

  useEffect(() => {
    fetchTokenPrices().then((data) => {
      setTokens(data);
      if (data.length >= 2) {
        setFromToken(data[0].currency);
        setToToken(data[1].currency);
      }
      setIsLoading(false);
    });
  }, []);

  const fromPrice = useMemo(
    () => tokens.find((t) => t.currency === fromToken)?.price || 0,
    [tokens, fromToken]
  );

  const toPrice = useMemo(
    () => tokens.find((t) => t.currency === toToken)?.price || 0,
    [tokens, toToken]
  );

  const expectedOutput = useMemo(() => {
    if (!amount || isNaN(Number(amount)) || toPrice === 0) return '';
    return ((Number(amount) * fromPrice) / toPrice).toFixed(6);
  }, [amount, fromPrice, toPrice]);

  const fromUsd = useMemo(() => {
    if (!amount || isNaN(Number(amount))) return '';
    return (Number(amount) * fromPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [amount, fromPrice]);

  const toUsd = useMemo(() => {
    if (!expectedOutput) return '';
    return (Number(expectedOutput) * toPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [expectedOutput, toPrice]);

  const exchangeRate = useMemo(() => {
    if (fromPrice && toPrice) {
      return (fromPrice / toPrice).toFixed(6);
    }
    return null;
  }, [fromPrice, toPrice]);

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!amount || Number(amount) <= 0) {
      setError('Please enter an amount greater than 0.');
      return;
    }
    if (fromToken === toToken) {
      setError('Source and target tokens must be different.');
      return;
    }

    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSuccess(true);
      setAmount('');
      setTimeout(() => setSuccess(false), 3500);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-indigo-400">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-white tracking-wide">Swap Assets</h1>
          {exchangeRate && (
            <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300 shadow-inner">
              <RefreshCw size={12} className="text-indigo-400 animate-spin" />
              <span>1 {fromToken} ≈ {exchangeRate} {toToken}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSwap} className="space-y-2">
          <SwapInput
            label="You Pay"
            amount={amount}
            onChangeAmount={setAmount}
            selectedToken={fromToken}
            onOpenModal={() => setModalMode('from')}
            usdValue={fromUsd}
          />

          <div className="relative -my-3 flex justify-center z-10">
            <button
              type="button"
              onClick={switchTokens}
              className="group rounded-2xl border-4 border-slate-900 bg-slate-800 p-2.5 text-slate-300 shadow-md transition-all hover:scale-110 hover:bg-indigo-600 hover:text-white active:scale-95"
            >
              <ArrowDownUp size={16} className="transition-transform group-hover:rotate-180" />
            </button>
          </div>

          <SwapInput
            label="You Receive"
            amount={expectedOutput}
            selectedToken={toToken}
            onOpenModal={() => setModalMode('to')}
            readOnly
            usdValue={toUsd}
          />

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-sm text-emerald-400">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Swap submitted successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSwapping || !amount}
            className="w-full mt-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:opacity-95 hover:shadow-indigo-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {isSwapping ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Swapping...
              </span>
            ) : (
              'Confirm Swap'
            )}
          </button>
        </form>
      </div>

      <TokenModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        tokens={tokens}
        selectedToken={modalMode === 'from' ? fromToken : toToken}
        onSelect={(token) => {
          if (modalMode === 'from') setFromToken(token);
          if (modalMode === 'to') setToToken(token);
        }}
      />
    </div>
  );
}