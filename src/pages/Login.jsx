import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'
import './Auth.css'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/api/auth/login', form)
      setAuth(data.data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">◈</span>
          <span className="auth-logo-name">PRISM</span>
        </div>

        <h1 className="auth-title">Sign in to your workspace</h1>
        <p className="auth-subtitle">Enter your credentials to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: 42, marginTop: 8 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
