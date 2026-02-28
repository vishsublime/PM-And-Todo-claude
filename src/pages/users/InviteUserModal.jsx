import { useState, useEffect } from 'react'
import api from '../../api/axios'

export function InviteUserModal({ onClose, onSuccess }) {
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({ email: '', roleId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/api/roles').then(({ data }) => {
      setRoles(data.data)
      if (data.data.length > 0) {
        setForm((prev) => ({ ...prev, roleId: data.data[0].id }))
      }
    })
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/api/invitations', form)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Invite User</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="invite-email">Email address</label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="colleague@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="invite-role">Role</label>
            <select
              id="invite-role"
              name="roleId"
              required
              value={form.roleId}
              onChange={handleChange}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
