import type {
  IAuthRepository,
  IBedroomRepository,
  IBookingRepository,
  ICustomerRepository,
  IEntryRepository,
  IInvoiceRepository,
  ISettingsRepository
} from '../domain/repositories'

export interface AppContainer {
  authRepository: IAuthRepository
  bookingRepository: IBookingRepository
  bedroomRepository: IBedroomRepository
  customerRepository: ICustomerRepository
  entryRepository: IEntryRepository
  invoiceRepository: IInvoiceRepository
  settingsRepository: ISettingsRepository
}
