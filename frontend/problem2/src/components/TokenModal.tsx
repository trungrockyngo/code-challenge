import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import type { Token } from '../types';
import { getTokenIconUrl } from '../services/api';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  selectedToken: string;
  onSelect: (currency: string) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  tokens,
  selectedToken,
  onSelect,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredTokens = tokens.filter((t) =>
    t.currency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/60 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Select a Token</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative my-4">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-700/80 bg-slate-800/90 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {filteredTokens.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No tokens found.</p>
          ) : (
            filteredTokens.map((token) => {
              const isSelected = token.currency === selectedToken;
              return (
                <button
                  key={token.currency}
                  type="button"
                  onClick={() => {
                    onSelect(token.currency);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getTokenIconUrl(token.currency)}
                      alt={token.currency}
                      className="h-8 w-8 rounded-full bg-slate-800 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/32/1e293b/FFFFFF?text=?';
                      }}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{token.currency}</p>
                      <p className="text-xs text-slate-400">${token.price.toFixed(4)}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={18} className="text-indigo-400" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};