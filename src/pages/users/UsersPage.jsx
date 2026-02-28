import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import { InviteUserModal } from './InviteUserModal'

export function UsersPage() {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/roles'),
      ])
      setUsers(usersRes.data.data)
      setRoles(rolesRes.data.data)
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleChangeRole = async (userId, roleId) => {
    try {
      await api.put(`/api/users/${userId}/role`, { roleId })
      showSuccess('Role updated.')
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role.')
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/api/users/${userId}/status`, { isActive: !currentStatus })
      showSuccess(`User ${currentStatus ? 'deactivated' : 'activated'}.`)
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Remove ${userName} from your organisation?`)) return
    try {
      await api.delete(`/api/users/${userId}`)
      showSuccess('User removed.')
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove user.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage team members in {currentUser?.tenantName}</p>
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <p>No users found. Invite someone to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="user-avatar-sm">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        {u.fullName}
                        {u.id === currentUser?.userId && (
                          <span className="badge badge-primary" style={{ fontSize: 10 }}>You</span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-gray-500)' }}>{u.email}</td>
                    <td>
                      <select
                        value={u.roleId}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        disabled={u.id === currentUser?.userId}
                        style={{
                          border: '1px solid var(--color-gray-200)',
                          borderRadius: 4,
                          padding: '3px 6px',
                          fontSize: 13,
                          background: '#fff',
                          cursor: u.id === currentUser?.userId ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-gray-400)', fontSize: 12 }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u.id !== currentUser?.userId && (
                        <div className="actions">
                          <button
                            className={`btn btn-sm ${u.isActive ? 'btn-secondary' : 'btn-ghost'}`}
                            onClick={() => handleToggleStatus(u.id, u.isActive)}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(u.id, u.fullName)}
                          >
                            Remove
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
            showSuccess('Invitation sent successfully.')
            loadData()
          }}
        />
      )}

      <style>{`
        .user-avatar-sm {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #4f46e5;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}
