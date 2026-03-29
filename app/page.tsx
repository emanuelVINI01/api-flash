'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import RequestBar, { type HttpMethod, type ResponseData } from '@/components/RequestBar';
import RequestBodyEditor from '@/components/RequestBodyEditor';
import ResponseViewer from '@/components/ResponseViewer';
import AdvancedSettings from '@/components/AdvancedSettings';
import type { HeaderRow } from '@/components/HeadersEditor';
import Footer from '@/components/Footer';

export default function Home() {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<HeaderRow[]>([]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResponse = (data: ResponseData) => {
    setResponse(data);
    setError(null);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setResponse(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dracula-bg text-dracula-fg">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-dracula-card/70 bg-dracula-bg/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dracula-cyan/10 border border-dracula-cyan/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-dracula-cyan fill-dracula-cyan" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-dracula-fg">API</span>
              <span className="text-dracula-cyan">-Flash</span>
            </span>
          </div>
          <span className="text-xs font-mono text-dracula-comment bg-dracula-card/50 px-3 py-1 rounded-full border border-dracula-card">
            v1.0.0
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* Hero label */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-dracula-fg">
            Teste seus endpoints{' '}
            <span className="text-dracula-cyan">sem complicação</span>
          </h1>
          <p className="text-sm text-dracula-comment">
            Um cliente HTTP minimalista para requisições rápidas direto no navegador.
          </p>
        </div>

        {/* Request panel */}
        <section className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-dracula-card bg-dracula-card/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 rounded-full bg-dracula-purple" />
            <h2 className="text-sm font-semibold text-dracula-fg uppercase tracking-widest">
              Requisição
            </h2>
          </div>

          <RequestBar
            method={method}
            url={url}
            headers={headers}
            body={body}
            onMethodChange={setMethod}
            onUrlChange={setUrl}
            onResponse={handleResponse}
            onError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />

          <AdvancedSettings
            headers={headers}
            onHeadersChange={setHeaders}
          />

          <RequestBodyEditor
            body={body}
            method={method}
            onChange={setBody}
          />
        </section>

        {/* Response panel */}
        <section className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-dracula-card bg-dracula-card/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 rounded-full bg-dracula-cyan" />
            <h2 className="text-sm font-semibold text-dracula-fg uppercase tracking-widest">
              Resposta
            </h2>
          </div>

          <ResponseViewer
            response={response}
            error={error}
            isLoading={isLoading}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
