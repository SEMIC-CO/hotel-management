import {useEffect, useRef, useState, useMemo} from 'react'
import dayjs, { Dayjs } from 'dayjs'

import {Toast} from 'primereact/toast'
import {Button} from 'primereact/button'
import {Tag} from 'primereact/tag'
import {Tooltip} from 'primereact/tooltip'
import {Dialog} from 'primereact/dialog'
import {ProgressBar} from 'primereact/progressbar'

import {useContainer} from '../../hooks/useContainer'
import {useUser} from '../../hooks/useUser'
import {createParamsUrl} from '../../../core/shared/utils/utils'
import type { IBedrooms } from '../../../core/shared/types/data'

import {DAY_NAMES, LEGEND_COLORS, MONTH_NAMES, VISIBLE_DAYS} from '../../../core/shared/utils/constants'
import {RoomGridRow} from './RoomGridRow'

/* ─── Types ─── */
interface RoomRow {
  room_id: number
  no_room: string
  type: string
  state: string // DISPONIBLE | OCUPADA | MANTENIMIENTO
}

interface Reservation {
  booking_id: number
  room_id: number
  customer: string
  entry_date: string
  exit_date: string
  status: string // CONFIRMADA | INHOUSE | CHECKOUT_PENDIENTE | PAGADA
}

type RoomFilter = 'Todas' | string

const addDays = (date: Dayjs, n: number) => date.add(n, 'day')

const toDateStr = (d: Dayjs) => d.format('YYYY-MM-DD')

const isSameDay = (a: Dayjs, b: Dayjs) => a.isSame(b, 'day')

const buildDayRange = (start: Dayjs, days: number): Dayjs[] =>
  Array.from({ length: days }, (_, i) => addDays(start, i))

