import {useRef, useState} from 'react'
import {Stepper, type StepperRefAttributes} from 'primereact/stepper'
import {StepperPanel} from 'primereact/stepperpanel'
import {Button} from 'primereact/button'
import type { FormRef } from '../../../../core/shared/types/forms'
import {FormDataUser} from './FormDataUser'
import {FormDataBusiness} from './FormDataBusiness'
import {VerifyEmailOtp} from './VerifyEmailOtp'
import {VerifyPassword} from './VerifyPassword'
import {useNavigate} from 'react-router-dom'

export const SignUp = () => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const stepperRef = useRef<StepperRefAttributes>(null)
  const refFormBussines = useRef<FormRef>(null)
  const refFormUser = useRef<FormRef>(null)
  const refFormPass = useRef<FormRef>(null)
  const navigate = useNavigate()

  const onSubmitFormBussines = () => {
    if (refFormBussines.current != null) {
      refFormBussines.current?.submitForm()
    }
  }
  const onSubmitFormUser = () => {
    if (refFormUser.current != null) {
      refFormUser.current?.submitForm()
    }
  }
  const onSubmitFormVerify = () => {
    if (refFormPass.current != null) {
      refFormPass.current?.submitForm()
    }
  }

  return (
    <section className='flex justify-around'>
      <div className='w-1/2 border rounded-l-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-5 text-slate-200 content-center'>
        <h1>Iniciar sesión</h1>
        <p className='p-2'>Inicia sesión y disfruta de los demas benefecios</p>
        <Button
          className='button-login w-2/6 mt-5 bg-transparent border-slate-200'
          label='Iniciar sesion'
          size='small'
          onClick={() => navigate('login')}
        />
      </div>
      <div className='card flex justify-content-center w-3/6'>
        <Stepper ref={stepperRef}>
          <StepperPanel header='Usuario'>
            <div className='flex flex-column h-12rem'>
              <div className='flex-auto flex justify-content-center align-items-center'>
                <FormDataUser
                  ref={refFormUser}
                  stepperRef={stepperRef}
                />
              </div>
            </div>
            <div className='flex pt-4 justify-content-end'>
              <Button
                label='Siguiente'
                icon='pi pi-arrow-right'
                iconPos='right'
                onClick={onSubmitFormUser}
              />
            </div>
          </StepperPanel>
          <StepperPanel header='Negocio'>
            <div className='flex flex-column h-12rem'>
              <div className='flex-auto flex justify-content-center align-items-center font-medium'>
                <FormDataBusiness
                  ref={refFormBussines}
                  stepperRef={stepperRef}
                />
              </div>
            </div>
            <div className='flex pt-4 justify-between'>
              <Button
                label='Atras'
                severity='secondary'
                icon='pi pi-arrow-left'
                onClick={() => stepperRef.current?.prevCallback()}
              />
              <Button
                label='Siguiente'
                icon='pi pi-arrow-right'
                iconPos='right'
                // onClick={() => stepperRef.current.nextCallback()}
                onClick={onSubmitFormBussines}
              />
            </div>
          </StepperPanel>
          <StepperPanel header='Verificación'>
            <div className='flex flex-column h-12rem'>
              <div className='flex-auto flex justify-content-center align-items-center font-medium'>
                {/* <FormDataBusiness
                  ref={refFormBussines}
                  stepperRef={stepperRef}
                /> */}
                {disabled ? (
                  <VerifyEmailOtp setDisabled={setDisabled} />
                ) : (
                  <VerifyPassword ref={refFormPass} />
                )}
              </div>
            </div>
            <div className='flex pt-4 justify-between'>
              <Button
                label='Atras'
                severity='secondary'
                icon='pi pi-arrow-left'
                onClick={() => stepperRef.current?.prevCallback()}
              />
              <Button
                label='Finalizar'
                icon='pi pi-check'
                iconPos='right'
                disabled={disabled}
                onClick={onSubmitFormVerify}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </section>
  )
}
