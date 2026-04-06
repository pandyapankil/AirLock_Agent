import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#e2e8f0]">Airlock</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
              Dashboard
            </Link>
            <Link href="/simulate" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
              Simulate
            </Link>
            <div className="w-px h-6 bg-[#2d3342]" />
            <Link
              href="/api/auth/login"
              className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151820] border border-[#2d3342] text-sm text-[#94a3b8] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              Auth0 Token Vault Integration
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#e2e8f0] mb-6">
              Secure AI Agents with
              <br />
              <span className="text-[#3b82f6]">User-Controlled Actions</span>
            </h1>
            <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto mb-10">
              Airlock is a secure intermediary architecture for local-first AI agents.
              Uses Auth0 Token Vault to perform authenticated external actions
              (email, calendar, CRM) on behalf of users with explicit consent.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/simulate"
                className="px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-medium transition-colors"
              >
                Try Demo
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-[#2d3342] text-[#e2e8f0] rounded-lg font-medium hover:bg-[#151820] transition-colors"
              >
                View Code
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-xl bg-[#151820] border border-[#2d3342]">
              <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">Token Vault</h3>
              <p className="text-[#94a3b8]">
                Auth0 Token Vault securely stores OAuth tokens. Your credentials never touch the AI agent directly.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#151820] border border-[#2d3342]">
              <div className="w-12 h-12 rounded-lg bg-[#22c55e]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">Explicit Consent</h3>
              <p className="text-[#94a3b8]">
                Users approve each action before execution. Full visibility into what the agent is doing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#151820] border border-[#2d3342]">
              <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">Scoped Access</h3>
              <p className="text-[#94a3b8]">
                Actions are limited to specific OAuth scopes. Fine-grained control over capabilities.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#151820] border border-[#2d3342] p-8 glow">
            <h2 className="text-2xl font-bold text-[#e2e8f0] mb-6 text-center">How It Works</h2>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-bold">1</div>
                <span className="text-[#e2e8f0]">Local Agent</span>
              </div>
              <svg className="w-6 h-6 text-[#2d3342]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-bold">2</div>
                <span className="text-[#e2e8f0]">Airlock API</span>
              </div>
              <svg className="w-6 h-6 text-[#2d3342]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center text-white font-bold">3</div>
                <span className="text-[#e2e8f0]">Auth0 Token Vault</span>
              </div>
              <svg className="w-6 h-6 text-[#2d3342]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center text-white font-bold">4</div>
                <span className="text-[#e2e8f0]">External APIs</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#2d3342] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[#94a3b8]">
          <p>Built for the Auth0 &quot;Authorized to Act&quot; Hackathon</p>
        </div>
      </footer>
    </div>
  );
}