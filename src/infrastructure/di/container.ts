import type { AppContainer } from '../../core/di/Container'
import authApi from '../api/auth/authApi'
import bedrooms from '../api/services/BedroomsServices'
import bookings from '../api/services/BookingsServices'
import customers from '../api/services/CustomersServices'
import invoices from '../api/services/InvoicesServices'
import settings from '../api/services/SettingsService'

export const container: AppContainer = {
  authRepository: authApi,
  bookingRepository: bookings,
  bedroomRepository: bedrooms,
  customerRepository: customers,
  invoiceRepository: invoices,
  settingsRepository: settings
}
