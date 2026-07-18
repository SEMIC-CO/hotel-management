export const isInvalid = (meta: any) => {
  if (
    typeof meta.touched !== 'undefined' &&
    typeof meta.error !== 'undefined'
  ) {
    return true
  }
  return false
}

// export const createParamsUrl = (params: object) => {
//   const urlParams = new URLSearchParams([
//     ...Object.entries(params)
//   ]).toString()
//   return '?' + urlParams
// }


export const createParamsUrl = (params: object) => {
  const urlParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return '?' + urlParams
}

export const formatCurrency = (value: number) => {
  return `$${Intl.NumberFormat().format(value)}`
  // return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export const parseCurrency = (value: string): number => {
  if (!value) return 0;

  let cleanValue = value.replace(/[$\s]/g, '');
  cleanValue = cleanValue.replace(/\./g, '');
  cleanValue = cleanValue.replace(',', '');
  
  const result = parseFloat(cleanValue);

  return isNaN(result) ? 0 : result;
};