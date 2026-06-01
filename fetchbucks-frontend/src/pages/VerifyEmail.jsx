import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }

    let cancelled = false

    api.post('/verify-email', { token, email })
      .then(res => {
        if (!cancelled) {
          setStatus('success')
          setMessage(res.data.message)
          setTimeout(() => navigate('/auth'), 3000)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setStatus('error')
          setMessage(err.response?.data?.message || 'Verification failed.')
        }
      })

    return () => { cancelled = true }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--panel)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>
          {status === 'verifying' && '⏳'}
          {status === 'success'   && '✅'}
          {status === 'error'     && '❌'}
        </div>

        <h1 className="font-display" style={{
          fontSize: 22, fontWeight: 700, color: 'var(--text)',
          margin: '0 0 12px',
        }}>
          {status === 'verifying' && 'Verifying your email…'}
          {status === 'success'   && 'Email verified!'}
          {status === 'error'     && 'Verification failed'}
        </h1>

        <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 28px', lineHeight: 1.6 }}>
          {status === 'verifying' && 'Please wait a moment.'}
          {status === 'success'   && `${message} Redirecting to login…`}
          {status === 'error'     && message}
        </p>

        {status === 'success' && (
          <div style={{
            height: 3, borderRadius: 99, background: 'var(--border)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', background: 'var(--accent)',
              animation: 'fb-shrink 3s linear forwards',
              borderRadius: 99,
            }} />
          </div>
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/auth')}
            style={{
              background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '11px 28px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            Back to Login
          </button>
        )}
      </div>

      <style>{`
        @keyframes fb-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}