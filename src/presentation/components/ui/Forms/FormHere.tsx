import {Form as FormFormik, Formik} from 'formik'
import {useRef, useState} from 'react'
import '../../../styles/style.css'
import {Toast} from 'primereact/toast'
import {Button} from 'primereact/button'
import {TextField} from '../TextField'
import {DateField} from '../DateField'
import {SelectField} from '../SelectField'
import {TextNumber} from '../TextNumber'
import type { FormProps, IField, IStore } from '../../../../core/shared/types/forms'
import {TextArea} from '../TextArea'
import {SearchField} from '../SearchField'
import {OptionButton} from '../OptionButton'
import {useSessionStore} from '../../../../infrastructure/stores/session.store'
import { normalizeInitialValues } from '../../../../core/shared/utils/form'

export const FormHere = ({
  children,
  fields,
  handleSave,
  validationSchema,
  useStoreForm,
  classForm
}: FormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const toast = useRef(null)
  if (typeof classForm === 'undefined') {
    classForm = 'flex flex-wrap'
  }

  const valuesForm = useStoreForm((state: IStore) => state.values)
//   const resetState = useStoreForm((state: IStore) => state.resetState)

  const { user } = useSessionStore((state) => state.values)

  const FooterContent = () => {
    return (
      <>
        <div className='text-center'>
          <Button
            type='submit'
            label='Guardar'
            icon='pi pi-check'
            autoFocus
            loading={loading}
          />
        </div>
      </>
    )
  }

  const createFields = (field: IField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.name}
            {...field}
          />
        )
      case 'date':
        return (
          <DateField
            key={field.name}
            {...field}
          />
        )
      case 'select':
        return (
          <SelectField
            key={field.name}
            {...field}
          />
        )
      case 'search':
        return (
          <SearchField
            key={field.name}
            {...field}
          />
        )
      case 'number':
        return (
          <TextNumber
            key={field.name}
            {...field}
          />
        )
      case 'radio':
        return (
          <OptionButton
            key={field.name}
            {...field}
          />
        )
      case 'button':
        return (
          <Button
            key={field.name}
            label={field.label}
            severity={field.severity}
          />
        )
      case 'group':
        return (
          <div
            key={field.name}
            className={`card flex flex-wrap gap-3 justify-start mb-3 ${field.name}`}
          >
            <div className='w-full'>
              <h4 className='font-bold text-lg'>{field.label}</h4>
            </div>
            {field?.fields?.map((field: IField) => {
              return createFields(field)
            })}
          </div>
        )
      case 'section':
        return (
          <div
            key={field.name}
            className={`card flex flex-wrap gap-3 justify-start mb-3 ${field.name}`}
          >
            <div className='w-full'>
              <h4 className='font-bold text-lg'>{field.label}</h4>
            </div>
            {field.component ? field.component : ''}
          </div>
        )
      default:
        return (
          <TextArea
            key={field.name}
            {...field}
          />
        )
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <Formik
        initialValues={normalizeInitialValues(fields ?? [], valuesForm as Record<string, unknown>)}
        enableReinitialize
        onSubmit={(values) => {
          values.center_id = user.center_id
          values.created_by = user.user_id
          values.company_id = user.company_id
          handleSave({ values, setLoading })
        }}
        validationSchema={validationSchema}
      >
        {() => (
          <FormFormik noValidate>
            <div className={`card ${classForm} gap-3 mt-2 justify-start mb-5`}>
              {fields?.map((field) => {
                return createFields(field)
              })}
              {children}
            </div>
            <FooterContent />
          </FormFormik>
        )}
      </Formik>
    </>
  )
}
