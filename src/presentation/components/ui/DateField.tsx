import {useEffect, useState} from 'react'
import {Calendar} from 'primereact/calendar'
import {addLocale} from 'primereact/api'
import {ErrorMessage, useField, useFormikContext} from 'formik'
import {isInvalid} from '../../../core/shared/utils/utils'
import type { Nullable } from 'primereact/ts-helpers'
import dayjs from 'dayjs'

interface Props {
  label: string
  name: string
  format?: string
  locale?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  date?: Date
  showTime?: boolean
  onSetValue?: (e: any, form?: any) => void
  onCommitValue?: (e: any, form?: any) => void
}

export const DateField = ({ label, onSetValue, onCommitValue, ...props }: Props) => {
  const [date, setDate] = useState<Date | undefined>()
  const field = useField<any>(props)
  const meta = field[1]
  const helpers = field[2]
  const { setValue } = helpers
  const formik = useFormikContext()

  useEffect(() => {
    if (meta.touched) {
      setValue('')
      setDate(undefined)
    }
  }, [meta.error && meta.touched])

  useEffect(() => {
    if (typeof meta.value === 'undefined') return
    if (meta.value === '' || meta.value === null) {
      setDate(undefined)
      return
    }
    const parsed = dayjs(meta.value)
    if (parsed.isValid()) {
      setDate(parsed.toDate())
    }
  }, [meta.value])

  useEffect(() => {
    if (typeof props.date === 'undefined') return
    setDate(props.date)
    const dateFormat = dayjs(props.date).format('YYYY-MM-DD HH:mm:ss')
    setValue(dateFormat)
    if (typeof onSetValue === 'function') {
      onSetValue(dateFormat, formik)
    }
  }, [props.date])

  useEffect(() => {
    if (!meta.initialValue || meta.initialValue === '') return
    const parsed = dayjs(meta.initialValue)
    if (parsed.isValid()) {
      setDate(parsed.toDate())
    }
  }, [meta.initialValue])

  const handleFormatDate = (value: Nullable<string | Date | Date[]>) => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setDate(value)
      const dateFormat = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      setValue(dateFormat)
      if (typeof onSetValue === 'function') {
        onSetValue(dateFormat, formik)
      }
    }
  }

  const onHide = () => {
     if (!date) return

    const dateFormat = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    if (typeof onCommitValue === 'function') {
      onCommitValue(dateFormat, formik)
    }
  }

  addLocale('es', {
    firstDayOfWeek: 1,
    // showMonthAfterYear: true,
    dayNames: [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado'
    ],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ],
    monthNamesShort: [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic'
    ],
    today: 'Hoy',
    clear: 'Limpiar'
  })

  return (
    <div className='flex flex-col text-left w-[14rem] gap-1'>
      <label
        className='text-sm'
        htmlFor={props.name}
      >
        {label}
      </label>
      <Calendar
        className='datefield'
        value={date}
        onSelect={(e) => handleFormatDate(e.value)}
        hourFormat='24'
        // onChange={(e) => setDate(e.value)}
        // parseDateTime
        onHide={onHide}
        dateFormat='yy-mm-dd'
        locale='es'
        invalid={isInvalid(meta)}
        showIcon
        hideOnDateTimeSelect
        icon={() => <i className='pi pi-calendar' />}
        id={props.name}
        {...props}
      />
      <ErrorMessage
        name={props.name}
        render={(msg) => <small className='p-error'>{msg}</small>}
      />
    </div>
  )
}
