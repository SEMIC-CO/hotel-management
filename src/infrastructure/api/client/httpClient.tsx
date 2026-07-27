const urlApi = import.meta.env.VITE_URL_API

export const useFetch = (
  endpoint: string,
  data: { [key: string]: any } | any[],
  method: string
) => {
  const url = `${urlApi}/${endpoint}`

  if (method === 'GET') {
    const resp = fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json'
      },
      credentials: 'include'
    })
    
    return resp
  } else {
    const resp = fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return resp
  }
}
