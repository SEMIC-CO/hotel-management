import {Form as FormFormik, Formik, type FormikHelpers} from 'formik'
import {Dialog} from 'primereact/dialog'
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

export interface IHandleSaveForm {
  dataForm: any
  form?: FormikHelpers<any>
}

export const Form = ({
  children,
  showForm,
  setShowForm,
  title,
  width = '50%',
  fields,
  handleSave,
  validationSchema,
  useStoreForm,
  classForm,
  type = 'dialog',
  labelButtonSubmit = 'Guardar',
  footer
}: FormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const toast = useRef(null)
  if (typeof classForm === 'undefined') {
    classForm = 'flex flex-wrap'
  }

  const valuesForm = useStoreForm((state: IStore) => state.values)
  const resetState = useStoreForm((state: IStore) => state.resetState)

  const close = () => {
    setLoading(false)
    setShowForm(false)
    resetState()
  }

  const headerElement = (
    <div className='inline-flex align-items-center justify-content-center gap-2 bor'>
      <span className='font-bold white-space-nowrap'>{title}</span>
    </div>
  )

  const { user } = useSessionStore((state) => state.values)

  const FooterContent = () => {
    return footer ? (
      footer
    ) : (
      <>
        <div className='text-center'>
          <Button
            type='submit'
            label={labelButtonSubmit}
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
            className={`card flex flex-wrap gap-3 justify-start mb-2 ${field.name}`}
          >
            <div className='w-full'>
              <h3 className='text-title-large font-bold'>{field.label}</h3>
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
            className={`card flex flex-wrap gap-3 justify-start mb-2 ${field.name}`}
          >
            <div className='w-full flex align-items-center justify-between'>
              <div>
                <h4 className='font-bold text-lg'>{field.label}</h4>
              </div>
              {field.addButtons ? field.addButtons() : null}
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

  console.log("valuesForm", normalizeInitialValues(fields ?? [], valuesForm as Record<string, unknown>))

  const getFormik = () => {
    return (
      <Formik
        initialValues={normalizeInitialValues(fields ?? [], valuesForm as Record<string, unknown>)}
        // initialValues={valuesForm}
        enableReinitialize
        onSubmit={(values, form) => {
          values.center_id = user.center_id
          values.created_by = user.user_id
          values.company_id = user.company_id
          handleSave({ values, setLoading }, form)
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
    )
  }

  return (
    <>
      <Toast ref={toast} />
      {}
      {type === 'normal' ? (
        getFormik()
      ) : (
        <Dialog
          visible={showForm}
          modal
          header={headerElement}
          style={{ width: width }}
          onHide={close}
        >
          {getFormik()}
        </Dialog>
      )}
    </>
  )
}
