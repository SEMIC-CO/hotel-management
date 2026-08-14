export const DOCUMENT_TYPES = [
  { name: 'CÉDULA', code: 'CÉDULA' },
  { name: 'NIT', code: 'NIT' },
  { name: 'CÉDULA EXTRANGERÍA', code: 'CÉDULA EXTRANGERÍA' },
  { name: 'TARJETA DE IDENTIDAD', code: 'TARJETA DE IDENTIDAD' },
  { name: 'PASAPORTE', code: 'PASAPORTE' }
]

export const ACTION_TYPE = [
  { name: 'RESERVA', code: 'RESERVA' },
  { name: 'INGRESO', code: 'INGRESO' },
]
export const PAYMENT_TYPES = [
  { name: 'EFECTIVO', code: 'EFECTIVO' },
  { name: 'TRANSFERENCIA', code: 'TRANSFERENCIA' }
]

export const ROOM_STATES = [
  { name: 'DISPONIBLE', code: 'DISPONIBLE' },
  { name: 'EN MANTENIMIENTO', code: 'EN MANTENIMIENTO' }
]

export const RESERVATION_STATES = [
  { name: 'RESERVADA', code: 'RESERVADA' },
  { name: 'PENDIENTE CONFIRMAR', code: 'PENDIENTE CONFIRMAR' },
  { name: 'INGRESADO', code: 'INGRESADO' },
  { name: 'CANCELADA', code: 'CANCELADA' }
]

/** Estados posibles de una reserva (columna `state` del backend). */
export const BOOKING_STATE = {
  PENDIENTE_CONFIRMAR: 'PENDIENTE CONFIRMAR',
  RESERVADA: 'RESERVADA',
  INGRESO: 'INGRESO',
  CANCELADA: 'CANCELADA'
} as const

/** Rutas base de la aplicación. */
export const APP_ROUTES = {
  PUBLIC: '/web',
  LOGIN: '/web/login',
  PRIVATE: '/app'
} as const

export const VISIBLE_DAYS = 15

export const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']
export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const STATUS_TEXT_COLORS: Record<string, string> = {
  INHOUSE: 'text-white',
  RESERVADA: 'text-white',
  PENDIENTE_CONFIRMAR: 'text-white',
  INGRESO: 'text-white',
  CANCELADA: 'text-white',
}

/* ─── Status colours (matching reference image) ─── */
export const STATUS_COLORS: Record<string, string> = {
  EN_MANTENIMIENTO: 'bg-[#3B5998]',          // azul-indigo oscuro (bloque sólido)
  RESERVADA: 'bg-[#3B5998]',       // azul lavanda claro
  PENDIENTE_CONFIRMAR: 'bg-[#0ea5e7]', // gris claro
  INGRESO: 'bg-[#10B981]',           // verde esmeralda
  CANCELADA: 'bg-[#e03852]',          // mismo azul-indigo que Inhouse
}


export const LEGEND_COLORS: Record<string, string> = {
  EN_MANTENIMIENTO: 'bg-[#3B5998]',
  RESERVADA: 'bg-[#3B5998]',
  PENDIENTE_CONFIRMAR: 'bg-[#0ea5e7]',
  // PENDIENTE_CONFIRMAR: 'bg-[#C4CDD5]',
  INGRESO: 'bg-[#10B981]',
  CANCELADA: 'bg-[#e03852]',
}

export const ROOM_STATE_TAG: Record<string, { color: string; bg: string; label: string }> = {
  DISPONIBLE: { color: 'text-green-700', bg: 'bg-green-100', label: 'DISPONIBLE' },
  LIMPIA: { color: 'text-green-700', bg: 'bg-green-100', label: 'LIMPIA' },
  PENDIENTE_CONFIRMAR: { color: 'text-red-700', bg: 'bg-red-100', label: 'PENDIENTE CONFIRMAR' },
  RESERVADA: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'RESERVADA' },
  INGRESO: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'OCUPADA' },
  EN_MANTENIMIENTO: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'EN MANTENIMIENTO' },
}

/* ─── FullCalendar event colors (hex, per reservation state from the API) ─── */
export const CALENDAR_EVENT_COLORS: Record<
  string,
  { background: string; border: string; text: string }
> = {
  CONFIRMADA: { background: '#3B5998', border: '#2f4683', text: '#ffffff' },
  INHOUSE: { background: '#10B981', border: '#0b9e6b', text: '#ffffff' },
  CHECKOUT_PENDIENTE: { background: '#0ea5e7', border: '#0b8fc9', text: '#ffffff' },
  PAGADA: { background: '#64748B', border: '#52606d', text: '#ffffff' },
  CANCELADA: { background: '#e03852', border: '#c72f48', text: '#ffffff' },
}