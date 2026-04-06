'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PendingAction {
  id: string;
  action: { type: string; [key: string]: unknown };
  intent: string;
  scopes: string[];
  status: string;
  createdAt: string;
}

const DEMO_USER_ID = 'demo-user-123';

export default function Dashboard() {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingActions();
  }, []);

  const fetchPendingActions = async () => {
    try {
      const res = await fetch(`/api/consent?userId=${DEMO_USER_ID}`);
      const data = await res.json();
      setPendingActions(data.pendingActions || []);
    } catch (error) {
      console.error('Failed to fetch pending actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsent = async (actionId: string, decision: 'approve' | 'deny') => {
    setActionLoading(actionId);
    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, decision, userId: DEMO_USER_ID }),
      });
      const data = await res.json();
      if (data.status === 'executed' || data.status === 'denied') {
        await fetchPendingActions();
      }
    } catch (error) {
      console.error('Failed to process consent:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getActionDetails = (action: PendingAction) => {
    switch (action.action.type) {
      case 'CALENDAR_EVENT':
        return {
          icon: '📅',
          title: action.action.title as string,
          subtitle: `${action.action.date} at ${action.action.time || '10:00'}`,
        };
      case 'SEND_EMAIL':
        return {
          icon: '✉️',
          title: action.action.subject as string,
          subtitle: `To: ${action.action.to}`,
        };
      case 'CRM_UPDATE':
        return {
          icon: '👤',
          title: `Update ${action.action.contact}`,
          subtitle: action.action.notes as string,
        };
      default:
        return { icon: '⚡', title: 'Unknown Action', subtitle: '' };
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
            <Link href="/dashboard" className="text-[#e2e8f0] font-medium">
              Dashboard
            </Link>
            <Link href="/simulate" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
              Simulate
            </Link>
            <div className="w-px h-6 bg-[#2d3342]" />
            <span className="px-3 py-1 rounded-full bg-[#151820] border border-[#2d3342] text-sm text-[#94a3b8]">
              Demo User
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">Consent Dashboard</h1>
            <p className="text-[#94a3b8]">Review and approve actions requested by your AI agent</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-[#151820] border border-[#2d3342]">
              <div className="text-3xl font-bold text-[#3b82f6] mb-1">
                {pendingActions.length}
              </div>
              <div className="text-[#94a3b8]">Pending Actions</div>
            </div>
            <div className="p-6 rounded-xl bg-[#151820] border border-[#2d3342]">
              <div className="text-3xl font-bold text-[#22c55e] mb-1">3</div>
              <div className="text-[#94a3b8]">Connected Services</div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#e2e8f0]">Pending Actions</h2>
            <button
              onClick={fetchPendingActions}
              className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-[#94a3b8]">Loading...</div>
          ) : pendingActions.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#151820] border border-[#2d3342] text-center">
              <div className="text-[#94a3b8] mb-4">No pending actions</div>
              <Link
                href="/simulate"
                className="text-[#3b82f6] hover:text-[#2563eb] transition-colors"
              >
                Go to Simulate → 
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingActions.map((action) => {
                const details = getActionDetails(action);
                const isLoading = actionLoading === action.id;
                return (
                  <div
                    key={action.id}
                    className="p-6 rounded-xl bg-[#151820] border border-[#2d3342]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{details.icon}</span>
                        <div>
                          <div className="font-medium text-[#e2e8f0]">{details.title}</div>
                          <div className="text-sm text-[#94a3b8]">{details.subtitle}</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-sm">
                        Pending
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-[#94a3b8] mb-1">Required Scopes:</div>
                      <div className="flex flex-wrap gap-2">
                        {action.scopes.map((scope) => (
                          <span
                            key={scope}
                            className="px-2 py-1 rounded bg-[#0d0f14] text-[#94a3b8] text-xs"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleConsent(action.id, 'approve')}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                      >
                        {isLoading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleConsent(action.id, 'deny')}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 disabled:opacity-50 rounded-lg font-medium transition-colors"
                      >
                        {isLoading ? 'Processing...' : 'Deny'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}