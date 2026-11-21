import React, { useState } from 'react'
import { User } from 'lucide-react'
import { useAuth, authErrorMessage } from '../context/AuthContext'
import '../styles/Auth.css'

export default function AccountButton() {
  const { user, logout, deleteAccount } = useAuth()
  const [open, setOpen] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const close = () => {
    setOpen(false)
    setConfirmingDelete(false)
    setPassword('')
    setError('')
  }

  const handleDelete = async () => {
    if (!password) {
      setError('Introduce tu contraseña para confirmar.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await deleteAccount(password)
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="account-button"
        onClick={() => setOpen(true)}
        aria-label="Abrir cuenta"
        title="Cuenta"
      >
        <User size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <div className="account-overlay" onClick={close}>
          <div className="account-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Tu cuenta</h3>
            <p className="account-email">{user?.email}</p>

            {!confirmingDelete ? (
              <>
                <button type="button" className="auth-button auth-button-logout" onClick={logout}>
                  Cerrar sesión
                </button>
                <div className="account-modal-actions">
                  <button type="button" className="auth-link" onClick={close}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    Eliminar cuenta
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="account-warning">
                  Se borrarán tu cuenta y todos tus datos (registros, alimentos y objetivos).
                  Esta acción no se puede deshacer.
                </p>
                <label className="auth-label" htmlFor="delete-password">Contraseña</label>
                <input
                  id="delete-password"
                  className="auth-input"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="auth-message auth-error" role="alert">{error}</div>}
                <button
                  type="button"
                  className="auth-button auth-button-danger"
                  onClick={handleDelete}
                  disabled={busy}
                >
                  {busy ? 'Eliminando…' : 'Eliminar definitivamente'}
                </button>
                <button type="button" className="auth-link account-cancel" onClick={close} disabled={busy}>
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
