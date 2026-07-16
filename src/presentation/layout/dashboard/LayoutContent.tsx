import { Navigate, Route, Routes } from 'react-router-dom'
import { Bookings } from '../../features/bookings/Bookings'
import { Bedrooms } from '../../features/bedrooms/Bedrooms'
import { Customers } from '../../features/customers/Customers'
import { Entries } from '../../features/entries/Entries'
import { Centers } from '../../features/settings/Centers/Centers'
import { Users } from '../../features/settings/Users/Users'
import { TypeRoom } from '../../features/settings/TypeRoom/TypeRoom'
import { Profiles } from '../../features/settings/Profiles/Profiles'
import { BanksAccount } from '../../features/settings/BanksAccount/BanksAccount'
import { MyAccount } from '../../features/myaccount/MyAccount'
import { MyHotel } from '../../features/myhotel/MyHotel'
import { MyCalendar } from '../../features/calendar/MyCalendar'
import { RoomsCalendar } from '../../features/calendar/RoomsCalendar'
import { Invoices } from '../../features/invoices/Invoices'
import { Sequences } from '../../features/settings/Sequences/Sequences'

export const LayoutContent = () => {
  console.log('prueba')
  return (
    <>
      <Routes>
        <Route
          path=''
          element={
            <Navigate
              to='my-hotel'
              replace
            />
          }
        />
        <Route
          path='/my-hotel'
          element={<MyHotel />}
        />
        <Route
          path='centers'
          element={<Centers />}
        />
        <Route
          path='users'
          element={<Users />}
        />
        <Route
          path='profiles'
          element={<Profiles />}
        />
        <Route
          path='type-room'
          element={<TypeRoom />}
        />
        <Route
          path='banks-accounts'
          element={<BanksAccount />}
        />
        <Route
          path='sequences'
          element={<Sequences />}
        />
        <Route
          path='/bookings'
          element={<Bookings />}
        />
        <Route
          path='/customers'
          element={<Customers />}
        />
        <Route
          path='/bedrooms'
          element={<Bedrooms />}
        />
        <Route
          path='/entries'
          element={<Entries />}
        />
        <Route
          path='/bookings'
          element={<Bookings />}
        />
        <Route
          path='/my-account'
          element={<MyAccount />}
        />
        <Route
          path='/calendar'
          element={<MyCalendar />}
        />
        <Route
          path='/rooms-manager'
          element={<RoomsCalendar />}
        />
        <Route
          path='/billing'
          element={<Invoices />}
        />
      </Routes>
    </>
  )
}
