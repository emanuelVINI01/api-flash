'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { HeaderRow } from './HeadersEditor';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ResponseData {
  status: number;
  statusText: string;
  body: unknown;
  headers: Record<string, string>;
  duration: number;
}

interface RequestBarProps {
  method: HttpMethod;
  url: string;
  headers: HeaderRow[];
  body: string;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onResponse: (data: ResponseData) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-dracula-cyan',
  POST: 'text-dracula-green',
  PUT: 'text-dracula-orange',
  DELETE: 'text-dracula-red',
  PATCH: 'text-dracula-purple',
};

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function RequestBar({
  method,
  url,
  headers,
  body,
  onMethodChange,
  onUrlChange,
  onResponse,
  onError,
  isLoading,
  setIsLoading,
}: RequestBarProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) {
      onError('Por favor, insira uma URL válida.');
      return;
    }

    // Validate URL
    try {
      new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    } catch {
      onError('URL inválida. Verifique o formato (ex: https://api.exemplo.com/endpoint).');
      return;
    }

    const finalUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;

    setIsLoading(true);
    const start = performance.now();

    try {
      const customHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.enabled && h.key && h.value) {
          customHeaders[h.key] = h.value;
        }
      });

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        options.body = body;
      }

      const response = await fetch(finalUrl, options);
      const duration = Math.round(performance.now() - start);

      const headersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      let responseBody: unknown;
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      onResponse({
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
        headers: headersObj,
        duration,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido.';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        onError('Não foi possível conectar ao servidor. Verifique a URL e sua conexão.');
      } else {
        onError(`Erro na requisição: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Method Select */}
        <div className="relative shrink-0">
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
            disabled={isLoading}
            className={`
              h-12 pl-4 pr-8 rounded-xl border border-dracula-card bg-dracula-card 
              font-mono font-bold text-sm appearance-none cursor-pointer
              focus:outline-none focus:border-dracula-purple focus:ring-1 focus:ring-dracula-purple/50
              transition-all duration-200 disabled:opacity-50
              ${METHOD_COLORS[method]}
            `}
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m} className="bg-dracula-bg text-dracula-fg">
                {m}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className="w-4 h-4 text-dracula-comment" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* URL Input */}
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://api.exemplo.com/v1/users"
          disabled={isLoading}
          className="
            flex-1 h-12 px-4 rounded-xl border border-dracula-card bg-dracula-card
            text-dracula-fg placeholder-dracula-comment font-mono text-sm
            focus:outline-none focus:border-dracula-purple focus:ring-1 focus:ring-dracula-purple/50
            hover:border-dracula-comment transition-all duration-200 disabled:opacity-50
          "
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="
            h-12 px-6 rounded-xl font-semibold text-sm
            bg-dracula-purple text-dracula-bg
            hover:opacity-90 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
            transition-all duration-200 flex items-center gap-2 shrink-0
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
