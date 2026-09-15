import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getTokenIconUrl } from '../services/api';

interface SwapInputProps {
  label: string;
  amount: string;
  onChangeAmount?: (val: string) => void;
  selectedToken: string;
  onOpenModal: () => void;
  readOnly?: boolean;
  usdValue: string;
}

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  amount,
  onChangeAmount,
  selectedToken,
  onOpenModal,
  readOnly = false,
  usdValue,
}) => {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 transition-all focus-within:border-indigo-500/80 focus-within:bg-slate-800/60 hover:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        {usdValue && (
          <span className="text-xs text-slate-400 font-mono">
            ≈ ${usdValue}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => onChangeAmount?.(e.target.value)}
          placeholder="0.0"
          readOnly={readOnly}
          className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder:text-slate-600 font-mono"
          min="0"
          step="any"
        />

        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-800 px-3.5 py-2 text-white transition-all hover:bg-slate-700 hover:border-slate-600 shrink-0 shadow-sm"
        >
          <img
            src={getTokenIconUrl(selectedToken)}
            alt={selectedToken}
            className="h-6 w-6 rounded-full bg-slate-900 object-contain"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/24/1e293b/FFFFFF?text=?';
            }}
          />
          <span className="font-bold text-sm">{selectedToken || 'Select'}</span>
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};