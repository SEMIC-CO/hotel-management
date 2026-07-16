import {ErrorMessage, useField} from 'formik'
import {InputTextarea} from 'primereact/inputtextarea'
import type { IField } from '../../../core/shared/types/forms'

export const TextArea = ({ label, ...props }: IField) => {
  const [field] = useField(props)

  return (
    <>
      <div className={`flex flex-col text-left gap-1  ${props?.style?.className}`}>
        <label
          className='text-sm'
          htmlFor={props.name}
        >
          {label}
        </label>
        <InputTextarea
          className='p-inputtext-sm'
          rows={3}
          cols={40}
          id={props.name}
          {...field}
          {...props}
        />
        <ErrorMessage
          name={props.name}
          render={(msg) => <small className='p-error'>{msg}</small>}
        />
      </div>
    </>
  )
}
