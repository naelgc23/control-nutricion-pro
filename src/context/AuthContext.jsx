import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth'
import { collection, getDocs, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

// Traduce los códigos de error de Firebase a mensajes claros
export function authErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'El correo no es válido.'
    case 'auth/missing-password':
      return 'Introduce la contraseña.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.'
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo. Inicia sesión.'
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos y vuelve a probar.'
    case 'auth/network-request-failed':
      return 'Sin conexión. Comprueba tu internet e inténtalo de nuevo.'
    case 'auth/requires-recent-login':
      return 'Por seguridad, cierra sesión, vuelve a entrar y repite la operación.'
    default:
      return 'Ha ocurrido un error. Inténtalo de nuevo.'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  // Apple exige poder eliminar la cuenta desde la app.
  // Pide la contraseña, borra los datos de la nube y después la cuenta.
  const deleteAccount = async (password) => {
    const current = auth.currentUser
    if (!current) return

    const credential = EmailAuthProvider.credential(current.email, password)
    await reauthenticateWithCredential(current, credential)

    // Primero los datos (después de borrar la cuenta ya no habría permiso)
    const snapshot = await getDocs(collection(db, 'users', current.uid, 'data'))
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)))

    await deleteUser(current)

    // Limpia también la copia local que quedó en este dispositivo
    try {
      window.localStorage.clear()
    } catch (e) {
      console.error('No se pudo limpiar el almacenamiento local', e)
    }
  }

  const value = { user, loading, register, login, logout, resetPassword, deleteAccount }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}
