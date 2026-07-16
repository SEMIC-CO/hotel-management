import {ErrorMessage, Formik} from 'formik'
import {InputText} from 'primereact/inputtext'
import React from 'react'
import * as Yup from 'yup'
import type { FormRef, IFormDataBusinessProps } from '../../../../core/shared/types/forms'
import {useRegisterStore} from '../../../../infrastructure/stores/register.store'

export const FormDataUser = React.forwardRef<FormRef, IFormDataBusinessProps>(
  ({ stepperRef }, ref) => {
    const schema = Yup.object({
      names: Yup.string().required('Requerido'),
      surnames: Yup.string().required('Requerido'),
      email: Yup.string().email('E-mail invalido').required('Requerido'),
      cell_phone: Yup.string().required('Requerido')
    })

    const updateState = useRegisterStore((state) => state.updateState)
    const valuesState = useRegisterStore((state) => state.values)
    const { user } = valuesState

    return (
      <>
        <Formik
          initialValues={{
            names: user.names,
            surnames: user.surnames,
            email: user.email,
            cell_phone: user.cell_phone,
            address: user.address
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            valuesState.user = values
            updateState(valuesState)
            stepperRef.current.nextCallback()
          }}
          innerRef={ref}
        >
          {({ handleSubmit, handleChange, values }) => (
            <section>
              <form onSubmit={handleSubmit}>
                <div className='p-inputgroup flex-1 justify-between flex-wrap form-login'>
                  <div className='flex flex-col text-left min-w-44 w-[45%]'>
                    <label
                      className='top-field-web'
                      htmlFor='names'
                    >
                      Nombres
                    </label>
                    <InputText
                      className='rounded-md w-[100%!important]'
                      id='names'
                      name='names'
                      onChange={handleChange}
                      value={values.names}
                    />
                    <ErrorMessage
                      name='names'
                      render={(msg) => <small className='p-error'>{msg}</small>}
                    />
                  </div>
                  <div className='flex flex-col text-left min-w-44 w-[45%]'>
                    <label htmlFor='surnames'>Apellidos</label>
                    <InputText
                      className='rounded-md w-[100%!important]'
                      id='surnames'
                      name='surnames'
                      onChange={handleChange}
                      value={values.surnames}
                    />
                    <ErrorMessage
                      name='surnames'
                      render={(msg) => <small className='p-error'>{msg}</small>}
                    />
                  </div>
                  <div className='flex flex-col text-left min-w-44 w-[45%]'>
                    <label htmlFor='email'>E-mail</label>
                    <InputText
                      className='rounded-md w-[100%!important]'
                      keyfilter='email'
                      id='email'
                      name='email'
                      onChange={handleChange}
                      value={values.email}
                    />
                    <ErrorMessage
                      name='email'
                      render={(msg) => <small className='p-error'>{msg}</small>}
                    />
                  </div>
                  <div className='flex flex-col text-left min-w-44 w-[45%]'>
                    <label htmlFor='cell_phone'>No celular</label>
                    <InputText
                      className='rounded-md w-[100%!important]'
                      keyfilter='int'
                      id='cell_phone'
                      name='cell_phone'
                      onChange={handleChange}
                      value={values.cell_phone}
                    />
                    <ErrorMessage
                      name='cell_phone'
                      render={(msg) => <small className='p-error'>{msg}</small>}
                    />
                  </div>
                  <div className='flex flex-col text-left min-w-44 w-full'>
                    <label htmlFor='address'>Dirección</label>
                    <InputText
                      className='rounded-md w-[100%!important]'
                      id='address'
                      name='address'
                      onChange={handleChange}
                      value={values.address}
                    />
                  </div>
                </div>
              </form>
            </section>
          )}
        </Formik>
      </>
    )
  }
)
