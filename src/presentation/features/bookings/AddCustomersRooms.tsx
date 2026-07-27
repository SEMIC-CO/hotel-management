import {useEffect, useState} from 'react'
import {Toast} from 'primereact/toast'
import {Dialog} from 'primereact/dialog'

import type { IField, IOptionsSelect, IShow } from '../../../core/shared/types/forms'
import {useCustomersStore} from '../../../infrastructure/stores/customers.store'
import {Form} from '../../components/ui/Forms/Form'
import {List} from '../../components/ui/DataTable/List'
import {buildCustomerFields, customerValidationSchema} from '../customers/configCustomerFieldsMode'
import type { IGuestsRooms, IReservation } from './AddRoomReservations'
import type { ICustomers } from '../../../core/shared/types/data'
import {useToast} from '../../hooks/useToast'
import {useContainer} from '../../hooks/useContainer'
import {Button} from 'primereact/button'

import {useUser} from '../../hooks/useUser'
import {createParamsUrl} from '../../../core/shared/utils/utils'
import Loading from '../../components/ui/UX/Loading'
import type { IColumns } from '../../../core/shared/types/datalist'
import type { FormikProps } from 'formik'

interface AddCustomersRoomsProps extends IShow {
  rooms: IOptionsSelect[]
  guestRoom: IGuestsRooms | null
  setData: React.Dispatch<React.SetStateAction<IReservation[]>>
  data: IReservation[]
  guestRoomsList: IGuestsRooms[]
}

