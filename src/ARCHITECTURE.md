# Arquitectura src-v1

Esta carpeta contiene una reorganización del código fuente aplicando principios de **Arquitectura Limpia (Clean Architecture)** y **SOLID**.

> Nota: se copió todo el contenido de `src/` original y se reorganizó sin modificar las funcionalidades existentes.

## Estructura de capas

```
src-v1/
├── app/                    # Punto de entrada, rutas y providers
├── core/                   # Dominio y reglas de negocio
│   ├── di/                 # Contratos de inyección de dependencias
│   ├── domain/repositories # Interfaces de repositorios (abstracciones)
│   └── shared/             # Tipos, utilidades y constantes compartidas
├── infrastructure/         # Adaptadores externos (API, stores, auth, DI)
│   ├── api/                # Cliente HTTP, servicios y auth
│   ├── auth/               # Manejo de sesión
│   ├── di/                 # Container con implementaciones concretas
│   └── stores/             # Estado global (Zustand)
└── presentation/           # UI React
    ├── components/ui/      # Componentes reutilizables
    ├── features/           # Módulos de negocio
    ├── hooks/              # Hooks de presentación y aplicación
    ├── layout/             # Layouts (dashboard/web)
    ├── providers/          # Proveedores de tema
    └── styles/             # Estilos globales
```

## Principios aplicados

### 1. Separación de responsabilidades (SRP)
- Cada capa tiene una responsabilidad clara.
- Los componentes de UI solo se encargan de renderizar.
- Los servicios de API solo se encargan de comunicarse con el backend.
- Los stores solo gestionan el estado.

### 2. Inversión de dependencias (DIP)
- Se definieron interfaces de repositorios en `core/domain/repositories/`.
- Los servicios concretos en `infrastructure/api/services/` implementan dichas interfaces.
- Los componentes no dependen de implementaciones concretas, sino del `container` de dependencias.

### 3. Abierto/Cerrado (OCP)
- Es posible cambiar la fuente de datos (por ejemplo, de fetch a axios o a mocks) creando nuevas implementaciones de los repositorios sin modificar los componentes.

### 4. Container de dependencias
- `infrastructure/di/container.ts` centraliza las implementaciones.
- `presentation/hooks/useContainer.ts` expone el container a los componentes.

## Cómo usar el container

```tsx
import { useContainer } from '../../hooks/useContainer'

export const MiComponente = () => {
  const { settingsRepository, bookingRepository } = useContainer()
  // ...
}
```

## Verificación de tipos

Para verificar que TypeScript compila correctamente:

```bash
npx tsc -p tsconfig.v1.json --noEmit
```

## Próximos pasos recomendados

1. Migrar `useContainer` a un React Context o Provider si se requiere inyección más flexible.
2. Crear casos de uso en una capa `application/` para desacoplar aún más la lógica de negocio de los hooks.
3. Añadir tests unitarios para los casos de uso y repositorios.
