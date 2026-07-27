import type {
  IAuthRepository,
  IBedroomRepository,
  IBookingRepository,
  ICustomerRepository,
  IInvoiceRepository,
  ISettingsRepository
} from '../domain/repositories'

export interface AppContainer {
  authRepository: IAuthRepository
  bookingRepository: IBookingRepository
  bedroomRepository: IBedroomRepository
  customerRepository: ICustomerRepository
  invoiceRepository: IInvoiceRepository
  settingsRepository: ISettingsRepository
}
