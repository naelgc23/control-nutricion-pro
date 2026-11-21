import React, { useEffect, useState } from 'react'
import { useAuth, authErrorMessage } from '../context/AuthContext'
import '../styles/Auth.css'

const LAST_EMAIL_KEY = 'nutrack_last_email'

export default function Login() {
  const { login, register, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState(() => {
    try {
      return window.localStorage.getItem(LAST_EMAIL_KEY) || ''
    } catch (error) {
      console.error('No se pudo recuperar el último correo', error)
      return ''
    }
  })
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try {
      if (email.trim()) {
        window.localStorage.setItem(LAST_EMAIL_KEY, email)
      } else {
        window.localStorage.removeItem(LAST_EMAIL_KEY)
      }
    } catch (error) {
      console.error('No se pudo guardar el último correo', error)
    }
  }, [email])

  const changeMode = (next) => {
    setMode(next)
    setError('')
    setInfo('')
    setPassword('')
    setConfirm('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setError('Introduce tu correo.')
      return
    }
    if (mode !== 'reset' && !password) {
      setError('Introduce la contraseña.')
      return
    }
    if (mode === 'register' && password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'login') {
        await login(cleanEmail, password)
      } else if (mode === 'register') {
        await register(cleanEmail, password)
      } else {
        await resetPassword(cleanEmail)
        setInfo('Si existe una cuenta con ese correo, te hemos enviado un enlace para cambiar la contraseña.')
      }
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const titles = {
    login: 'Inicia sesión',
    register: 'Crea tu cuenta',
    reset: 'Recupera tu contraseña'
  }
  const buttons = {
    login: 'Entrar',
    register: 'Crear cuenta',
    reset: 'Enviar enlace'
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Nutrack</h1>
        <h2 className="auth-subtitle">{titles[mode]}</h2>

        <label className="auth-label" htmlFor="auth-email">Correo</label>
        <input
          id="auth-email"
          className="auth-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
        />

        {mode !== 'reset' && (
          <>
            <label className="auth-label" htmlFor="auth-password">Contraseña</label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </>
        )}

        {mode === 'register' && (
          <>
            <label className="auth-label" htmlFor="auth-confirm">Repite la contraseña</label>
            <input
              id="auth-confirm"
              className="auth-input"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </>
        )}

        {error && <div className="auth-message auth-error" role="alert">{error}</div>}
        {info && <div className="auth-message auth-info" role="status">{info}</div>}

        <button className="auth-button" type="submit" disabled={busy}>
          {busy ? 'Un momento…' : buttons[mode]}
        </button>

        <div className="auth-links">
          {mode === 'login' && (
            <>
              <button type="button" className="auth-link" onClick={() => changeMode('register')}>
                Crear una cuenta
              </button>
              <button type="button" className="auth-link" onClick={() => changeMode('reset')}>
                He olvidado la contraseña
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button type="button" className="auth-link" onClick={() => changeMode('login')}>
              Ya tengo cuenta
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
