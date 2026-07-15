# Vitta — Frontend (Expo Go)

App móvil de salud y monitoreo wearable, construida con Expo Router +
TypeScript, que consume exclusivamente la API Flask + MongoDB Atlas del
proyecto (sesiones por cookie, sin JWT, WebSockets con Flask-SocketIO,
Swagger).

## Identidad visual Vitta

- Paleta de marca: azul oscuro `#2F404F` (navegación y superficies
  principales), turquesa `#3894A1` (acciones y estados activos), blanco
  suave `#F0F1EE` y verde grisáceo `#C7DAD3` (tarjetas y superficies
  secundarias).
- Cada métrica biométrica conserva un color de identidad semántico
  (frecuencia cardíaca, SpO2, pasos, sueño, etc.) calibrado sobre la
  paleta de marca.
- Tarjetas redondeadas con sombra suave, anillos de progreso animados,
  tipografía con peso fuerte para los valores numéricos y transiciones
  suaves con `react-native-reanimated`.
- Logotipo Vitta (`components/ui/Logo.tsx`) reutilizado en Splash, Login,
  Registro y Dashboard, con variantes de color según el fondo
  (`assets/werable1.png` trazo oscuro, `werable2.png` a color, `werable3.png`
  trazo claro).

Toda la paleta y tokens están centralizados en `constants/theme.ts`.

## Arquitectura

```
app/            # Expo Router: pantallas y navegación (file-based)
components/     # UI reutilizable (ui/, metrics/, device/, charts/)
services/       # Cliente HTTP (cookies de sesión), Socket.IO, y wrappers por endpoint
hooks/          # React Query hooks (una query/mutation por caso de uso)
store/          # Zustand: solo estado visual/local (sesión en memoria, tema, UI efímera)
types/          # Tipos TypeScript de los payloads de la API
constants/      # Tema visual y configuración (endpoints, eventos socket)
utils/          # Formatters, validators, storage
```

**Todos los datos de usuarios, dispositivos y métricas se obtienen desde la
API.** Zustand solo guarda estado de navegación/sesión en memoria y
preferencias visuales; nada de datos de negocio se persiste localmente
excepto la configuración de red (IP/puerto del servidor).

## Sesiones por cookie (sin JWT)

React Native no maneja cookies como un navegador. `services/api.ts`
implementa un manejo manual: captura el header `Set-Cookie` de cada
respuesta y lo reenvía como `Cookie` en cada petición subsecuente. Esto
mantiene la sesión de Flask activa sin necesidad de JWT ni de librerías de
cookies nativas.

## Instalación

```bash
npm install
npx expo start
```

Escanea el QR con Expo Go (Android) o la app Cámara (iOS).

## Configurar la conexión al backend

Antes de iniciar sesión, ve a **Perfil → Configuración de red local** (o la
IP por defecto en `constants/config.ts`) e ingresa la IP local y el puerto
donde corre tu servidor Flask, por ejemplo `192.168.1.100:5000`. Ambos
dispositivos (teléfono y servidor) deben estar en la misma red Wi-Fi.

## Flujo de pantallas

Splash (`/`) → verifica `/auth/session` → Login/Registro → Selección de
dispositivo → (Smartwatch: QR + Socket.IO) o (Teléfono: `/device/connect`) →
Dashboard con tabs (Inicio, Historial, Estadísticas, Perfil).

## Notas de implementación pendientes al conectar con tu API real

- Ajusta las formas exactas de las respuestas en `types/` si tu API Flask
  usa nombres de campo distintos a `data.data.*`.
- El certificado/URL del QR (`GET /device/qr`) se asume como un payload de
  texto plano codificable directamente en el `QRCode`; ajústalo si tu API
  devuelve una URL de deep-link distinta.
- Los rangos usados para dibujar los anillos de progreso (meta de 10,000
  pasos, 8 horas de sueño, etc.) son valores de referencia visual — muévelos
  a la API si prefieres que sean dinámicos por usuario.
