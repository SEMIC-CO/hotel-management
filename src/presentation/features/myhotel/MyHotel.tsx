import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'
import { InfoCenters } from './InfoCenters'
import { VerticalBar } from '../../components/ui/Charts/VerticalBar'
import { InfoRooms } from './InfoRooms'
import { useMyHotel } from './hooks/useMyHotel'

export const MyHotel = () => {

  const { dashboard } = useMyHotel()
  
  return (
    <div className='flex flex-wrap gap-2 card-dashbohard'>
      <div className='flex flex-wrap justify-between w-full'>
        <Card
          role='region'
          className='min-w-48 flex-1 shadow-md shadow-blue-400/90'
        >
          <div className='flex justify-between'>
            <div>
              <div className='p-0 w-fit'>
                <Avatar
                  className='bg-blue-100 text-blue-400'
                  icon='pi pi-clock'
                  size='large'
                />
              </div>
              <div>
                <h2 className='mt-2 font-bold text-md text-gray-500'>
                  PENDIENTES
                </h2>
                {/* <span>Hoy</span> */}
              </div>
            </div>
            <div>
              <h1 className='text-black'>15</h1>
            </div>
          </div>
        </Card>
        <Card
          role='region'
          className='min-w-48 flex-1 shadow-md shadow-blue-800/90'
        >
          <div className='flex justify-between'>
            <div>
              <div className='p-0 w-fit'>
                <Avatar
                  className='bg-blue-100 text-blue-800'
                  icon='pi pi-calendar'
                  size='large'
                />
              </div>
              <div>
                {/* <span>Hoy</span> */}
                <h2 className='mt-2 font-bold text-md text-gray-500'>
                  RESERVAS
                </h2>
              </div>
            </div>
            <div>
              <h1 className='text-black'>15</h1>
            </div>
          </div>
        </Card>
        <Card
          role='region'
          // className='w-64 p-0 bg-gradient-to-r from-blue-100 to-blue-500'
          className='min-w-48 flex-1 shadow-md shadow-green-600/90'
        >
          <div className='flex justify-between'>
            <div>
              <div className='p-0 w-fitgap-2'>
                <Avatar
                  className='bg-green-100 text-green-500'
                  icon='pi pi-sign-in'
                  size='large'
                />
              </div>
              <div>
                <h2 className='mt-2 font-bold text-md text-gray-500'>
                  INGRESOS
                </h2>
                {/* <span>Hoy</span> */}
              </div>
            </div>
            <div>
              <h1 className='text-black'>15</h1>
            </div>
          </div>
        </Card>
        <Card
          role='region'
          // className='w-64 p-0 bg-gradient-to-r from-blue-100 to-blue-500'
          className='min-w-48 flex-1 shadow-md shadow-red-500/90'
        >
          <div className='flex justify-between'>
            <div>
              <div className='p-0 w-fit'>
                <Avatar
                  className='bg-blue-100 text-red-500'
                  icon='pi pi-sign-out'gap-2
                  size='large'
                />
              </div>
              <div>
                <h2 className='mt-2 font-bold text-md text-gray-500'>
                  SALIDAS
                </h2>
                {/* <span>Hoy</span> */}
              </div>
            </div>
            <div>
              <h1 className='text-black'>15</h1>
            </div>
          </div>
        </Card>
        <Card
          role='region'
          // className='w-64 p-0 bg-gradient-to-r from-blue-100 to-blue-500'
          className='min-w-48 flex-1 shadow-md shadow-red-500/90'
        >
          <div className='flex justify-between'>
            <div>
              <div className='p-0 w-fit'>
                <Avatar
                  className='bg-blue-100 text-red-500'
                  icon='pi pi-sign-out'
                  size='large'
                />
              </div>
              <div>
                <h2 className='mt-2 font-bold text-md text-gray-500'>
                  CANCELADAS
                </h2>
              </div>
            </div>
            <div>
              <h1 className='text-black'>15</h1>
            </div>
          </div>
        </Card>
      </div>
      <InfoCenters centers={dashboard.centros} />
      <InfoRooms />
      <VerticalBar />
    </div>
  )
}
