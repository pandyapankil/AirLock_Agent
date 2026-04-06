'use client';

import { useState } from 'react';
import Link from 'next/link';

const DEMO_USER_ID = 'demo-user-123';
const AIRLOCK_SECRET = 'demo-secret-123';

const PRESET_INTENTS = [
  'Schedule a meeting with john@example.com tomorrow at 2pm',
  'Send an email to sarah@company.com about the quarterly report',
  'Book a calendar event for team standup next Monday at 10am',
  'Update CRM contact for Acme Corp with notes: Great prospect',
];

interface ActionLog {
  id: string;
  actionType: string;
  scope: string;
  status: string;
  result: string;
  timestamp: string;
  tokenSource: string;
}

export default function Simulate() {
  const [intent, setIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: string;
    action_description?: string;
    action_type?: string;
    result?: string;
    required_scopes?: string[];
    consent_url?: string;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<ActionLog[]>([]);

  const sendIntent = async (intentText: string) => {
    setIntent(intentText);
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: DEMO_USER_ID,
          secret: AIRLOCK_SECRET,
          intent: intentText,
        }),
      });
      const data = await res.json();
      setResponse(data);
      
      if (data.status === 'executed') {
        fetchLogs();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/action-log?userId=${DEMO_USER_ID}&limit=10`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#e2e8f0]">Airlock</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
              Dashboard
            </Link>
            <Link href="/simulate" className="text-[#e2e8f0] font-medium">
              Simulate
            </Link>
            <div className="w-px h-6 bg-[#2d3342]" />
            <span className="px-3 py-1 rounded-full bg-[#151820] border border-[#2d3342] text-sm text-[#94a3b8]">
              Demo Mode
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">Simulate Agent Intent</h1>
            <p className="text-[#94a3b8]">
              Send intents to the Airlock API to see how consent flow works
            </p>
          </div>

          <div className="mb-8">
            <div className="p-6 rounded-xl bg-[#151820] border border-[#2d3342] mb-4">
              <label className="block text-sm text-[#94a3b8] mb-2">
                Enter an intent (or use a preset below):
              </label>
              <textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="e.g., Schedule a meeting with john@example.com tomorrow at 2pm"
                className="w-full px-4 py-3 rounded-lg bg-[#0d0f14] border border-[#2d3342] text-[#e2e8f0] placeholder-[#94a3b8] focus:outline-none focus:border-[#3b82f6]"
                rows={3}
              />
              <button
                onClick={() => sendIntent(intent)}
                disabled={!intent || loading}
                className="mt-4 w-full px-4 py-3 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processing...' : 'Send Intent'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_INTENTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => sendIntent(preset)}
                  disabled={loading}
                  className="px-3 py-2 text-sm bg-[#151820] hover:bg-[#1c2028] border border-[#2d3342] text-[#94a3b8] rounded-lg transition-colors disabled:opacity-50"
                >
                  {preset.length > 50 ? preset.slice(0, 50) + '...' : preset}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444] text-[#ef4444] mb-6">
              Error: {error}
            </div>
          )}

          {response && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#e2e8f0] mb-4">Response</h2>
              <div
                className={`p-6 rounded-xl border ${
                  response.status === 'executed'
                    ? 'bg-[#22c55e]/10 border-[#22c55e]'
                    : response.status === 'awaiting_consent'
                    ? 'bg-[#f59e0b]/10 border-[#f59e0b]'
                    : 'bg-[#ef4444]/10 border-[#ef4444]'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {response.status === 'executed' && (
                    <span className="text-[#22c55e]">✓ Executed</span>
                  )}
                  {response.status === 'awaiting_consent' && (
                    <span className="text-[#f59e0b]">⏳ Awaiting Consent</span>
                  )}
                </div>
                <div className="text-[#e2e8f0] mb-2">
                  {String(response.action_description || '')}
                </div>
                {response.result && (
                  <div className="text-sm text-[#94a3b8] mb-3">
                    {String(response.result)}
                  </div>
                )}
                {response.required_scopes && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(response.required_scopes as string[]).map(
                      (scope: string) => (
                        <span
                          key={scope}
                          className="px-2 py-1 rounded bg-[#0d0f14] text-[#94a3b8] text-xs"
                        >
                          {scope}
                        </span>
                      )
                    )}
                  </div>
                )}
                {response.consent_url && (
                  <Link
                    href={String(response.consent_url)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm transition-colors"
                  >
                    Go to Dashboard →
                  </Link>
                )}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-[#e2e8f0] mb-4">Action Log</h2>
            {logs.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#151820] border border-[#2d3342] text-center text-[#94a3b8]">
                No actions yet
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-[#151820] border border-[#2d3342]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#e2e8f0]">{log.actionType}</span>
                      <span
                        className={`text-xs ${
                          log.status === 'success'
                            ? 'text-[#22c55e]'
                            : log.status === 'mocked'
                            ? 'text-[#f59e0b]'
                            : 'text-[#ef4444]'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div className="text-sm text-[#94a3b8]">{log.result}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#94a3b8]">
                      <span>Scope: {log.scope}</span>
                      <span>Token: {log.tokenSource}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}