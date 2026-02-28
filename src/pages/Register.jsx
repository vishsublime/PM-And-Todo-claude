import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Auth.css'

export function RegisterPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [invitation, setInvitation] = useState(null)
  const [tokenError, setTokenError] = useState('')
  const [tokenLoading, setTokenLoading] = useState(true)

  const [form, setForm] = useState({ fullName: '', password: '', confirmPassword: '' })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setTokenError('No invitation token found. Please use the link from your email.')
      setTokenLoading(false)
      return
    }

    api.get(`/api/register/validate-token?token=${token}`)
      .then(({ data }) => {
        setInvitation(data.data)
      })
      .catch((err) => {
        setTokenError(err.response?.data?.message || 'Invalid or expired invitation.')
      })
      .finally(() => setTokenLoading(false))
  }, [token])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/api/register/complete', {
        token,
        fullName: form.fullName.trim(),
        password: form.password,
      })
      setSuccess(true)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (tokenLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <span className="spinner spinner-lg" style={{ margin: '20px auto', display: 'block' }} />
          <p style={{ color: 'var(--color-gray-500)', marginTop: 12 }}>Validating invitation...</p>
        </div>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-icon">◈</span>
            <span className="auth-logo-name">PRISM</span>
          </div>
          <div className="alert alert-error">{tokenError}</div>
          <p style={{ fontSize: 13, color: 'var(--color-gray-500)' }}>
            Please contact your administrator for a new invitation.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-icon">◈</span>
            <span className="auth-logo-name">PRISM</span>
          </div>
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            Account created successfully!
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-gray-600)', marginBottom: 20 }}>
            You can now sign in with your email and password.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">◈</span>
          <span className="auth-logo-name">PRISM</span>
        </div>

        <h1 className="auth-title">Complete your registration</h1>
        <p className="auth-subtitle">Set up your account to get started</p>

        {invitation && (
          <div className="auth-tenant-info">
            <p><span className="auth-tenant-label">Organisation:</span> {invitation.tenantName}</p>
            <p><span className="auth-tenant-label">Role:</span> {invitation.roleName}</p>
            <p><span className="auth-tenant-label">Invited by:</span> {invitation.invitedByName}</p>
          </div>
        )}

        {formError && <div className="alert alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              value={invitation?.email ?? ''}
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: 42, marginTop: 8 }}
            disabled={submitting}
          >
            {submitting ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
