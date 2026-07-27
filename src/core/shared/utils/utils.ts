export const isInvalid = (meta: any) => {
  if (
    typeof meta.touched !== 'undefined' &&
    typeof meta.error !== 'undefined'
  ) {
    return true
  }
  return false
}

export const createParamsUrl = (params: Record<string, string | number | boolean | undefined>) => {
  const urlParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value !== 'undefined') {
      urlParams.append(key, String(value))
    }
  })
  const query = urlParams.toString()
  return query ? '?' + query : ''
}

export const formatCurrency = (value: number) => {
  return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export const parseCurrency = (value: string): number => {
  if (!value) return 0
  const cleanValue = value.replace(/[$\s,]/g, '')
  const result = parseFloat(cleanValue)
  return isNaN(result) ? 0 : result
}