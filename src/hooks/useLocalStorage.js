import { useState, useEffect, useRef, useCallback } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

// Mismo nombre y misma forma de uso que antes: const [valor, setValor] = useLocalStorage('clave', inicial)
// Ahora los datos se guardan en Firestore: users/{uid}/data/{clave}
// y se sincronizan entre todos los dispositivos de la misma cuenta.

// Guarda qué cuenta ha "reclamado" los datos locales de este dispositivo.
// Así, si otra persona inicia sesión en este mismo móvil, no hereda tus datos.
const OWNER_KEY = 'nutrack_local_owner'

function readLocal(key) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}

export function useLocalStorage(key, initialValue) {
  const { user } = useAuth()
  const uid = user?.uid
  const [value, setValue] = useState(initialValue)
  const [ready, setReady] = useState(false)
  const valueRef = useRef(initialValue)

  useEffect(() => {
    if (!uid) return undefined

    setReady(false)
    const ref = doc(db, 'users', uid, 'data', key)

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          try {
            const parsed = JSON.parse(snap.data().json)
            valueRef.current = parsed
            setValue(parsed)
          } catch (e) {
            console.error(`Datos corruptos para "${key}"`, e)
          }
          setReady(true)
          return
        }

        // Si la respuesta viene solo de la caché, aún no sabemos si existe en el servidor
        if (snap.metadata.fromCache) return

        // No existe en la nube: primera vez de esta cuenta.
        // Si los datos locales de este dispositivo aún no los reclamó otra cuenta, se suben.
        const owner = window.localStorage.getItem(OWNER_KEY)
        if (!owner || owner === uid) {
          window.localStorage.setItem(OWNER_KEY, uid)
          const local = readLocal(key)
          if (local !== undefined) {
            valueRef.current = local
            setValue(local)
            setDoc(ref, { json: JSON.stringify(local), updatedAt: Date.now() }).catch((e) =>
              console.error(`Error migrando "${key}" a la nube`, e)
            )
          }
        }
        setReady(true)
      },
      (error) => console.error(`Error leyendo "${key}" de la nube`, error)
    )

    return unsubscribe
  }, [uid, key])

  const set = useCallback(
    (next) => {
      const resolved = typeof next === 'function' ? next(valueRef.current) : next
      valueRef.current = resolved
      setValue(resolved)

      if (!uid) return
      setDoc(doc(db, 'users', uid, 'data', key), {
        json: JSON.stringify(resolved),
        updatedAt: Date.now()
      }).catch((e) => console.error(`Error guardando "${key}"`, e))
    },
    [uid, key]
  )

  return [value, set, ready]
}
