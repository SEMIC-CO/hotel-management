import type { IField } from '../types/forms'

export const getFieldInitialValue = (field: IField): unknown => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'hidden':
    case 'textArea':
    case 'search':
    case 'number':
    case 'radio':
      return ''
    case 'select':
    case 'date':
      return null
    case 'button':
      return null
    case 'group':
      return field.fields ? getInitialValuesFromFields(field.fields) : {}
    case 'section':
    default:
      return undefined
  }
}

export const getInitialValuesFromFields = (fields: IField[]): Record<string, unknown> => {
  const initialValues: Record<string, unknown> = {}
  fields.forEach((field) => {
    if (field.name) {
      initialValues[field.name] = getFieldInitialValue(field)
    }
    if (field.type === 'group' && field.fields) {
      const nested = getInitialValuesFromFields(field.fields)
      Object.assign(initialValues, nested)
    }
  })
  return initialValues
}

export const normalizeInitialValues = (
  fields: IField[],
  valuesForm: Record<string, unknown>
): Record<string, unknown> => {
  const defaults = getInitialValuesFromFields(fields)
  return { ...defaults, ...valuesForm }
}
