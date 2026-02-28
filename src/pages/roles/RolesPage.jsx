import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

export function RolesPage() {
  const { user: currentUser } = useAuthStore()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [adding, setAdding] = useState(false)

  const loadRoles = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/roles')
      setRoles(data.data)
    } catch {
      setError('Failed to load roles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadRoles() }, [loadRoles])

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleAddRole = async (e) => {
    e.preventDefault()
    if (!newRoleName.trim()) return
    setAdding(true)
    try {
      await api.post('/api/roles', { name: newRoleName.trim() })
      setNewRoleName('')
      setShowAddForm(false)
      showSuccess('Role created.')
      loadRoles()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create role.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (roleId, roleName) => {
    if (!window.confirm(`Delete role "${roleName}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/roles/${roleId}`)
      showSuccess('Role deleted.')
      loadRoles()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Roles</h1>
          <p>Manage roles for {currentUser?.tenantName}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          + Add Role
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {showAddForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddForm(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Add Role</h2>
              <button className="modal-close" onClick={() => setShowAddForm(false)}>✕</button>
            </div>
            <form onSubmit={handleAddRole}>
              <div className="form-group">
                <label htmlFor="role-name">Role name</label>
                <input
                  id="role-name"
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. MANAGER"
                  autoFocus
                />
                <span style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>
                  Will be stored in uppercase
                </span>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={adding}>
                  {adding ? <span className="spinner" /> : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span className="spinner spinner-lg" />
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Created</th>
                <th>Users Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <p>No roles found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                roles.map((role) => {
                  const isDefault = role.name === 'ADMIN' || role.name === 'USER'
                  return (
                    <tr key={role.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="badge badge-primary">{role.name}</span>
                          {isDefault && (
                            <span style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>
                              Default
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-gray-400)', fontSize: 12 }}>
                        {new Date(role.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge ${role.hasUsers ? 'badge-warning' : 'badge-gray'}`}>
                          {role.hasUsers ? 'In use' : 'No users'}
                        </span>
                      </td>
                      <td>
                        {!isDefault && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(role.id, role.name)}
                            disabled={role.hasUsers}
                            title={role.hasUsers ? 'Cannot delete a role with users assigned' : ''}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
