# 📱 GUÍA COMPLETA: Publicar Control Nutrición Pro en App Store & Google Play

## PARTE 1: PREPARACIÓN (Antes de empezar)

### 1.1 Requisitos previos

**Para iOS:**
- Mac con macOS (mínimo Big Sur)
- Xcode instalado
- Cuenta de Developer Apple ($99/año)
- Certificados de desarrollo

**Para Android:**
- Android Studio instalado
- Keystore generado
- Cuenta de Google Play ($25 de una sola vez)

**Para ambos:**
- Capacitor instalado
- Node.js v14+
- Git

### 1.2 Crear cuenta de Developer

**Apple Developer Program:**
1. Ir a https://developer.apple.com/
2. Sign In o crear cuenta
3. Enroll → $99/año
4. Completar legal agreements
5. Esperar aprobación (1-3 días)

**Google Play Developer:**
1. Ir a https://play.google.com/console
2. Sign in con cuenta Google
3. Crear cuenta de desarrollador
4. Pagar $25 (de una sola vez)
5. Completar perfil

---

## PARTE 2: CONFIGURACIÓN DEL PROYECTO

### 2.1 Setup inicial de Capacitor

```bash
# En la carpeta del proyecto React
npm install @capacitor/core @capacitor/cli
npx cap init

# Preguntas:
# - App name: Control Nutrición Pro
# - App Package ID: com.nutricionpro.app
# - Web dir: build
```

### 2.2 Instalar plataformas

```bash
npx cap add ios
npx cap add android
```

### 2.3 Build del proyecto React

```bash
npm run build
```

---

## PARTE 3: PUBLICACIÓN EN iOS (App Store)

### 3.1 Crear certificados en Apple Developer

1. **Certificado de desarrollo:**
   - Ir a Certificates, Identifiers & Profiles
   - Seleccionar Certificates
   - Click en "+"
   - Seleccionar "Apple Development"
   - Descargar y instalar

2. **Crear App ID:**
   - Identifiers → "+"
   - Seleccionar "App ID"
   - Bundle ID: `com.nutricionpro.app`
   - Seleccionar capabilities necesarias
   - Register

3. **Crear Provisioning Profile:**
   - Profiles → "+"
   - Seleccionar "iOS App Development"
   - Seleccionar tu App ID
   - Seleccionar Certificate
   - Descargar

### 3.2 Configurar en Xcode

```bash
# Abrir proyecto en Xcode
npx cap open ios
```

En Xcode:
1. Select "Control Nutrición Pro" en el árbol
2. General → Bundle Identifier: `com.nutricionpro.app`
3. Signing & Capabilities:
   - Team: Tu cuenta Apple
   - Provisioning Profile: (automático)

### 3.3 Crear App en App Store Connect

1. Ir a https://appstoreconnect.apple.com
2. "My Apps" → "+"
3. "New App"
4. Información:
   - Platforms: iOS
   - Name: Control Nutrición Pro
   - Bundle ID: com.nutricionpro.app
   - SKU: controlnutricion2024
   - Access: Full Access

### 3.4 Completar información de la app

En App Store Connect:

**1. App Information:**
- Privacy Policy URL: (crea una en tu sitio web)
- Category: Health & Fitness
- Content rating: Completa el cuestionario

**2. Pricing and Availability:**
- Opción 1: Gratuita
- Opción 2: Pago ($2.99, $4.99, etc.)
- Opción 3: Freemium (compras in-app)
- Territories: Seleccionar dónde vender

**3. Version Information:**
- Version: 1.0.0
- Description:
  ```
  Control Nutrición Pro es tu asistente personal para rastrear 
  macronutrientes de forma fácil y eficiente.
  
  CARACTERÍSTICAS:
  - 87 alimentos incluidos
  - Dashboard en tiempo real
  - Historial detallado
  - Objetivos personalizables
  - Datos guardados localmente
  - Sin conexión requerida
  ```

**4. Keywords:**
```
nutrición, macros, fitness, dieta, calorías, proteína, app salud
```

**5. Support URL & Privacy Policy:**
- Crea una web con estos datos (puedes usar GitHub Pages o similar)

### 3.5 Screenshots y Preview

Necesitas 5 screenshots por cada dispositivo:
- iPhone 6.7" (ej: iPhone 14 Pro Max)
- iPad (si aplica)

**Cómo generar screenshots profesionales:**

