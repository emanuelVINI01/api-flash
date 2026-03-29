'use client';

import { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { HttpMethod } from './RequestBar';

interface RequestBodyEditorProps {
  body: string;
  method: HttpMethod;
  onChange: (value: string) => void;
}

function isValidJson(str: string): boolean {
  if (!str.trim()) return true;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

function prettyJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

export default function RequestBodyEditor({ body, method, onChange }: RequestBodyEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [focused, setFocused] = useState(false);

  const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes(method);
  const valid = isValidJson(body);

  const handleFormat = useCallback(() => {
    if (valid && body.trim()) {
      onChange(prettyJson(body));
    }
  }, [body, valid, onChange]);

  if (!isBodyMethod) {
    return (
      <div className="w-full rounded-xl border border-dracula-card bg-dracula-card/30 p-6 flex items-center justify-center gap-3 text-dracula-comment">
        <Code2 className="w-5 h-5 opacity-50" />
        <span className="text-sm font-mono">
          O método <span className="text-dracula-cyan font-semibold">{method}</span> não possui corpo de requisição.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-dracula-purple" />
          <span className="text-xs font-semibold text-dracula-comment uppercase tracking-widest">
            Request Body
          </span>
          <span className="text-xs text-dracula-comment">(JSON)</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Validation indicator */}
          {body.trim() && (
            <div className={`flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md ${
              valid
                ? 'text-dracula-green bg-dracula-green/10'
                : 'text-dracula-red bg-dracula-red/10'
            }`}>
              {valid ? (
                <><CheckCircle2 className="w-3 h-3" /> JSON válido</>
              ) : (
                <><AlertCircle className="w-3 h-3" /> JSON inválido</>
              )}
            </div>
          )}
          {/* Format button */}
          {valid && body.trim() && (
            <button
              onClick={handleFormat}
              className="text-xs px-3 py-1 rounded-lg border border-dracula-card text-dracula-comment hover:text-dracula-fg hover:border-dracula-comment transition-all duration-200"
            >
              Formatar
            </button>
          )}
          {/* Preview toggle */}
          <button
            onClick={() => setPreviewMode((p) => !p)}
            className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border border-dracula-card text-dracula-comment hover:text-dracula-fg hover:border-dracula-comment transition-all duration-200"
          >
            {previewMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {previewMode ? 'Editar' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div
        className={`relative rounded-xl border overflow-hidden transition-all duration-200 ${
          focused && !previewMode ? 'border-dracula-purple ring-1 ring-dracula-purple/30' : 'border-dracula-card'
        }`}
      >
        {previewMode ? (
          <div className="min-h-[180px] overflow-auto">
            <SyntaxHighlighter
              language="json"
              style={dracula}
              customStyle={{
                margin: 0,
                padding: '16px',
                background: 'transparent',
                fontSize: '13px',
                lineHeight: '1.6',
                minHeight: '180px',
              }}
              wrapLongLines
            >
              {body.trim() ? (valid ? prettyJson(body) : body) : '// Nenhum conteúdo para exibir'}
            </SyntaxHighlighter>
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`{\n  "key": "value"\n}`}
            spellCheck={false}
            className="
              w-full min-h-[180px] p-4 bg-dracula-card/50 text-dracula-fg
              font-mono text-sm leading-relaxed resize-y
              placeholder-dracula-comment/50
              focus:outline-none
              transition-colors duration-200
            "
          />
        )}
      </div>
    </div>
  );
}
