import { useSessionStore } from '../stores/session.store'


export  const validateSession = async(resp: Response) => {
  console.log('validateSession')
  if (resp.status === 401) {
    console.log('Cerrar sesion')
    await clearSession()
  }
}

export async function clearSession() {
  useSessionStore.getState().resetState()
  window.location.href = '/web/login'
}
