import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember_me: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setUnverified(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/login', form)
      localStorage.setItem('token', res.data.token)
      window.location.href = '/dashboard'
    } catch (err) {
      if (err.response?.data?.unverified) {
        setUnverified(true)
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    try {
      await api.post('/resend-verification', { email: form.email })
      setResendSent(true)
    } catch (err) {
      setError('Could not resend verification email.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

      {error && (
        <p className="text-sm text-center rounded-xl px-3 py-2"
          style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)' }}>
          {error}
        </p>
      )}

      {unverified && (
        <div style={{
          padding: '14px 16px', borderRadius: 10, fontSize: 14, lineHeight: 1.6,
          background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)',
          color: '#fbbf24',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Email not verified</div>
          <div style={{ color: '#d9a820', marginBottom: 10 }}>
            Please verify your email before logging in.
          </div>
          {!resendSent ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              style={{
                background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)',
                borderRadius: 8, padding: '7px 16px', fontSize: 13, color: '#fbbf24',
                cursor: 'pointer', fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {resendLoading ? 'Sending…' : 'Resend verification email'}
            </button>
          ) : (
            <span style={{ fontSize: 13, color: '#4ade80' }}>✓ Verification email sent!</span>
          )}
        </div>
      )}

      {[
        { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com' },
        { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}>
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all duration-200"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)',
        }}>
          <input
            type="checkbox"
            name="remember_me"
            checked={form.remember_me}
            onChange={handleChange}
            style={{ width: 15, height: 15, accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
          Remember me for 30 days
        </label>
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--accent)', padding: 0,
          }}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-200 mt-1 disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        {loading ? 'Signing in…' : 'Sign In →'}
      </button>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          or continue with
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <button
        type="button"
        onClick={() => { window.location.href = 'http://localhost:8000/api/auth/google' }}
        className="w-full py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center justify-center gap-2 google-btn"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-dim)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.08-6.08C34.5 3.02 29.56 1 24 1 14.82 1 7.07 6.48 3.64 14.18l7.08 5.5C12.4 13.02 17.73 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.58C43.18 37.13 46.1 31.27 46.1 24.5z" />
          <path fill="#FBBC05" d="M10.72 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.08-5.5A23.93 23.93 0 0 0 0 24c0 3.86.92 7.5 2.56 10.72l8.16-6.4z" />
          <path fill="#34A853" d="M24 47c5.56 0 10.22-1.84 13.63-5l-7.19-5.58c-1.89 1.27-4.31 2.02-6.44 2.02-6.27 0-11.6-3.52-13.28-8.68l-8.16 6.4C7.07 41.52 14.82 47 24 47z" />
        </svg>
        Continue with Google
      </button>

      <style>{`
  .google-btn:hover {
    background: rgba(66, 133, 244, 0.08) !important;
    border-color: rgba(66, 133, 244, 0.4) !important;
    color: #4285F4 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(66, 133, 244, 0.15);
  }
  .google-btn:active {
    transform: translateY(0px);
  }
`}</style>

    </form>
  )
}

export default Login