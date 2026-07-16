import {
  InputNumber
  // InputNumberValueChangeEvent
} from 'primereact/inputnumber'
import { ErrorMessage, useField } from 'formik'
import { isInvalid } from '../../../core/shared/utils/utils'
import { useEffect } from 'react'

interface Props {
  label: string
  name: string
  type?: string
  placeholder?: string
  [x: string]: any
}

export const TextNumber = ({ label, type, ...props }: Props) => {
  const [{ onChange, ...field }, meta, helpers] = useField({ ...props })
  // const { value, error } = meta
  const { setValue } = helpers

  // console.log(field)
  // console.log(meta)

  useEffect(() => {
    if (typeof props.value !== 'undefined') {
      setValue(props.value)
    } else if (typeof meta.initialValue !== 'undefined') {
      setValue(meta.initialValue)
    }
  }, [props.value, meta.initialValue])

  const desformatValue = (value: any) => {
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'string') {
      const desformatted = value.replace(/[^0-9.-]+/g, '')
      const parsed = parseFloat(desformatted)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  return (
    <>
      <div className='flex flex-col text-left w-48 gap-1'>
        <label
          className='text-sm'
          htmlFor='number-input'
        >
          {label}
        </label>
        <InputNumber
          inputId={props.name}
          invalid={isInvalid(meta)}
          // readOnly={false}
          onInput={(e: any) => {
            setValue(desformatValue(e.target.value))
          }}
          size={15}
          mode='currency'
          currency='USD'
          locale='en-US'
          onChange={(e) => {
            setValue(e.value)
          }}
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
