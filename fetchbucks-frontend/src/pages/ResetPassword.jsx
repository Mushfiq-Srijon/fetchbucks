import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await api.post('/reset-password', {
        email,
        token,
        password:              form.password,
        password_confirmation: form.password_confirmation,
      })
      setSuccess(true)
      setTimeout(() => navigate('/auth'), 3000)
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

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    color: 'var(--text-muted)', marginBottom: 8,
  }

  if (!token || !email) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 12px' }}>Invalid link</h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 28px' }}>This reset link is invalid or has expired.</p>
          <button onClick={() => navigate('/auth')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%' }}>

        {!success ? (
          <>
            <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Reset password
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 32px', lineHeight: 1.6 }}>
              Choose a new password for <strong style={{ color: 'var(--text)' }}>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="•••••••• (min 8 characters)"
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                />
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg,#4f9cf9,#3b82f6)', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '13px 24px',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%',
                  boxShadow: '0 4px 14px rgba(79,156,249,0.35)',
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 12px' }}>
              Password reset!
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
              Your password has been updated. Redirecting to login…
            </p>
            <div style={{ height: 3, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--accent)', animation: 'fb-shrink 3s linear forwards', borderRadius: 99 }} />
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fb-shrink { from { width:100%; } to { width:0%; } }
      `}</style>
    </div>
  )
}