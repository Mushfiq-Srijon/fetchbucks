import { useState } from 'react'
import Login from './Login'
import Register from './Register'

function Auth() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex w-[55%] flex-col justify-between p-12 relative overflow-hidden border-r"
        style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
      >

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(79,156,249,0.06)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-[20%] right-[5%] w-52 h-52 rounded-full pointer-events-none"
          style={{ background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }}
          />
          <span className="font-display font-extrabold text-xl tracking-tight">
            FetchBucks
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <div
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5"
            style={{ color: 'var(--accent)' }}
          >
            Personal Finance, Simplified
          </div>

          <h1
            className="font-display font-extrabold leading-tight tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}
          >
            Spend smart.<br />
            Save more.<br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1px rgba(79,156,249,0.5)' }}
            >
              Stress less.
            </span>
          </h1>

          <p
            className="text-sm leading-relaxed font-light max-w-sm"
            style={{ color: 'var(--text-dim)' }}
          >
            Stop wondering where your money went. FetchBucks gives you a clear picture of every expense, every budget, every month.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mt-12">
            {[
              { value: '100%', label: 'Private & yours' },
              { value: 'Free', label: 'Always' },
              { value: '∞', label: 'Entries' },
            ].map((stat, i) => (
              <div key={i} className="flex gap-10 items-start">
                {i !== 0 && (
                  <div className="w-px self-stretch" style={{ background: 'var(--border)' }} />
                )}
                <div>
                  <div className="font-display font-bold text-3xl leading-none">
                    {stat.value}
                  </div>
                  <div
                    className="text-xs mt-1 tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex">
            {[
              { letter: 'S', colors: 'from-blue-400 to-violet-600' },
              { letter: 'R', colors: 'from-amber-400 to-red-500' },
              { letter: 'M', colors: 'from-emerald-400 to-blue-400' },
            ].map((av, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full bg-linear-to-br ${av.colors} flex items-center justify-center text-xs font-semibold text-white border-2`}
                style={{ marginLeft: i === 0 ? 0 : '-8px', borderColor: 'var(--panel)' }}
              >
                {av.letter}
              </div>
            ))}
          </div>
          <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>
            Made for people who are serious about<br />
            <strong style={{ color: 'var(--text-dim)' }}>
              taking control of their finances.
            </strong>
          </p>
        </div>

      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl tracking-tight mb-1">
              {activeTab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>
              {activeTab === 'login'
                ? 'Sign in to your FetchBucks account'
                : 'Start tracking your expenses today'}
            </p>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-7 border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {['login', 'register'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200"
                style={{
                  background: activeTab === tab ? 'var(--surface2)' : 'transparent',
                  color: activeTab === tab ? 'var(--text)' : 'var(--text-muted)',
                  border: activeTab === tab ? '1px solid var(--border)' : '1px solid transparent',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Forms */}
          {activeTab === 'login' ? <Login /> : <Register onSuccess={() => setActiveTab('login')} />}

        </div>
      </div>

    </div>
  )
}

export default Auth