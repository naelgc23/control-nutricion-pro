import React from 'react'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import '../styles/Auth.css'

export default function AuthGate({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        <div className="auth-loading-logo" aria-hidden="true">
          <img className="auth-loading-logo-image" src="/nutrack-mark.png" alt="" />
          <svg className="auth-loading-letter" viewBox="0 0 768 768" focusable="false">
            <rect x="250" y="245" width="268" height="275" fill="#000" />
            <path
              d="M300 470V300L470 470V300"
              fill="none"
              stroke="#fff"
              strokeWidth="54"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="auth-loading-name">Nutrack</span>
        <span className="auth-loading-label">Cargando tu espacio…</span>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return children
}