export const AddCustomersRooms = ({
  showForm,
  setShowForm,
  rooms,
  guestRoom,
  setData,
  guestRoomsList
}: AddCustomersRoomsProps) => {
  const { toast, showToast } = useToast()
  const { customerRepository } = useContainer()
  const [customersRoom, setCustomersRoom] = useState<ICustomers[]>([])

  // const valuesStore = useCustomersStore((state) => state.values)
  const resetState = useCustomersStore((state) => state.resetState)
  const updateState = useCustomersStore((state) => state.updateState)

  const user = useUser()
  const [loading, setLoading] = useState(false)
  const [roomText, setRoomText] = useState<string>('')

  const close = () => {
    setShowForm(false)
  }

  useEffect(() => {
    if (guestRoomsList.length > 0) {
      setCustomersRoom(guestRoomsList)
    }
  }, [guestRoomsList])

  useEffect(() => {
    if (guestRoom) {
      updateState(guestRoom)
    }
  }, [guestRoom, updateState])


  const complete = () => {
    setData((prev) =>
      prev.map((reservation) => ({
        ...reservation,
        guests_rooms: customersRoom.filter(
          (customer) => customer.room_id === reservation.room
        )
      }))
    )
    setShowForm(false)
  }

  const addCustomer = (dataForm: any, form: FormikProps<any>) => {
    const roomSelected = dataForm.values.room
    dataForm.values.room_id = dataForm.values.room
    dataForm.values.room = roomText === '' ? guestRoom?.room_text : roomText


    if (dataForm.values.room_id == "") {
      showToast(
        'Se debe seleccionar la habitación a que va regitrado el huesped',
        'error'
      )
      return
    }
    if (
      customersRoom.find(
        (customer) =>
          customer.email === dataForm.values.email &&
          customer.no_document !== dataForm.values.no_document
      )
    ) {
      showToast(
        'El correo electrónico ya existe para otro cliente registrado en esta reserva',
        'error'
      )
      return
    }
    if (
      customersRoom.find(
        (customer) => customer.no_document === dataForm.values.no_document
      )
    ) {
      setCustomersRoom((prev) =>
        prev.map((customer) => {
          if (customer.no_document === dataForm.values.no_document) {
            return {
              ...customer,
              ...dataForm.values
            }
          }
          return customer
        })
      )
    } else {
      setCustomersRoom((prev) => {
        return prev.find(
          (customer) => customer.no_document === dataForm.values.no_document
        )
          ? prev
          : [...prev, dataForm.values]
      })
    }
    resetState()
    form?.resetForm()
    // form.setFieldValue('room', row.values.room)
    updateState({ room: roomSelected })
  }

  const deleteRow = (rowData: any) => {
    setCustomersRoom((prev) =>
      prev.length > 1
        ? prev.filter((data) => data.no_document !== rowData.no_document)
        : prev
    )
  }

  const editRow = (rowData: any) => {
    rowData.room = rowData.room_id
    updateState(rowData)
  }

  const onSearchCustomer = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target
    setLoading(true)
    const params = createParamsUrl({
      no_document: value,
      company_id: user.company_id
    })
    customerRepository.getCustomerSearch(params).then((resp) => {
      setLoading(false)
      const customer = resp ?? []
      if (customer.length > 0) {
        updateState({
          customer_id: customer[0].customer_id,
          no_document: customer[0].no_document,
          document_type: customer[0].document_type,
          names: customer[0].names,
          surnames: customer[0].surnames,
          cell_phone: customer[0].cell_phone,
          cell_phone_emergency: customer[0].cell_phone_emergency,
          birthdate: customer[0].birthdate
        })
      } else {
        updateState({
          customer_id: '',
          no_document: value,
          document_type: '',
          names: '',
          surnames: '',
          email: '',
          cell_phone: '',
          cell_phone_emergency: '',
          birthdate: ''
        })
      }
    })
  }

  const bodyTemplateActions = (rowData: any) => {
    return (
      <div className='flex gap-5 justify-content-center'>
        <i
          className='pi pi-pencil cursor-pointer'
          onClick={() => editRow(rowData)}
        />
        <i
          className='pi pi-trash cursor-pointer'
          onClick={() => deleteRow(rowData)}
        />
      </div>
    )
  }

  const validationSchema = customerValidationSchema
  const fieldsCustomer: IField[] = buildCustomerFields('not', ['no_document'])
  const fields: IField[] = [
    {
      label: 'Habitación',
      name: 'room',
      type: 'select',
      placeholder: 'Seleccione',
      options: rooms,
      onChangeFunc: (e: any) => setRoomText(e.value.name)

      // disabled: true
    },
    {
      label: 'No documento',
      placeholder: 'Buscar huesped',
      name: 'no_document',
      type: 'text',
      onBlur: onSearchCustomer,
      keyfilter: 'int'
    },
    ...fieldsCustomer
  ]

  const columns: IColumns[] = [
    {
      label: 'Acciones',
      name: 'actions',
      body: bodyTemplateActions
    },
    ...fields
  ]

  const headerElement = (
    <div className='inline-flex align-items-center justify-content-center gap-2 bor'>
      <span className='font-bold white-space-nowrap'>
        Registrar huéspedes en habitaciones
      </span>
    </div>
  )

  const footerForm = (
    <>
      <div className='text-center gap-5 flex justify-center'>
        <Toast ref={toast} />
        <Button
          type='submit'
          label='Agregar'
          icon='pi pi-plus'
          autoFocus
          // loading={loading}
        />
        <Button
          type='button'
          label='Terminar'
          icon='pi pi-check'
          autoFocus
          onClick={complete}
          // loading={loading}
        />
      </div>
    </>
  )

  return (
    <>
      <Dialog
        visible={showForm}
        modal
        header={headerElement}
        style={{ width: '60%' }}
        onHide={close}
      >
        {loading && <Loading />}
        <Toast ref={toast} />
        <Form
          width='100%'
          showForm={showForm}
          setShowForm={setShowForm}
          handleSave={addCustomer}
          title='Registrar huesped'
          fields={fields}
          validationSchema={validationSchema}
          useStoreForm={useCustomersStore}
          type='normal'
          footer={footerForm}
        />
        <List
          data={customersRoom}
          columns={columns}
          size='small'
        />
      </Dialog>
    </>
  )
}
