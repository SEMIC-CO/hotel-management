import {ErrorMessage, useField} from 'formik'
import type { IField } from '../../../core/shared/types/forms'
import {isInvalid} from '../../../core/shared/utils/utils'
import {useEffect, useState} from 'react'
import {RadioButton, type RadioButtonChangeEvent} from 'primereact/radiobutton'

export const OptionButton = ({ label, ...props }: IField) => {
  const [selectedRadio, setSelectedRadio] = useState<number | string>('')
  const fieldFormik = useField<any>(props)
  const meta = fieldFormik[1]
  const helpers = fieldFormik[2]
  const { setValue } = helpers

  useEffect(() => {
    setValue(selectedRadio)
    if (typeof props.value !== 'undefined') {
      setSelectedRadio(props.value)
    }
  }, [selectedRadio, props.value])

  const onChange = (e: RadioButtonChangeEvent) => {
    setSelectedRadio(e.value)
    if (typeof props.onSelect !== 'undefined') {
      props.onSelect(e.value)
    }
  }

  return (
    <>
      <div className='flex flex-col text-left align-items-center justify-center pt-5 w-auto'>
        <div className='flex gap-3'>
          {props.options?.map(({ id, label, value, name, required, onSelect }) => (
            <div
              key={id}
              className='flex align-items-center'
            >
              <RadioButton
                key={id}
                name={name}
                required={required}
                invalid={isInvalid(meta)}
                inputId={id}
                value={value}
                onChange={(e: RadioButtonChangeEvent) => onChange(e)}
                onSelect={onSelect}
                checked={selectedRadio === value}
                // {...props}
              />
              <label
                htmlFor={label}
                className='ml-2'
              >
                {label}
              </label>
            </div>
          ))}
          <ErrorMessage
            name={props.name}
            render={(msg) => <small className='p-error'>{msg}</small>}
          />
        </div>
      </div>
    </>
  )
}
