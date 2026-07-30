import {ErrorMessage, Formik} from 'formik'
import {InputText} from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import type {
  FormRef,
  IFormDataBusinessProps,
  IOptionsSelect
} from '../../../../core/shared/types/forms'
import {useRegisterStore} from '../../../../infrastructure/stores/register.store'
import {Dropdown} from 'primereact/dropdown'
import {useContainer} from '../../../hooks/useContainer'

export const FormDataBusiness = React.forwardRef<
  FormRef,
  IFormDataBusinessProps
>(({ stepperRef }, ref) => {
  const updateState = useRegisterStore((state) => state.updateState)
  const valuesState = useRegisterStore((state) => state.values)
  const { authRepository } = useContainer()
  const { company } = valuesState

  const schema = Yup.object({
    company_name: Yup.string().required('Requerido'),
    nit: Yup.string().required('Requerido'),
    email: Yup.string().email('E-mail invalido').required('Requerido'),
    phone: Yup.string().required('Requerido'),
    country: Yup.object().shape({ code: Yup.number().required('Requerido') }),
    city: Yup.object().required('Requerido'),
    address: Yup.string().required('Requerido')
  })

  const [countries, setCountries] = useState<IOptionsSelect[]>([])
  const [cities, setCities] = useState<IOptionsSelect[]>([])

  useEffect(() => {
    let isMounted = true

    const loadLocations = async () => {
      try {
        const [countriesResponse, citiesResponse] = await Promise.all([
          authRepository.getCountries(),
          authRepository.getCities()
        ])

        if (!isMounted) return

        setCountries(countriesResponse.data ?? [])
        setCities(citiesResponse.data ?? [])
      } catch {
        if (isMounted) {
          setCountries([])
          setCities([])
        }
      }
    }

    void loadLocations()

    return () => {
      isMounted = false
    }
  }, [authRepository])

  return (
    <>
      <Formik
        initialValues={{
          company_name: company.company_name,
          nit: company.nit,
          email: company.email,
          phone: company.phone,
          country: company.country,
          city: company.city,
          address: company.address
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          updateState({ company: values })
          stepperRef.current?.nextCallback()
        }}
        innerRef={ref}
      >
        {({ handleChange, values, setFieldValue }) => (
          <section>
            <form>
              <div className='p-inputgroup flex-1 justify-between flex-wrap form-login'>
                <div className='flex flex-col text-left min-w-44 w-[45%]'>
                  <label
                    className='top-field-web'
                    htmlFor='company_name'
                  >
                    Nombre del hotel
                  </label>
                  <InputText
                    className='rounded-md w-[100%!important]'
                    id='company_name'
                    name='company_name'
                    onChange={handleChange}
                    value={values.company_name}
                  />
                  <ErrorMessage
                    name='company_name'
                    render={(msg) => <small className='p-error'>{msg}</small>}
                  />
                </div>
                <div className='flex flex-col text-left min-w-44 w-[45%]'>
                  <label htmlFor='nit'>Nit</label>
                  <InputText
                    className='rounded-md w-[100%!important]'
                    id='nit'
                    name='nit'
                    onChange={handleChange}
                    value={values.nit}
                  />
                  <ErrorMessage
                    name='nit'
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
                  <label htmlFor='phone'>No celular</label>
                  <InputText
                    className='rounded-md w-[100%!important]'
                    keyfilter='int'
                    id='phone'
                    name='phone'
                    onChange={handleChange}
                    value={values.phone}
                  />
                  <ErrorMessage
                    name='phone'
                    render={(msg) => <small className='p-error'>{msg}</small>}
                  />
                </div>
                <div className='flex flex-col text-left min-w-44 w-[45%]'>
                  <label htmlFor='country'>Pais</label>
                  <Dropdown
                    id='country'
                    name='country'
                    value={values.country}
                    onChange={(e) => setFieldValue('country', e.value)}
                    options={countries}
                    optionLabel='name'
                    placeholder='Seleccione'
                    className='w-full md:w-14rem'
                  />
                  <ErrorMessage
                    name='country'
                    render={(msg) => <small className='p-error'>{msg}</small>}
                  />
                </div>
                <div className='flex flex-col text-left min-w-44 w-[45%]'>
                  <label htmlFor='city'>Ciudad</label>
                  <Dropdown
                    id='city'
                    name='city'
                    value={values.city}
                    onChange={(e) => setFieldValue('city', e.value)}
                    options={cities}
                    optionLabel='name'
                    placeholder='Seleccione'
                    filter
                    className='w-full md:w-14rem'
                  />
                  <ErrorMessage
                    name='city'
                    render={(msg) => <small className='p-error'>{msg}</small>}
                  />
                </div>
                <div className='flex flex-col text-left min-w-44 w-[45%]'>
                  <label htmlFor='address'>Dirección</label>
                  <InputText
                    className='rounded-md w-[100%!important]'
                    keyfilter='int'
                    id='address'
                    name='address'
                    onChange={handleChange}
                    value={values.address}
                  />
                  <ErrorMessage
                    name='address'
                    render={(msg) => <small className='p-error'>{msg}</small>}
                  />
                </div>
              </div>
            </form>
          </section>
        )}
      </Formik>
    </>
  )
})
