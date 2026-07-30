import { validateSession } from '../../auth/sessionManager'
import {
  readApiResponse,
  requestHttp,
  type HttpMethod
} from './httpClient'

/**
 * Punto común para los servicios autenticados: valida la sesión y transforma
 * respuestas HTTP fallidas en errores manejables por la interfaz.
 */
export const requestApi = async <TResponse, TData = unknown>(
  endpoint: string,
  data: TData,
  method: HttpMethod
): Promise<TResponse> => {
  const response = await requestHttp(endpoint, data, method)

  await validateSession(response)

  return readApiResponse<TResponse>(response)
}