Opción 1 (Manual):
1. En Xcode, run app en simulador
2. Cmd + S para screenshot
3. Crop y añade descripción

Opción 2 (Automático):
- Usar herramienta: AppMockUp, Previewed o Shots
- Upload templates + screenshots

**Texto sugerido para screenshots:**
1. "Controla tus macros en tiempo real"
2. "87 alimentos listos para usar"
3. "Objetivo personalizado"
4. "Historial detallado de consumo"
5. "Datos guardados localmente"

### 3.6 Icono de la app

Necesitas: 1024x1024 px, PNG, sin transparencia

Crear en:
- Canva (template gratuito)
- Figma
- Design AI

**Características recomendadas:**
- Emoji o icono relacionado con nutrición (🥗)
- Colores atractivos (gradiente)
- Legible a pequeño tamaño

### 3.7 Preparar para review

```bash
# En Xcode
Product → Scheme → Edit Scheme
Run → Release

# Build
Product → Build for Profiling
Product → Archive
```

En Xcode → Organizer:
1. Select archive
2. Distribute App
3. App Store Connect
4. Upload

### 3.8 Enviar a review

En App Store Connect:
1. Version → Build
2. Seleccionar build
3. Submit for Review
4. Completar formulario de review

**Preguntas comunes:**
- "Does your app use encryption?" → NO (si no sincroniza datos externos)
- "Export Compliance?" → NO
- "Advertising Identifier (IDFA)?" → NO

**Tiempo de review:** 1-3 días

---

## PARTE 4: PUBLICACIÓN EN ANDROID (Google Play)

### 4.1 Generar keystore (una sola vez)

```bash
# En terminal
keytool -genkey -v -keystore my-app.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key

# Preguntas:
# - Keystore password: (crear contraseña fuerte)
# - Key password: (misma o diferente)
# - First name: Tu nombre
# - Organization: Tu empresa/personal
```

**⚠️ IMPORTANTE:** Guarda `my-app.keystore` en lugar seguro. NUNCA lo subas a GitHub.

### 4.2 Configurar build para Android

En `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            keyAlias 'my-key'
            keyPassword 'TU_CONTRASEÑA'
            storeFile file('my-app.keystore')
            storePassword 'TU_CONTRASEÑA'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 4.3 Build Android

```bash
# Actualizar capacitor
npx cap sync android

# Abrir en Android Studio
npx cap open android
```

En Android Studio:
1. Build → Build Bundle(s) / APK(s) → Build Bundle(s)
2. Esto crea `app-release.aab`

### 4.4 Crear App en Google Play Console

1. Ir a https://play.google.com/console
2. "Create app"
3. Información:
   - App name: Control Nutrición Pro
   - Default language: Español o tu idioma
   - App type: Application
   - Category: Health & Fitness
   - Content rating: Complete questionnaire (IARC)

### 4.5 Completar información (igual que iOS)

En Google Play Console:

**1. App description:**
(Mismo texto que iOS)

**2. Screenshots:**
- Mínimo 2, máximo 8
- Tamaño: 1080x1920 px
- Mismo proceso que iOS

**3. Feature image:**
- Tamaño: 1024x500 px
- Portada atractiva de la app

**4. Icon:**
- 512x512 px
- PNG

**5. Content rating:**
- Completar IARC Questionnaire
- Típicamente: "Everyone" o "Everyone 10+"

### 4.6 Política de Privacidad

Crear documento privacy policy:

```
Política de Privacidad - Control Nutrición Pro

1. DATOS RECOPILADOS
- Datos de consumo de alimentos (guardados localmente en tu dispositivo)
- Datos de objetivos personales (guardados localmente)

2. ALMACENAMIENTO
- Todos los datos se guardan EN TU DISPOSITIVO
- NO se envían servidores externos
- NO compartimos con terceros

3. DERECHOS
- Puedes eliminar todos los datos en cualquier momento
- Solo accedes tú a tus datos

