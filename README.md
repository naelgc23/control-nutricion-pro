# 🥗 Control Nutrición Pro

Aplicación móvil para controlar macronutrientes de forma fácil y eficiente.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-lightgrey)

## 🌟 Características

- ✅ **87 alimentos incluidos** - Base de datos completa de alimentos españoles
- ✅ **Datos locales** - Todo guardado en tu dispositivo, sin conexión requerida
- ✅ **Dashboard en tiempo real** - Visualiza tu progreso diario
- ✅ **Historial detallado** - Analiza tus consumos por mes
- ✅ **Objetivos personalizables** - Adapta la app a tus metas
- ✅ **Responsive design** - Funciona perfecto en móvil y tablet
- ✅ **Sin suscripción** - Compra de una sola vez, sin costos recurrentes
- ✅ **Privacidad garantizada** - Tus datos son solo tuyos

## 📱 Plataformas soportadas

- iOS 13+
- Android 8+
- Web (como PWA)

## 🚀 Quick Start

### Requisitos previos

```bash
- Node.js v14 o superior
- npm o yarn
- Git (opcional)
```

### Instalación local

```bash
# 1. Clonar repositorio o descargar archivos
git clone https://github.com/tuusuario/control-nutricion-pro.git
cd control-nutricion-pro

# 2. Instalar dependencias
npm install

# 3. Copiar archivo de configuración
cp .env.example .env

# 4. Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# 5. Inicializar Capacitor (si no está hecho)
npx cap init

# 6. Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 🔧 Configuración por plataforma

### Para iOS

```bash
# Agregar plataforma iOS
npx cap add ios

# Build y sincronizar
npm run build
npx cap sync ios

# Abrir en Xcode
npx cap open ios
```

**Requisitos:**
- Mac con macOS Big Sur o superior
- Xcode instalado
- Cuenta de Developer Apple ($99/año)

Ver guía completa en `GUIA_PUBLICACION_APP_STORE.md`

### Para Android

```bash
# Agregar plataforma Android
npx cap add android

# Build y sincronizar
npm run build
npx cap sync android

# Abrir en Android Studio
npx cap open android
```

**Requisitos:**
- Android Studio instalado
- SDK Android
- Keystore configurado

Ver guía completa en `GUIA_PUBLICACION_APP_STORE.md`

---

## 📁 Estructura del proyecto

```
control-nutricion-pro/
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos globales
│   ├── index.html               # HTML base
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Registro.jsx
│   │   ├── Alimentos.jsx
│   │   ├── Objetivos.jsx
│   │   └── Historial.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js   # Persistencia de datos
│   └── styles/
│       ├── Dashboard.css
│       ├── Registro.css
│       ├── Alimentos.css
│       ├── Objetivos.css
│       └── Historial.css
├── public/
│   └── manifest.json            # PWA manifest
├── package.json
├── vite.config.js              # Configuración Vite
├── capacitor.config.json       # Configuración Capacitor
├── .env.example                # Variables de entorno
└── README.md
```

---

## 💻 Scripts disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor local (puerto 5173)

# Build
npm run build           # Compila para producción

# Capacitor
npm run sync            # Sincroniza con plataformas nativas
npx cap open ios        # Abre Xcode
npx cap open android    # Abre Android Studio

# Testing
npm run preview         # Previsualiza build de producción
```

---

## 🎯 Cómo usar la app

### 1️⃣ Dashboard
- Visualiza tu consumo diario
- Ve barras de progreso por macro
- Desglose de consumo por comida

### 2️⃣ Registrar Consumo
- Selecciona fecha, tipo de comida y alimento
- Escribe cantidad en gramos
- Ve automáticamente los macros
- Registra con un click

### 3️⃣ Base de Alimentos
- Busca entre 87 alimentos incluidos
- Agrega alimentos personalizados
- Elimina alimentos que no necesites

### 4️⃣ Mis Objetivos
- Personaliza tus metas diarias
- Fórmulas recomendadas por nivel de actividad
- Ajusta según tu progreso

### 5️⃣ Historial
- Analiza tus registros por mes
- Estadísticas promedio
- Detalles de cada día

---

## 📊 Datos y privacidad

### ¿Dónde se guardan mis datos?

**Localmente en tu dispositivo** - No tenemos servidores, no sincronizamos datos. Tú eres el único que accede a tu información.

### ¿Qué datos recolectamos?

**Ninguno** - La app funciona 100% offline. No enviamos datos a servidores.

