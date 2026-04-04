import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/login', form)
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

      {error && (
        <p
          className="text-sm text-center rounded-xl px-3 py-2"
          style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)' }}
        >
          {error}
        </p>
      )}

      {[
        { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com' },
        { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
      ].map((field) => (
        <div key={field.name}>
          <label
            className="block text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
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
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-200 mt-1 disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        {loading ? 'Signing in...' : 'Sign In →'}
      </button>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          or continue with
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="flex gap-2">
        {['Google', 'Facebook', 'Twitter'].map((provider) => (
          <button
            key={provider}
            type="button"
            className="flex-1 py-2 rounded-xl text-xs font-medium border transition-all duration-200"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-dim)',
            }}
          >
            {provider}
          </button>
        ))}
      </div>

    </form>
  )
}

export default Login