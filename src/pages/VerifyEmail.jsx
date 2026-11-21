import React, { useEffect, useState } from 'react'
import { useAuth, authErrorMessage } from '../context/AuthContext'
import '../styles/Auth.css'

export default function VerifyEmail() {
  const {
    user,
    logout,
    resendVerification,
    refreshVerification,
    verificationSendError
  } = useAuth()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [checking, setChecking] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const checkVerification = () => {
      refreshVerification().catch((err) => setError(authErrorMessage(err)))
    }
    const intervalId = window.setInterval(checkVerification, 5000)
    window.addEventListener('focus', checkVerification)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', checkVerification)
    }
  }, [refreshVerification])

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const timeoutId = window.setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => window.clearTimeout(timeoutId)
  }, [cooldown])

  const handleCheck = async () => {
    setError('')
    setInfo('')
    setChecking(true)
    try {
      const verified = await refreshVerification()
      if (!verified) {
        setError('Todavía no está verificado. Abre el enlace del correo y vuelve a intentarlo.')
      }
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setChecking(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setInfo('')
    try {
      await resendVerification()
      setInfo('Correo reenviado. Revisa también la carpeta de spam.')
      setCooldown(60)
    } catch (err) {
      setError(authErrorMessage(err))
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-title">Verifica tu correo</h1>
        <p className="auth-text">
          Hemos enviado un enlace de verificación a{' '}
          <span className="auth-email">{user?.email}</span>.
        </p>
        <p className="auth-text">
          Ábrelo y vuelve a la app. Continuará cuando se confirme tu correo. Si no lo ves,
          revisa la carpeta de spam.
        </p>

        {verificationSendError && (
          <div className="auth-message auth-error" role="alert">
            {verificationSendError}
          </div>
        )}
        {error && <div className="auth-message auth-error" role="alert">{error}</div>}
        {info && <div className="auth-message auth-info" role="status">{info}</div>}

        <button
          className="auth-button"
          type="button"
          onClick={handleCheck}
          disabled={checking}
        >
          {checking ? 'Comprobando…' : 'Ya lo he verificado'}
        </button>

        <div className="auth-links">
          <button
            type="button"
            className="auth-link"
            onClick={handleResend}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Reenviar correo (${cooldown}s)` : 'Reenviar correo'}
          </button>
          <button type="button" className="auth-link" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
