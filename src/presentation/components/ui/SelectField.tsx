import {ErrorMessage, useField, useFormikContext} from 'formik'
import {Dropdown, type DropdownChangeEvent} from 'primereact/dropdown'
import {useEffect, useState} from 'react'
import type { IField, IOptionsRadio, IOptionsSelect } from '../../../core/shared/types/forms'
import {isInvalid} from '../../../core/shared/utils/utils'

export const SelectField = ({ label, ...props }: IField) => {
  const [select, setSelected] = useState<IOptionsSelect | IOptionsRadio>()
  const [{ onChange, ...field }, meta, helpers] = useField({ ...props })
  const form = useFormikContext()

  useEffect(() => {
    const options = props.options ?? []
    const isEmptyValue =
      field.value === '' || field.value === null || field.value === undefined
    const selectOption = isEmptyValue
      ? undefined
      : options.find((option) => option?.code === field.value)
    setSelected(selectOption)
    if (
      typeof props.onChangeFunc !== 'undefined' &&
      typeof selectOption !== 'undefined'
    ) {
      props.onChangeFunc({ value: selectOption })
    }
  }, [field.value])

  // console.log("SelectField field", field);
  // console.log("SelectField props", props);
  

  const { setValue } = helpers

  const setValueSelected = (e: DropdownChangeEvent) => {
    setValue(e.value.code)
    setSelected(e.value)
    if (typeof props.onChangeFunc !== 'undefined') {
      props.onChangeFunc(e, form)
    }
  }

  return (
    <div className='flex flex-col text-left w-52 gap-1'>
      <label
        className='text-sm'
        htmlFor={props.name}
      >
        {label}
      </label>
      <Dropdown
        invalid={isInvalid(meta)}
        onChange={(e: DropdownChangeEvent) => setValueSelected(e)}
        optionLabel='name'
        className='w-full md:w-14rem'
        size={20}
        value={select}
        filter={(props.options?.length ?? 0) > 10}
        placeholder={props.placeholder}
        name={props.name}
        required={props.required}
        options={props.options}
        disabled={props.disabled}
        // {...props}
      />
      <ErrorMessage
        name={props.name}
        render={(msg) => <small className='p-error'>{msg}</small>}
      />
    </div>
  )
}
