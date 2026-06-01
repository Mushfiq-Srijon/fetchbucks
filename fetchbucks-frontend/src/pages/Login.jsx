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
        { name: 'email',    type: 'email',    label: 'Email',    placeholder: 'you@example.com' },
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
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="flex gap-2">
        {['Google', 'Facebook', 'Twitter'].map((provider) => (
          <button key={provider} type="button"
            className="flex-1 py-2 rounded-xl text-xs font-medium border transition-all duration-200"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
            {provider}
          </button>
        ))}
      </div>

    </form>
  )
}

export default Login