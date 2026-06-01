import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (token) {
      localStorage.setItem('token', token)
      window.dispatchEvent(new Event('storage'))
      navigate('/dashboard')
    } else {
      navigate('/auth?error=' + (error || 'google_failed'))
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text)',
    }}>
      Signing you in with Google…
    </div>
  )
}