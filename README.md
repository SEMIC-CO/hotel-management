# Hotel Management

SPA para la gestión hotelera construida con React, TypeScript y Vite. Se conecta a una API independiente mediante cookies de sesión.

## Stack

- React 19 + TypeScript
- Vite
- Zustand para estado global
- Formik + Yup para formularios y validación
- PrimeReact + Tailwind CSS para la interfaz
- Day.js para fechas

## Requisitos

- Node.js compatible con las dependencias del proyecto
- pnpm
- API de backend disponible localmente o configurada mediante variables de entorno

## Configuración

El proyecto lee la URL de la API desde `.env`:

```env
VITE_URL_API='http://localhost:3000'
```

No agregue secretos de producción a este archivo. La autenticación usa cookies, por lo que el backend debe permitir el origen del frontend y configurar sus cookies de forma segura.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

`pnpm build` ejecuta primero la comprobación de TypeScript y después genera la compilación de producción. Para desarrollo use `pnpm dev`; el script `watch` no se recomienda porque no llega a iniciar Vite.

## Arquitectura

El código fuente sigue una separación por capas:

```text
src/
├── app/             # Punto de entrada, providers y rutas
├── core/            # Contratos de repositorios, tipos y utilidades compartidas
├── infrastructure/  # API HTTP, adaptadores, stores de Zustand y DI
└── presentation/    # Componentes React, features, formularios y layouts
```

Los componentes acceden a los repositorios a través de `useContainer()`. Las implementaciones concretas se registran en `src/infrastructure/di/container.ts`.

### API y sesión

- Las solicitudes pasan por `requestHttp()` y conservan `credentials: 'include'`.
- Todos los endpoints usan validación de sesión ante respuestas 401 y normalizan errores de red, servidor o respuestas inválidas como `ApiError`.
- Las respuestas HTTP no exitosas se propagan al consumidor para mostrar un mensaje útil, en lugar de convertirse silenciosamente en `undefined`.
- La verificación y renovación de sesión se mantienen separadas para permitir el flujo de `verifySession()` seguido de `refreshToken()`.

La protección CSRF debe configurarse y validarse en el backend según la política de cookies usada en despliegue.

## Calidad

Actualmente no hay framework de pruebas configurado. Antes de desplegar cambios, ejecute al menos:

```bash
pnpm lint
pnpm build
```

Como siguiente paso recomendado, incorpore pruebas unitarias para utilidades, repositorios y flujos críticos de reservas, anticipos y facturación, además de una pipeline de integración continua que ejecute las validaciones anteriores.

## Más información

Consulte [src/ARCHITECTURE.md](src/ARCHITECTURE.md) para detalles de las capas y las convenciones de inyección de dependencias.
