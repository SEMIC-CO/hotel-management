import {ErrorMessage, useField} from 'formik'
import {InputText} from 'primereact/inputtext'
import type { IField } from '../../../core/shared/types/forms'
import {isInvalid} from '../../../core/shared/utils/utils'
import {useEffect} from 'react'

export const TextField = ({ label, ...props }: IField) => {
  const [field, meta, helpers] = useField<any>(props)
  const { setValue } = helpers
  // console.log(props)
  // console.log(meta)
  // console.log(field)
  // console.log(helpers)
  // const style = props.style
  // delete props.style

  useEffect(() => {
    if (typeof props.value !== 'undefined') {
      setValue(props.value)
    }
  }, [props.value])
  
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
        />
        <ErrorMessage
          name={props.name}
          render={(msg) => <small className='p-error'>{msg}</small>}
        />
      </div>
    </>
  )
}
