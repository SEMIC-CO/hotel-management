import { useRef } from 'react'
// import { useRouter } from 'next/router'
import { Toast } from 'primereact/toast'
import { useNavigate } from 'react-router-dom'
import { MegaMenu } from 'primereact/megamenu'

interface LayoutSidebarProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>
}
export function LayoutSidebar({ setTitle }: LayoutSidebarProps) {
  const toast = useRef<Toast>(null)
  const navigate = useNavigate()

  const items = [
    {
      label: 'My Hotel',
      icon: 'pi pi-building',
      className: location.pathname.includes('my-hotel') ? 'selected' : '',
      command: () => {
        navigate('my-hotel')
        setTitle('My Hotel')
      }
    },
    {
      label: 'Configuraciones',
      icon: 'pi pi-cog',
      items: [
        [
          {
            label: 'Hotel',
            items: [
              {
                label: 'Centros',
                command: () => {
                  navigate('centers')
                  setTitle('Centros')
                }
              },
              {
                label: 'Tipos de Habitación',
                command: () => {
                  navigate('type-room')
                  setTitle('Tipos de Habitación')
                }
              },
              {
                label: 'Cuentas bancarias',
                command: () => {
                  navigate('banks-accounts')
                  setTitle('Cuentas bancarias')
                }
              },
              {
                label: 'Crear consecutivos',
                command: () => {
                  navigate('sequences')
                  setTitle('Configurar consecutivos')
                }
              },
            ]
          }
        ],
        [
          {
            label: 'Usuarios',
            items: [
              {
                label: 'Perfiles',
                command: () => {
                  navigate('profiles')
                  setTitle('Perfiles')
                }
              },
              {
                label: 'Permisos por perfil',
                command: () => {
                  navigate('permissions')
                  setTitle('Permisos por perfil')
                }
              },
              {
                label: 'Usuarios',
                command: () => {
                  navigate('users')
                  setTitle('Usuarios')
                }
              }
            ]
          }
        ]
      ]
    },
    {
      label: 'Habitaciones',
      icon: 'pi pi-shop',
      className: location.pathname.includes('bedrooms') ? 'selected' : '',
      command: () => {
        navigate('bedrooms')
        setTitle('Habitaciones')
      }
    },
    {
      label: 'Huéspedes',
      icon: 'pi pi-users',
      className: location.pathname.includes('customers') ? 'selected' : '',
      command: () => {
        navigate('customers')
        setTitle('Huéspedes')
      }
    },
    {
      label: 'Reservas / Ingresos',
      icon: 'pi pi-calendar-plus',
      className: location.pathname.includes('bookings') ? 'selected' : '',
      command: () => {
        navigate('bookings')
        setTitle('Reservas')
      }
    },
    // {
    //   label: 'Entradas',
    //   icon: 'pi pi-sign-in',
    //   className: location.pathname.includes('entries') ? 'selected' : '',
    //   command: () => {
    //     navigate('entries')
    //     setTitle('Entradas')
    //   }
    // },
    {
      label: 'Gestor de Habitaciones',
      icon: 'pi pi-calendar',
      className: location.pathname.includes('rooms-manager') ? 'selected' : '',
      command: () => {
        navigate('rooms-manager')
        setTitle('Gestor de Habitaciones')
      }
    },
    {
      label: 'Calendario',
      icon: 'pi pi-calendar',
      className: location.pathname.includes('calendar') ? 'selected' : '',
      command: () => {
        navigate('calendar')
        setTitle('Calendario')
      }
    },
    {
      label: 'Facturación',
      icon: 'pi pi-book',
      className: location.pathname.includes('billing') ? 'selected' : '',
      command: () => {
        navigate('billing')
        setTitle('Facturación')
      }
    }
  ]

  return (
    <>
      <Toast ref={toast} />
      <MegaMenu
        model={items}
        className='border-none'
        orientation='vertical'
        breakpoint='960px'
      />
    </>
  )
}
