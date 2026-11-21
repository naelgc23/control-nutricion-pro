import { initializeApp } from 'firebase/app'
import { initializeAuth, getAuth, indexedDBLocalPersistence } from 'firebase/auth'
import { initializeFirestore, getFirestore, persistentLocalCache } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDxqFMP_QS9M8R77FHqcnoln1YZcayLhD8',
  authDomain: 'appnutrack.firebaseapp.com',
  projectId: 'appnutrack',
  storageBucket: 'appnutrack.firebasestorage.app',
  messagingSenderId: '69502119233',
  appId: '1:69502119233:web:ad5b9e357724c9998b85c0'
}

const app = initializeApp(firebaseConfig)

// Auth: persistencia en IndexedDB (la sesión sigue abierta al cerrar la app en iPhone/iPad).
// Si ya estaba inicializado (recarga en desarrollo), se reutiliza.
let auth
try {
  auth = initializeAuth(app, { persistence: indexedDBLocalPersistence })
} catch {
  auth = getAuth(app)
}

// Firestore: caché local para poder registrar comidas sin conexión;
// se sincroniza solo al recuperar internet.
let db
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
    experimentalAutoDetectLongPolling: true
  })
} catch {
  db = getFirestore(app)
}

export { app, auth, db }