/* ─── Component ─── */
export const RoomsCalendar = () => {
  const toast = useRef<Toast>(null)
  const { bedroomRepository, bookingRepository } = useContainer()
  const user = useUser()

  /* Data */
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  /* Filters */
  const [activeFilter, setActiveFilter] = useState<RoomFilter>('Todas')

  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('day').day(1))

  /* Detail dialog */
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)

  /* Derived */
  const days = useMemo(() => buildDayRange(startDate, VISIBLE_DAYS), [startDate])
  const today = useMemo(() => dayjs().startOf('day'), [])

  const roomTypes = useMemo(() => {
    const types = [...new Set(rooms.map((r) => r.type))].filter(Boolean)
    return types.sort()
  }, [rooms])

  const filteredRooms = useMemo(() => {
    if (activeFilter === 'Todas') return rooms
    return rooms.filter((r) => r.type === activeFilter)
  }, [rooms, activeFilter])

  /* Stats */
  const stats = useMemo(() => {
    const total = rooms.length || 1
    const occupied = rooms.filter((r) => r.state === 'OCUPADA').length
    const maintenance = rooms.filter((r) => r.state === 'MANTENIMIENTO').length
    const available = rooms.filter((r) => r.state === 'DISPONIBLE').length
    const occupancyPct = Math.round((occupied / total) * 100)
    const pendingCleaning = rooms.filter((r) => r.state === 'SUCIA' || r.state === 'LIMPIEZA').length

    const checkinsToday = reservations.filter((r) => dayjs(r.entry_date).isSame(dayjs(), 'day')).length

    return { occupancyPct, maintenance, available, pendingCleaning, checkinsToday }
  }, [rooms, reservations])

  /* Fetch */
  useEffect(() => {
    fetchData()
  }, [startDate])

  const fetchData = async () => {
    setLoading(true)
    const params = createParamsUrl({
      company_id: user.company_id,
      center_id: user.center_id,
      start: toDateStr(startDate),
      end: toDateStr(addDays(startDate, VISIBLE_DAYS))
    })

    try {
      const [roomsData, bookingsData] = await Promise.all([
        bedroomRepository.get<IBedrooms[]>(params),
        bookingRepository.getCalendarReservations(params),
      ])

      setRooms(
        (roomsData ?? []).map((r: IBedrooms) => ({
          room_id: r.room_id,
          no_room: r.no_room,
          type: r.type ?? '',
          state: r.state ?? 'DISPONIBLE',
        }))
      )
      setReservations(
        (bookingsData ?? []).map((b: any) => ({
          booking_id: b.id,
          room_id: b.room_id ?? 0,
          customer: b.customer,
          entry_date: b.start,
          exit_date: b.end,
          status: b.state ?? 'CONFIRMADA',
        }))
      )
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información' })
    } finally {
      setLoading(false)
    }
  }

  /* Navigation */
  const prevRange = () => setStartDate((d) => addDays(d, -VISIBLE_DAYS))
  const nextRange = () => setStartDate((d) => addDays(d, VISIBLE_DAYS))

  const rangeLabel = useMemo(() => {
    const end = addDays(startDate, VISIBLE_DAYS - 1)
    const m1 = MONTH_NAMES[startDate.month()]
    const m2 = MONTH_NAMES[end.month()]
    const y = startDate.year()
    if (m1 === m2) return `${m1} ${startDate.date()} - ${end.date()}, ${y}`
    return `${m1} ${startDate.date()} - ${m2} ${end.date()}, ${y}`
  }, [startDate])

  /* Get reservations for a room on a specific day */
  const getReservation = (roomId: number, day: Dayjs): Reservation | undefined => {
    const dayStr = day.format('YYYY-MM-DD')
    return reservations.find((r) => {
      if (r.room_id !== roomId) return false
      const start = r.entry_date?.slice(0, 10)
      const end = r.exit_date?.slice(0, 10)
      return !!start && !!end && start <= dayStr && dayStr < end
    })
  }

  /* Reservation span (how many visible days from this starting cell) */
  const getSpan = (res: Reservation, day: Dayjs): number => {
    // slice(0,10) avoids timezone shifts; add 1 day to include the checkout day visually
    const endDate = dayjs(res.exit_date.slice(0, 10)).add(1, 'day')
    const rangeEnd = addDays(startDate, VISIBLE_DAYS)
    const effectiveEnd = endDate.isBefore(rangeEnd) ? endDate : rangeEnd
    const span = effectiveEnd.diff(day, 'day')
    return span > 0 ? span : 1
  }

  const isResStart = (res: Reservation, day: Dayjs): boolean => {
    const entryDate = dayjs(res.entry_date.slice(0, 10))
    return entryDate.isSame(day, 'day') || day.isSame(startDate, 'day')
  }

  /* ─── Render ─── */
  return (
    <div className="w-full p-4">
      <Toast ref={toast} />
      <Tooltip target=".res-block" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm text-gray-700">
            Vista operativa en tiempo real – {MONTH_NAMES[dayjs().month()]} {dayjs().year()}
          </p>
        </div>
        <Button
          label="Ver Calendario Completo"
          icon="pi pi-calendar"
          size="small"
          className="text-sm"
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Ocupación Actual"
          value={`${stats.occupancyPct}%`}
          trendIcon="pi pi-arrow-up-right"
          trendValue="+5%"
          trendColor="text-green-500"
        />
        <StatCard
          title="Limpieza Pendiente"
          value={String(stats.pendingCleaning)}
          trendIcon="pi pi-exclamation-triangle"
          trendValue="-2%"
          trendColor="text-red-500"
        />
        <StatCard
          title="Check-ins Hoy"
          value={String(stats.checkinsToday)}
          trendIcon="pi pi-check"
          trendValue="+10%"
          trendColor="text-green-500"
        />
      </div>

      {/* Filters + date nav */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-2">
          <Button
            label="Todas"
            size="small"
            className={activeFilter === 'Todas' ? '' : 'p-button-outlined'}
            onClick={() => setActiveFilter('Todas')}
          />
          {roomTypes.map((t) => (
            <Button
              key={t}
              label={t}
              size="small"
              className={activeFilter === t ? '' : 'p-button-outlined'}
              onClick={() => setActiveFilter(t)}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button icon="pi pi-chevron-left" text size="small" onClick={prevRange} />
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {rangeLabel}
          </span>
          <Button icon="pi pi-chevron-right" text size="small" onClick={nextRange} />
        </div>
      </div>

      {/* Loading */}
      {loading && <ProgressBar mode="indeterminate" style={{ height: '4px' }} className="mb-2" />}

      {/* Room grid */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48 border-b border-gray-200">
                Habitación
              </th>
              {days.map((day) => {
                const isToday = isSameDay(day, today)
                return (
                  <th
                    key={toDateStr(day)}
                    className={`text-center px-1 py-2 text-xs border-b border-gray-200 min-w-[60px] ${
                      isToday
                        ? 'bg-[#3B5998] text-white rounded-t-md'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className="font-bold">{day.date()}</div>
                    <div className="text-[10px]">{DAY_NAMES[day.day()]}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 && !loading && (
              <tr>
                <td colSpan={VISIBLE_DAYS + 1} className="text-center py-8 text-gray-400">
                  No hay habitaciones
                </td>
              </tr>
            )}
            {filteredRooms.map((room) => (
              <RoomGridRow
                key={room.room_id}
                room={room}
                days={days}
                today={today}
                getReservation={getReservation}
                getSpan={getSpan}
                isResStart={isResStart}
                onClickRes={setSelectedRes}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-600">
        <LegendItem color={LEGEND_COLORS.INGRESADO} label="Ocupada / Ingresado" />
        <LegendItem color={LEGEND_COLORS.RESERVADA} label="Reserva Confirmada" />
        <LegendItem color={LEGEND_COLORS.PENDIENTE_CONFIRMAR} label="Check-out Pendiente" />
        <LegendItem color={LEGEND_COLORS.CANCELADA} label="Cancelada" />
      </div>

      {/* Detail dialog */}
      <Dialog
        header="Detalle de Reserva"
        visible={!!selectedRes}
        onHide={() => setSelectedRes(null)}
        style={{ width: '400px' }}
      >
        {selectedRes && (
          <div className="flex flex-col gap-2 text-sm">
            <p><strong>Cliente:</strong> {selectedRes.customer}</p>
            <p><strong>Entrada:</strong> {selectedRes.entry_date?.slice(0, 10)}</p>
            <p><strong>Salida:</strong> {selectedRes.exit_date?.slice(0, 10)}</p>
            <p><strong>Estado:</strong>{' '}
              <Tag value={selectedRes.status} severity={getTagSeverity(selectedRes.status)} />
            </p>
          </div>
        )}
      </Dialog>
    </div>
  )
}

/* ─── Sub-components ─── */

interface StatCardProps {
  title: string
  value: string
  trendIcon?: string
  trendValue?: string
  trendColor?: string
}

const StatCard = ({ title, value, trendIcon, trendValue, trendColor }: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {trendValue && (
        <span className={`flex items-center gap-1 text-sm font-medium ${trendColor ?? ''}`}>
          {trendIcon && <i className={trendIcon} />}
          {trendValue}
        </span>
      )}
    </div>
  </div>
)

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5">
    <span className={`inline-block w-3 h-3 rounded-sm ${color}`} />
    {label}
  </span>
)

const getTagSeverity = (status: string): 'success' | 'info' | 'warning' | 'danger' | null => {
  switch (status) {
    case 'PAGADA': return 'success'
    case 'CONFIRMADA': return 'info'
    case 'PENDIENTE': return 'warning'
    case 'INHOUSE': return null
    default: return 'info'
  }
}