### ¿Puedo eliminar mis datos?

**Sí** - Simplemente limpia la caché de la app o desinstálala. Todos tus datos se eliminan.

Para más info: Ver `POLITICA_PRIVACIDAD.md`

---

## 🐛 Reportar bugs

¿Encontraste un error? 

Abre un issue en GitHub:
1. Ve a GitHub → Issues
2. Click en "New Issue"
3. Describe el problema
4. Adjunta screenshots si es posible

**Información útil:**
- Tu SO (iOS/Android/Web)
- Versión de la app
- Pasos para reproducir

---

## 💡 Sugerencias y features

¿Ideas para nuevas funcionalidades?

Abre una Discussion en GitHub o envía un email a:
`soporte@controlnutricion.pro`

**Ideas populares:**
- Gráficas avanzadas (semana/mes)
- Sincronización con Apple Health
- Competencias con amigos
- Planes nutricionales

---

## 🛠️ Desarrollo avanzado

### Agregar nuevo alimento a la BD

En `App.jsx`, añade a la función `getDefaultFoods()`:

```javascript
{
  name: 'Mi alimento',
  kcal: 100,
  protein: 20,
  fats: 5,
  carbs: 10,
  fiber: 2
}
```

### Cambiar colores

En `App.css`, modifica las variables:

```css
:root {
  --primary: #667eea;        /* Color principal */
  --secondary: #764ba2;      /* Color secundario */
  --success: #48bb78;        /* Verde (éxito) */
  --danger: #f56565;         /* Rojo (peligro) */
}
```

### Agregar nuevas páginas

1. Crea componente en `src/pages/MiPagina.jsx`
2. Importa en `App.jsx`
3. Añade a tabs array
4. Crea estilos en `src/styles/MiPagina.css`

---

## 📈 Monetización

Esta app está diseñada como **producto de pago** ($2.99 - $4.99).

Alternativas de ingresos:
- 💰 App de pago única (Recomendado)
- 🎁 Freemium + compras in-app
- 📊 Premium con más features

Ver `ESTRATEGIA_MONETIZACION.md` para detalles.

---

## 🚀 Publicación

### Paso 1: Preparar

```bash
npm run build                    # Build final
npx cap sync                     # Sincronizar plataformas
```

### Paso 2: iOS

1. Abre Xcode: `npx cap open ios`
2. Configura team y certificados
3. Product → Archive
4. Distribuir en App Store Connect

Ver `GUIA_PUBLICACION_APP_STORE.md` sección iOS

### Paso 3: Android

1. Abre Android Studio: `npx cap open android`
2. Build → Build Bundle(s)
3. Sube AAB en Google Play Console

Ver `GUIA_PUBLICACION_APP_STORE.md` sección Android

---

## 📚 Recursos útiles

### Documentación oficial

- [React](https://react.dev)
- [Capacitor](https://capacitorjs.com)
- [Vite](https://vitejs.dev)

### Herramientas recomendadas

- [Figma](https://figma.com) - Diseño
- [GitHub](https://github.com) - Versionado
- [Sentry](https://sentry.io) - Error tracking (opcional)

### Guías en este proyecto

- `GUIA_PUBLICACION_APP_STORE.md` - Publicar en stores
- `ESTRATEGIA_MONETIZACION.md` - Modelos de ingresos
- `POLITICA_PRIVACIDAD.md` - Legal

---

## 📝 Licencia

MIT - Eres libre de usar, modificar y distribuir este código.

Ver `LICENSE` para detalles completos.

---

## 👥 Créditos

- **Desarrollo**: Creado con React + Capacitor
- **Datos**: 87 alimentos de fuentes españolas
- **Diseño**: UI/UX responsive mobile-first

---

## 💬 Soporte

¿Preguntas? 

📧 Email: `soporte@controlnutricion.pro`
🐛 GitHub Issues: [Reportar bug](../../issues/new)
💬 Discussions: [Hacer pregunta](../../discussions/new)

---

## 🎉 ¿Útil?

Si la app te ayuda, por favor:

⭐ Dale una estrella en GitHub
📱 Deja un review en App Store/Google Play
🤝 Comparte con tus amigos
💬 Da feedback en GitHub Issues

---

**¡Gracias por usar Control Nutrición Pro! 🥗**

Hecho con ❤️ para ayudarte a alcanzar tus objetivos nutricionales.

---

**Última actualización**: Agosto 2024
**Versión**: 1.0.0
