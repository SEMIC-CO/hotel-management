import * as Yup from 'yup'
import {DOCUMENT_TYPES} from '../../../core/shared/utils/constants'
import type { IField } from '../../../core/shared/types/forms'

export type CustomerFieldsMode = 'full' | 'in' | 'not'

export const customerValidationSchema = Yup.object({
  names: Yup.string().required('Requerido'),
  surnames: Yup.string().required('Requerido'),
  document_type: Yup.string().required('Requerido'),
  no_document: Yup.string().required('Requerido'),
  cell_phone: Yup.string().required('Requerido'),
  email: Yup.string().email('Email no válido').required('Requerido')
})

const baseCustomerFields: IField[] = [
  {
    label: 'No Documento',
    name: 'no_document',
    type: 'text',
    keyfilter: 'int'
  },
  {
    label: 'Tipo identificación',
    name: 'document_type',
    type: 'select',
    required: true,
    placeholder: 'Seleccione',
    options: DOCUMENT_TYPES
  },
  {
    label: 'Nombres',
    name: 'names',
    type: 'text',
    required: true
  },
  {
    label: 'Apellidos',
    name: 'surnames',
    type: 'text',
    required: true
  },
  {
    label: 'Fecha de nacimiento',
    name: 'birthdate',
    type: 'date',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'text',
    keyfilter: 'email',
    required: true
  },
  {
    label: 'Celular',
    name: 'cell_phone',
    type: 'text',
    keyfilter: 'int'
  },
  {
    label: 'Celular de emergencia',
    name: 'cell_phone_emergency',
    type: 'text',
    keyfilter: 'int'
  }
]

export const buildCustomerFields = (
  mode: CustomerFieldsMode = 'full',
  fields: string[] = []
): IField[] => {
  if (mode === 'not') {
    return baseCustomerFields.filter(
      (field) => !fields.includes(field.name)
    )
  }
  if (mode === 'in') {
    return baseCustomerFields.filter(
      (field) => fields.includes(field.name)
    )
  }

  return baseCustomerFields
}