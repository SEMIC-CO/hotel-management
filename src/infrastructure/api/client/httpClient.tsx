const urlApi = import.meta.env.VITE_URL_API

export type HttpMethod = NonNullable<RequestInit['method']>

type ApiErrorKind = 'configuration' | 'http' | 'network' | 'invalid-response'

interface ApiErrorOptions {
  status?: number
  body?: unknown
  kind?: ApiErrorKind
  sourceError?: unknown
}

/** Error normalizado para que la UI pueda informar fallos de API y red. */
export class ApiError extends Error {
  readonly status?: number
  readonly body?: unknown
  readonly kind: ApiErrorKind
  readonly sourceError?: unknown

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.body = options.body
    this.kind = options.kind ?? 'http'
    this.sourceError = options.sourceError
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) return 'La sesión ha expirado.'
  if (status === 403) return 'No tiene permisos para realizar esta acción.'
  if (status === 404) return 'No se encontró la información solicitada.'
  if (status === 422) return 'Los datos enviados no son válidos.'
  if (status >= 500) return 'El servidor no pudo procesar la solicitud.'
  return 'No fue posible completar la solicitud.'
}

const getBodyMessage = (body: unknown, fallback: string) => {
  if (!isRecord(body)) return fallback

  const message = body.message ?? body.error
  return typeof message === 'string' && message.trim() !== ''
    ? message
    : fallback
}

/** Obtiene un mensaje seguro para mostrar al usuario. */
export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Ocurrió un error inesperado. Intente nuevamente.'
) => (error instanceof ApiError ? error.message : fallback)

/**
 * Lee el cuerpo una sola vez y convierte respuestas HTTP fallidas en ApiError.
 * Las respuestas vacías exitosas se conservan como undefined para no alterar el
 * contrato de endpoints que usan 204 No Content.
 */
export const readApiResponse = async <T,>(response: Response): Promise<T> => {
  const responseText = await response.text()
  
  let body: unknown

  if (responseText !== '') {
    try {
      body = JSON.parse(responseText) as unknown
    } catch {
      if (response.ok) {
        throw new ApiError('El servidor devolvió una respuesta inválida.', {
          status: response.status,
          kind: 'invalid-response'
        })
      }
    }
  }

  if (!response.ok) {
    throw new ApiError(
      getBodyMessage(body, getDefaultErrorMessage(response.status)),
      {
        status: response.status,
        body,
        kind: 'http'
      }
    )
  }

  return body as T
}

/** Ejecuta una solicitud JSON con la sesión enviada mediante cookies. */
export const requestHttp = async (
  endpoint: string,
  data: unknown,
  method: HttpMethod
): Promise<Response> => {
  if (!urlApi) {
    throw new ApiError('No está configurada la URL del servicio API.', {
      kind: 'configuration'
    })
  }

  const baseUrl = urlApi.replace(/\/+$/, '')
  const normalizedEndpoint = endpoint.replace(/^\/+/, '')
  const isBodyAllowed = method !== 'GET' && method !== 'HEAD'

  try {
    return await fetch(`${baseUrl}/${normalizedEndpoint}`, {
      method,
      headers: {
        'Content-type': 'application/json'
      },
      ...(isBodyAllowed ? { body: JSON.stringify(data) } : {}),
      credentials: 'include'
    })
  } catch (error) {
    throw new ApiError(
      'No fue posible conectar con el servidor. Verifique su conexión e intente nuevamente.',
      {
        kind: 'network',
        sourceError: error
      }
    )
  }
}

// Se conserva el nombre anterior para no romper los adaptadores existentes.
export const useFetch = requestHttp
