# AGENTS.md

Frontend SPA for a hotel management system. React 19 + TypeScript + Vite, pnpm-managed. Talks to a separate backend API via cookie-authenticated `fetch`.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`). Do not use npm/yarn.

```bash
pnpm install
pnpm dev        # vite dev server (HMR)
pnpm build      # tsc -b && vite build -> dist/
pnpm preview    # serve the production build
pnpm lint       # eslint . (flat config, no type-aware rules)
```

- `pnpm build` is the authoritative typecheck gate (`tsc -b` runs before `vite build`); there is no separate `typecheck` script.
- No test framework, formatter, or pre-commit hook is configured. Ignore the "tests"/"tsconfig.v1.json" mentions in `src/ARCHITECTURE.md` — they are stale.
- `pnpm watch` (the `watch` script) is broken: `tsc --watch && vite` never reaches `vite` because `tsc --watch` never exits. Use `pnpm dev` for development.

## Environment

- `.env` exposes `VITE_URL_API` (default `http://localhost:3000`); read via `import.meta.env.VITE_URL_API`. The UI assumes the backend is running there with cookie-based session auth (`credentials: 'include'`).
- `.env` is committed on purpose — do not add secrets to it.

## Architecture (Clean Architecture layout in `src/`)

Layers, from the outside in:

- `src/app/` — entrypoint and routing only. `main.tsx` mounts `<App/>`; `App.tsx` wraps `Routers` in `ThemeProvider`.
- `src/core/` — pure domain: `domain/repositories/*` interfaces (`IBookingRepository`, `IAuthRepository`, etc.), `di/Container.ts` (the `AppContainer` interface), `shared/types/*.d.ts` (global `.d.ts` type declarations, no runtime), and `shared/utils/` (constants/form/utils).
- `src/infrastructure/` — concrete adapters: `api/client/httpClient.tsx` (single `useFetch` helper used by every service), `api/services/*` (one class per repository, exported as a singleton instance), `api/auth/`, `auth/sessionManager.ts`, `stores/*` (Zustand stores), `di/container.ts` (wires services into `AppContainer`).
- `src/presentation/` — React UI: `features/<module>/` (each module owns its component + `hooks/use*`), `components/ui/`, `layout/`, `providers/`, `styles/index.css`.

### Dependency injection (important convention)

Components and hooks **must** get services through `useContainer()` from `presentation/hooks/useContainer.ts`, which returns the `AppContainer` wired in `infrastructure/di/container.ts`. Do not import service singletons directly in components — add new repositories by: (1) declaring an `IXxxRepository` in `core/domain/repositories/`, (2) exporting it from that folder's `index.ts`, (3) adding it to `AppContainer` in `core/di/Container.ts`, (4) implementing it under `infrastructure/api/services/` and registering the instance in `infrastructure/di/container.ts`.

### HTTP and session

- All backend calls go through `useFetch(endpoint, data, method)` in `infrastructure/api/client/httpClient.tsx`. It prepends `VITE_URL_API` and sends `credentials: 'include'`. There is no axios, no interceptors, no wrapper — just `fetch`.
- After every service call, await `validateSession(resp)` (`infrastructure/auth/sessionManager.ts`); on HTTP 401 it clears the session store and hard-redirects to `APP_ROUTES.LOGIN`. Keep this pattern in new services.
- Session state lives in `infrastructure/stores/session.store.ts` (Zustand). The `Routers` component bootstraps auth on mount via `authRepository.verifySession()` -> fall back to `refreshToken()`.
- To read the authenticated user inside `/app`, use `useUser()` from `presentation/hooks/useUser.ts` (returns a non-null `IUsers`); do not destructure `user` from the session store in every component.

### State

Global state is Zustand (`infrastructure/stores/*`). Each store is typed as `IStore<T>` from `core/shared/types/forms.d.ts` (`{ values: T, updateState(patch), resetState(next?) }`) and exports its values type (e.g. `BookingFormValues`). Feature/form state uses Formik + Yup; per-feature `hooks/use*Form.ts` bridge Formik with Zustand.

Formik's `initialValues` come from the store via `normalizeInitialValues(fields, valuesForm)` in `components/ui/Forms/Form.tsx` with `enableReinitialize`, so the store is the single source of truth for initial form values — do not add `useEffect` bridges that `setValue(props.value)` inside field components.

## Routing

`BrowserRouter` with two branches (see `src/app/routes/Routers.tsx`):

- `/web/*` — public, wrapped by `PublicRoutes` (renders `Login`).
- `/app/*` — protected, wrapped by `ProtectedRoutes`, which redirects to `/web` when `useSessionStore` is unauthenticated.

Both branches are mounted under one `BrowserRouter`; navigation between `/web` and `/app` is a client-side route change, not a full reload. Use the route/state constants in `core/shared/utils/constants.ts` (`APP_ROUTES`, `BOOKING_STATE`) instead of hardcoding `/web`, `/app` or reservation-state strings.

## Styling

Tailwind + PrimeReact coexist. CSS layering in `src/presentation/styles/index.css` (imports go through `src/app/main.tsx`): `@layer tailwind-base, primereact, tailwind-utilities` — PrimeReact sits between base and utilities, so utility classes can override PrimeReact. `tailwind.config.js` `content` includes `node_modules/primereact/**`; do not remove that or PrimeReact class usage will be purged. Dates use `dayjs` only (moment was removed; do not reintroduce it). Currency helpers live in `core/shared/utils/utils.ts` (`formatCurrency` / `parseCurrency`) — use them instead of writing local copies.

## TypeScript

- `tsconfig.json` references `tsconfig.app.json` (`src/`) and `tsconfig.node.json` (`vite.config.ts`). `tsBuildInfoFile` is under `node_modules/.tmp`.
- Strict-ish linting flags are on in `tsconfig.app.json`: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`, `"jsx": "react-jsx"`, bundler module resolution, `allowImportingTsExtensions`. Imports of types must use `import type`; imports with extensions (`.ts`/`.tsx`) are expected.
- `verbatimModuleSyntax` means mixing a type and a value in one `import` will fail — split into a value import and an `import type`.
- Vite uses `@vitejs/plugin-react` (Oxc) plus the **React Compiler** via `@rolldown/plugin-babel` with `reactCompilerPreset()` (see `vite.config.ts`). Memoization is largely handled by the compiler; avoid hand-writing `useMemo`/`useCallback` purely for perf unless profiling motivates it.

## ESLint

Flat config in `eslint.config.js`: `@eslint/js` recommended + `typescript-eslint` recommended (not type-checked) + `react-hooks` + `react-refresh`. `dist/` is globally ignored. There are currently no React-specific compiler rules (eslint-plugin-react-x/dom) despite the README suggesting them.

## Conventions worth keeping

- Comments and identifier strings in this repo are often Spanish; preserve the surrounding language when editing.
- Service files export both a singleton (`export const x = new XServices()`) and a default export — keep both.
- `core/shared/types/*.d.ts` use `declare`/ambient style declarations consumed across layers; put cross-layer shared types there rather than co-locating them with features.
- There is one shared form component: `presentation/components/ui/Forms/Form.tsx` (`type='dialog'` renders inside a PrimeReact `Dialog`, `type='normal'` inline). `FormHere.tsx` was removed — do not recreate a second form component.
- No `console.log` in committed code; leave `TODO:` comments for unimplemented behavior instead.