import {ErrorMessage, useField} from 'formik'
import {useEffect, useState} from 'react'
import type { IField, ISearch } from '../../../core/shared/types/forms'
import {isInvalid} from '../../../core/shared/utils/utils'
import {AutoComplete, type AutoCompleteChangeEvent, type AutoCompleteCompleteEvent} from 'primereact/autocomplete'

export const SearchField = ({ label, ...props }: IField) => {
  const [select, setSelected] = useState<ISearch>()
  const [filteredCountries, setFilteredCountries] = useState<ISearch[]>()

  const [{ onChange, ...field }, meta, helpers] = useField({ ...props })
  const { setValue } = helpers
  const filter = typeof props.filter !== 'undefined' ? props.filter : 'name'
  useEffect(() => {
    const items = props.items ?? []
    console.log(props)
    // const filterVal = items.find((item) => item.name === field.value)
    const filterVal = items.find((item) => item[filter] === field.value)
    setSelected(filterVal)
    setValue(filterVal?.code)
    // console.log(filterVal)
    // console.log(field)
  }, [])

  const setValueSelected = (e: AutoCompleteChangeEvent) => {
    setValue(e.value.code)
    setSelected(e.value)
  }

  const search = (event: AutoCompleteCompleteEvent) => {
    const items = props.items ?? []
    setTimeout(() => {
      let _filteredCountries
      if (event.query.trim().length === 0) {
        _filteredCountries = [...items]
      } else {
        _filteredCountries = items.filter((item) => {
          return item[filter]
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        })
      }
      // console.log(_filteredCountries)
      setFilteredCountries(_filteredCountries)
    }, 250)
  }

  const onChangeSearch = (e: AutoCompleteChangeEvent) => {
    console.log('onChange')

    setValueSelected(e)
  }

  return (
    <div className='flex flex-col text-left w-48'>
      <label
        className='text-sm'
        htmlFor={props.name}
      >
        {label}
      </label>
      <AutoComplete
        // className='p-inputtext-sm w-48'
        field={filter}
        invalid={isInvalid(meta)}
        value={select}
        suggestions={filteredCountries}
        completeMethod={search}
        onChange={(e: AutoCompleteChangeEvent) => onChangeSearch(e)}
        {...props}
        name={field.name}
      />

      <ErrorMessage
        name={props.name}
        render={(msg) => <small className='p-error'>{msg}</small>}
      />
    </div>
  )
}
