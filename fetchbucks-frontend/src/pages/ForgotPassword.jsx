import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '12px 16px', fontSize: 15, color: 'var(--text)',
    fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--panel)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%',
      }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/auth')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: 14, padding: 0, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Back to login
        </button>

        <h1 className="font-display" style={{
          fontSize: 24, fontWeight: 800, color: 'var(--text)',
          margin: '0 0 8px', letterSpacing: '-0.5px',
        }}>
          Forgot password?
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 32px', lineHeight: 1.6 }}>
          Enter your email and we'll send you a reset link.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'var(--text-muted)', marginBottom: 8,
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                onBlur={e  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#f87171',
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg,#4f9cf9,#3b82f6)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '13px 24px', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', width: '100%',
                boxShadow: '0 4px 14px rgba(79,156,249,0.35)',
                opacity: loading ? 0.6 : 1,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 28px' }}>
              If <strong style={{ color: 'var(--text)' }}>{email}</strong> is registered,
              you'll receive a reset link shortly. Check your inbox and spam folder.
            </p>
            <button
              onClick={() => navigate('/auth')}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 10, padding: '11px 28px', fontSize: 14,
                color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}