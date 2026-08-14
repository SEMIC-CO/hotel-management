import { Avatar } from 'primereact/avatar'
import { Menubar } from 'primereact/menubar'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { Menu } from 'primereact/menu'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../../../infrastructure/stores/session.store'
import { useUser } from '../../hooks/useUser'
import { useContainer } from '../../hooks/useContainer'
import { useToast } from '../../hooks/useToast'
import { APP_ROUTES } from '../../../core/shared/utils/constants'
import { getApiErrorMessage } from '../../../infrastructure/api/client/httpClient'
import logo from '../../assets/logo.png'

export const LayoutHead = () => {
  const navigate = useNavigate()
  const { resetState } = useSessionStore()
  const { authRepository } = useContainer()
  const { toast, showToast } = useToast()
  const user = useUser()

  const handleLogout = () => {
    authRepository
      .authLogout()
      .then(() => {
        resetState()
        navigate(APP_ROUTES.LOGIN)
      })
      .catch((error) => {
        showToast(
          getApiErrorMessage(error, 'No fue posible cerrar la sesión.'),
          'error'
        )
      })
  }

  const start = (
    <div className='flex items-center'>
      <figure>
        <img
          alt='logo'
          src={logo}
          className='mr-2 w-20 h-13 object-contain'
        />
      </figure>
      <div className='company-name'>
        <h2 className=''>Big Ben</h2>
      </div>
    </div>
  )

  const menuRight = useRef<any | null>(null)
  const menuItems = [
    {
      // label: 'Options',
      items: [
        {
          label: 'Mi cuenta',
          icon: 'pi pi-user',
          command: () => {
            navigate('my-account')
          }
        },
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-sign-out',
          command: () => {
            handleLogout()
          }
        }
      ]
    }
  ]

  const end = (
    <div className='w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround'>
      {/* <ThemeToggle />
      <Avatar
        className='p-overlay-badge bg-transparent'
        icon='pi pi-bell'
        size='normal'
      >
        <Badge
          value='4'
          className='badge-xs'
        />
      </Avatar>
      <Avatar
        className='ml-5 bg-transparent'
        icon='pi pi-cog'
        size='normal'
      /> */}
      <Menu
        className='text-sm'
        model={menuItems}
        popup
        ref={menuRight}
        id='popup_menu_right'
        popupAlignment='right'
      />
      <button
        onClick={(event) => menuRight.current?.toggle(event)}
        className='w-full p-link flex align-items-center pl-4 text-color hover:surface-200 border-noround'
      >
        <Avatar
          // image='https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
          label={user.names[0] + user.surnames[0]}
          style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
          className='mr-2'
          shape='circle'
          size='normal'
        />
        <div className='flex flex-col align text-sm'>
          <span className='font-bold'>{user.names}</span>
          <span className='text-sm'>{user.username}</span>
        </div>
        <i
          className='pi pi-angle-down'
          style={{ fontSize: '1.5rem' }}
        />
      </button>
    </div>
  )

  return (
    <>
      <Toast ref={toast} />
      {/* <header className='card mb-2 rounded fixed w-full z-10'> */}
      <header className='card mb-2 rounded'>
        {/* <Menubar model={items} start={start} end={end} /> */}
        <Menubar
          className='h-16'
          start={start}
          end={end}
        />
      </header>
    </>
  )
}
