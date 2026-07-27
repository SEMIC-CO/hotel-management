import {ErrorMessage, useField, useFormikContext} from 'formik'
import {InputText} from 'primereact/inputtext'
import type { IField } from '../../../core/shared/types/forms'
import {isInvalid} from '../../../core/shared/utils/utils'

export const TextField = ({ label, ...props }: IField) => {
  const [field, meta] = useField<any>(props)
  const formik = useFormikContext()

  const hidden = props.hidden == true ? 'hidden' : ''
  const width = props.width || 'w-48'
  return (
    <>
      <div
        className={`flex flex-col gap-1 mb-0 ${width} ${hidden}`}
        style={props.style}
      >
        <label
          className='text-sm'
          htmlFor={props.name}
        >
          {label}
        </label>
        <InputText
          className='p-inputtext-sm'
          invalid={isInvalid(meta)}
          id={props.name}
          {...field}
          {...props}
          onBlur={(e) => {
            field.onBlur(e)
            props.onBlur?.(e, formik)
          }}
        />
        <ErrorMessage
          name={props.name}
          render={(msg) => <small className='p-error'>{msg}</small>}
        />
      </div>
    </>
  )
}
