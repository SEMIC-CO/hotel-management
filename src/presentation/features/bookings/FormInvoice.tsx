import {Toast} from 'primereact/toast'
import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import {useBookingStore} from '../../../infrastructure/stores/booking.store'
import {Dialog} from 'primereact/dialog'
import {List} from '../../components/ui/DataTable/List'
import {Button} from 'primereact/button'
import {RadioButton} from 'primereact/radiobutton'
import Loading from '../../components/ui/UX/Loading'
import {formatCurrency} from '../../../core/shared/utils/utils'
import {useInvoiceForm} from './hooks/useInvoiceForm'

export const FormInvoice = ({
  onActionForm: _onActionForm,
  showForm,
  setShowForm
}: IShow) => {
  const form = useInvoiceForm({ setShowForm })

  return (
    <>
      <Toast ref={form.toast} />
      {form.loading && <Loading />}
      <Dialog
        visible={showForm}
        modal
        header={'Facturar estadía'}
        style={{ width: '55%' }}
        onHide={form.close}
      >
        <div className='flex w-[98%]'>
          <div className='w-full border rounded-md p-2 w-3/5'>
            <div className='block mb-3'>
              <div className='mb-3'>
                <h3 className='text-title-large font-bold'>
                  Realizar factura a
                </h3>
              </div>
              <div className='flex flex-wrap gap-3'>
                <div className='flex align-items-center'>
                  <RadioButton
                    inputId='invoice-to1'
                    name='invoice-to'
                    value='Persona'
                    onChange={(e) => form.handleSelectInvoiceTo(e.value)}
                    checked={form.invoiceTo === 'Persona'}
                  />
                  <label
                    htmlFor='invoice-to1'
                    className='ml-2'
                  >
                    Persona
                  </label>
                </div>
                <div className='flex align-items-center'>
                  <RadioButton
                    inputId='invoice-to2'
                    name='invoice-to'
                    value='Empresa'
                    onChange={(e) => form.handleSelectInvoiceTo(e.value)}
                    checked={form.invoiceTo === 'Empresa'}
                  />
                  <label
                    htmlFor='invoice-to2'
                    className='ml-2'
                  >
                    Empresa
                  </label>
                </div>
              </div>
            </div>
            <Form
              width='100%'
              type='normal'
              handleSave={form.handleSave}
              fields={form.fields}
              validationSchema={form.validationSchema}
              useStoreForm={useBookingStore}
              footer={
                <section className=''>
                  <div>
                    <h3 className='text-title-large font-bold'>
                      Detalles de factura
                    </h3>
                    <List
                      data={form.rooms}
                      columns={form.columns}
                      size='small'
                    />
                    <div className='text-center pt-5'>
                      <Button
                        type='submit'
                        label='Facturar'
                        icon='pi pi-receipt'
                        autoFocus
                        loading={form.loading}
                      />
                    </div>
                  </div>
                </section>
              }
            />
          </div>
          <div className='w-2/5 border rounded-md p-3 ml-4'>
            <h3 className='text-title-large font-bold mb-6'>
              Detalles de pago
            </h3>
            <div className='space-y-4 mb-8'>
              <div className='flex justify-between text-sm text-on-surface-variant'>
                <span>Subtotal</span>
                <span className='font-medium text-on-surface'>
                  {formatCurrency(form.valuesInvoice.subtotal)}
                </span>
              </div>
              <div className='flex justify-between text-sm text-on-surface-variant'>
                <span>Impuestos (4%)</span>
                <span className='font-medium text-on-surface'>
                  {formatCurrency(form.valuesInvoice.taxes)}
                </span>
              </div>
              <div className='flex justify-between text-sm text-on-surface-variant'>
                <span>Otros servicios</span>
                <span className='font-medium text-on-surface font-bold'>
                  {formatCurrency(form.valuesInvoice.other_services)}
                </span>
              </div>
              <div className='pt-4 border-t border-outline-variant/20 flex justify-between items-end'>
                <div>
                  <p className='text-label-sm font-bold text-on-surface-variant uppercase tracking-widest'>
                    Total
                  </p>
                  <p className='text-display-small font-extrabold text-primary text-[--primary-color]'>
                    {formatCurrency(
                      form.valuesInvoice.subtotal +
                        form.valuesInvoice.taxes +
                        form.valuesInvoice.other_services
                    )}
                  </p>
                </div>
                <span className='px-3 py-1 text-red-600 text-label-sm font-bold rounded-full mb-1 uppercase'>
                  Pendiente
                </span>
              </div>
            </div>
            <div className='space-y-4'>
              <label className='block text-label-sm font-bold uppercase tracking-widest mb-2'>
                Payment Method
              </label>
              <div className='grid grid-cols-3 gap-2'>
                <label className='cursor-pointer'>
                  <input
                    className='hidden peer'
                    name='payment'
                    type='radio'
                    value='card'
                    onClick={() => form.setPaymentMethod('card')}
                  />
                  <div className='flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 peer-checked:border-primary peer-checked:bg-primary/5 transition-all grayscale opacity-60 peer-checked:grayscale-0 peer-checked:opacity-100 peer-checked:text-[--primary-color] peer-checked:border-[--primary-color]'>
                    <i
                      className='pi pi-credit-card'
                      style={{ fontSize: '2rem' }}
                    ></i>
                    <span className='text-[10px] font-bold uppercase'>
                      Tarjeta
                    </span>
                  </div>
                </label>
                <label className='cursor-pointer'>
                  <input
                    className='hidden peer'
                    name='payment'
                    type='radio'
                    value='bank'
                    onClick={() => form.setPaymentMethod('bank')}
                  />
                  <div className='flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 peer-checked:border-primary peer-checked:bg-primary/5 transition-all grayscale opacity-60 peer-checked:grayscale-0 peer-checked:opacity-100 peer-checked:text-[--primary-color] peer-checked:border-[--primary-color]'>
                    <i
                      className='pi pi-building-columns'
                      style={{ fontSize: '2rem' }}
                    ></i>
                    <span className='text-[10px] font-bold uppercase'>
                      Banco
                    </span>
                  </div>
                </label>
                <label className='cursor-pointer'>
                  <input
                    className='hidden peer'
                    name='payment'
                    type='radio'
                    value='cash'
                    onClick={() => form.setPaymentMethod('cash')}
                  />
                  <div className='flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 peer-checked:border-primary peer-checked:bg-primary/5 transition-all grayscale opacity-60 peer-checked:grayscale-0 peer-checked:opacity-100 peer-checked:text-[--primary-color] peer-checked:border-[--primary-color]'>
                    <i
                      className='pi pi-money-bill'
                      style={{ fontSize: '2rem' }}
                    ></i>
                    <span className='text-[10px] font-bold uppercase'>
                      Efectivo
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
