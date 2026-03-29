'use client';

import { Plus, Trash2 } from 'lucide-react';

export interface HeaderRow {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface HeadersEditorProps {
  headers: HeaderRow[];
  onChange: (headers: HeaderRow[]) => void;
}

export default function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const addHeader = () => {
    const newHeader: HeaderRow = {
      id: Math.random().toString(36).substring(7),
      key: '',
      value: '',
      enabled: true,
    };
    onChange([...headers, newHeader]);
  };

  const removeHeader = (id: string) => {
    onChange(headers.filter((h) => h.id !== id));
  };

  const updateHeader = (id: string, updates: Partial<HeaderRow>) => {
    onChange(
      headers.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-dracula-comment uppercase tracking-wider">
          Headers da Requisição
        </h3>
        <button
          onClick={addHeader}
          type="button"
          className="flex items-center gap-1.5 text-xs font-medium text-dracula-cyan hover:text-dracula-cyan/80 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Adicionar Header
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {headers.length === 0 ? (
          <p className="text-xs text-dracula-comment italic py-2">
            Nenhum header customizado adicionado.
          </p>
        ) : (
          headers.map((header) => (
            <div key={header.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={(e) => updateHeader(header.id, { enabled: e.target.checked })}
                className="w-4 h-4 rounded border-dracula-card bg-dracula-bg text-dracula-purple focus:ring-dracula-purple/50 focus:ring-offset-0"
              />
              <input
                type="text"
                value={header.key}
                onChange={(e) => updateHeader(header.id, { key: e.target.value })}
                placeholder="Key (ex: Authorization)"
                className="flex-1 h-9 px-3 rounded-lg border border-dracula-card bg-dracula-bg text-dracula-fg placeholder-dracula-comment font-mono text-xs focus:outline-none focus:border-dracula-purple transition-all"
              />
              <input
                type="text"
                value={header.value}
                onChange={(e) => updateHeader(header.id, { value: e.target.value })}
                placeholder="Value"
                className="flex-1 h-9 px-3 rounded-lg border border-dracula-card bg-dracula-bg text-dracula-fg placeholder-dracula-comment font-mono text-xs focus:outline-none focus:border-dracula-purple transition-all"
              />
              <button
                onClick={() => removeHeader(header.id)}
                type="button"
                className="p-2 text-dracula-comment hover:text-dracula-red transition-colors"
                title="Remover header"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