Fecha: 2024
```

Subir a GitHub Pages o tu sitio web.

### 4.7 Enviar a Google Play

1. Google Play Console → App releases
2. "Create new release"
3. Upload `app-release.aab`
4. Complete release notes
5. Review all content
6. "Submit release"

**Tiempo de review:** 2-4 horas (generalmente)

---

## PARTE 5: MONETIZACIÓN

### Opción A: APP DE PAGO (Recomendado para empezar)

**Precio recomendado:** $2.99 - $4.99

**Pros:**
- Ingresos garantizados
- Menos mantenimiento
- Usuarios comprometidos

**Contras:**
- Menos descargas
- Más difícil de encontrar

**Setup:**
1. App Store: Pricing → Seleccionar precio
2. Google Play: Pricing → Seleccionar precio

### Opción B: FREEMIUM (Premium features)

**Modelo:**
- App gratuita con función básica
- Compras in-app para:
  - Sincronización en nube (+$1.99/mes)
  - Análisis avanzados (+$2.99/mes)
  - Eliminación de ads (+$4.99/mes)

**Ingresos potenciales:** Mayor que de pago puro

**Setup más complejo:** Requiere backend

### Opción C: PUBLICIDAD + COMPRAS

**Menos recomendado** para apps de salud (usuarios lo odian)

---

## PARTE 6: ACTUALIZAR LA APP

### Después de publicada

```bash
# Hacer cambios en el código React

npm run build
npx cap sync

# Para iOS:
npx cap open ios
# En Xcode → Product → Archive → Upload

# Para Android:
npx cap open android
# En Android Studio → Build → Build Bundle(s)
# Subir nuevo AAB en Google Play Console
```

**Versioning:**
- v1.0.0 → v1.0.1 (bug fixes)
- v1.0.0 → v1.1.0 (features nuevas)
- v1.0.0 → v2.0.0 (cambios mayores)

---

## PARTE 7: CHECKLIST FINAL

### Antes de enviar a review:

```
iOS:
□ Icono 1024x1024
□ 5 screenshots por dispositivo
□ Descripción completa
□ Privacy Policy URL
□ Version 1.0.0
□ Certificados instalados
□ Build de prueba funciona

Android:
□ Icono 512x512
□ 2-8 screenshots
□ Feature image 1024x500
□ Descripción completa
□ Privacy Policy URL
□ AAB firmado correctamente
□ Version 1.0.0
```

---

## PARTE 8: DESPUÉS DE PUBLICAR

### Marketing & Promoción

1. **Website:**
   - Crear landing page
   - Incluir enlaces a App Store y Google Play

2. **Social Media:**
   - Anunciar en Instagram, TikTok, YouTube
   - Compartir tips de nutrición

3. **ASO (App Store Optimization):**
   - Keywords relevantes
   - Screenshots atractivos
   - Reviews positivas

4. **Email Marketing:**
   - Newsletter con tips
   - Actualizaciones de la app

---

## PARTE 9: SOPORTE Y MANTENIMIENTO

### Después de publicada

- Responder reviews (muy importante para rating)
- Arreglar bugs reportados
- Añadir features basado en feedback
- Mantener compatible con iOS/Android nuevos
- Actualizar privacidad si es necesario

---

## RECURSOS ÚTILES

### Documentación oficial:
- Apple Developer: https://developer.apple.com/
- Google Play Developer: https://play.google.com/console
- Capacitor Docs: https://capacitorjs.com/

### Herramientas útiles:
- AppMockUp: Generar screenshots
- Figma: Diseñar assets
- GitHub Pages: Hosting privacy policy gratis
- Firebase: Backend si necesitas sincronización

---

## ESTIMADO DE COSTOS

```
Desarrollo:
- Programación: Propio / €500-2000 contratado
- Design: €200-500

Publicación:
- Apple Developer: $99/año
- Google Play: $25 (una sola vez)
- Hosting website: Gratis (GitHub Pages)

TOTAL INICIAL: $125 + dev costs

Ingresos potenciales:
- A $2.99: 100 descargas = $300/mes (después comisión App Store 30%)
- Viralidad: 1,000 descargas = $3,000/mes
```

---

## ¿PREGUNTAS FRECUENTES?

**P: ¿Cuánto tardan en aprobar?**
R: iOS 1-3 días, Android 2-4 horas

**P: ¿Qué pasa si rechazan la app?**
R: Apple/Google envían razón. Arreglas y reenvías

**P: ¿Puedo hacer beta testing primero?**
R: Sí
- iOS: TestFlight
- Android: Google Play Internal Testing

**P: ¿Necesito backend?**
R: No para esta app (datos locales). Después si quieres sincronización.

**P: ¿Puedo cambiar el precio después?**
R: Sí en cualquier momento en ambas stores

---

¡Éxito con tu app! 🚀
