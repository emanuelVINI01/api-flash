'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import HeadersEditor, { type HeaderRow } from './HeadersEditor';

interface AdvancedSettingsProps {
  headers: HeaderRow[];
  onHeadersChange: (headers: HeaderRow[]) => void;
}

export default function AdvancedSettings({ headers, onHeadersChange }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-xl border border-dracula-card overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-dracula-card/30 hover:bg-dracula-card/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-dracula-comment" />
          <span className="text-sm font-medium text-dracula-fg">Configurações Avançadas</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-dracula-card text-dracula-comment font-mono">
            {headers.filter(h => h.enabled).length} headers
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-dracula-comment" />
        ) : (
          <ChevronDown className="w-4 h-4 text-dracula-comment" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-dracula-card/10 border-t border-dracula-card animate-in slide-in-from-top-2 duration-300">
          <HeadersEditor headers={headers} onChange={onHeadersChange} />
        </div>
      )}
    </div>
  );
}
