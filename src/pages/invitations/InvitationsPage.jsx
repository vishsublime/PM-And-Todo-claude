import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import { InviteUserModal } from '../users/InviteUserModal'

const STATUS_BADGE = {
  PENDING: 'badge-warning',
  ACCEPTED: 'badge-success',
  EXPIRED: 'badge-gray',
}

export function InvitationsPage() {
  const { user: currentUser } = useAuthStore()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  const loadInvitations = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/invitations')
      setInvitations(data.data)
    } catch {
      setError('Failed to load invitations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadInvitations() }, [loadInvitations])

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this invitation?')) return
    try {
      await api.delete(`/api/invitations/${id}`)
      showSuccess('Invitation cancelled.')
      loadInvitations()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel invitation.')
    }
  }

  const handleResend = async (id) => {
    try {
      await api.post(`/api/invitations/${id}/resend`)
      showSuccess('Invitation resent.')
      loadInvitations()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend invitation.')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Invitations</h1>
          <p>Track and manage invitations for {currentUser?.tenantName}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
          + Invite User
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span className="spinner spinner-lg" />
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Invited By</th>
                <th>Expires</th>
                <th>Sent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <p>No invitations yet. Click "Invite User" to send the first one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                invitations.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.email}</td>
                    <td>
                      <span className="badge badge-primary">{inv.roleName}</span>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[inv.status] ?? 'badge-gray'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-gray-500)' }}>
                      {inv.invitedByName}
                    </td>
                    <td style={{ color: 'var(--color-gray-400)', fontSize: 12 }}>
                      {formatDate(inv.expiresAt)}
                    </td>
                    <td style={{ color: 'var(--color-gray-400)', fontSize: 12 }}>
                      {formatDate(inv.createdAt)}
                    </td>
                    <td>
                      {inv.status === 'PENDING' && (
                        <div className="actions">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => handleResend(inv.id)}
                          >
                            Resend
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleCancel(inv.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false)
            showSuccess('Invitation sent.')
            loadInvitations()
          }}
        />
      )}
    </div>
  )
}
