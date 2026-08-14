import {
  STATUS_COLORS,
  STATUS_TEXT_COLORS
} from '../../../core/shared/utils/constants'
import { Dayjs } from 'dayjs'

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

interface RoomGridRowProps {
  room: RoomRow
  days: Dayjs[]
  today: Dayjs
  getReservation: (roomId: number, day: Dayjs) => Reservation | undefined
  getSpan: (res: Reservation, day: Dayjs) => number
  isResStart: (res: Reservation, day: Dayjs) => boolean
  onClickRes: (res: Reservation) => void
}

export const RoomGridRow = ({
  room,
  days,
  today,
  getReservation,
  getSpan,
  isResStart,
  onClickRes
}: RoomGridRowProps) => {
  const toDateStr = (d: Dayjs) => d.format('YYYY-MM-DD')
  // const toDateStr = (d: Date) => d.toISOString().slice(0, 10)

  const isSameDay = (a: Dayjs, b: Dayjs) => a.isSame(b, 'day')

  // const stateTag = ROOM_STATE_TAG[
  //   // room.state.replace(' ', '_').toUpperCase()
  //   'INGRESO'
  // ] ?? {
  //   color: 'text-gray-700',
  //   bg: 'bg-gray-100',
  //   label: room.state
  // }
  // console.log('stateTag', stateTag)

  /* Build cells: skip cells covered by multi-day spans */
  const cells: React.JSX.Element[] = []
  let skip = 0
  for (let i = 0; i < days.length; i++) {
    if (skip > 0) {
      skip--
      continue
    }
    const day = days[i]
    const res = getReservation(room.room_id, day)
    const isToday = isSameDay(day, today)

    

    if (res && isResStart(res, day)) {
      const span = getSpan(res, day)
      const status = res.status.replace(' ', '_').toUpperCase()
      const bgColor = STATUS_COLORS[status] ?? 'bg-[#B8C9E8]'
      const txtColor = STATUS_TEXT_COLORS[status] ?? 'text-[#3B5998]'
      cells.push(
        <td
          key={toDateStr(day)}
          colSpan={span}
          className={`relative px-0.5 py-1 border-b border-gray-200 ${isToday ? 'bg-blue-50' : ''}`}
        >
          <div
            className={`res-block ${bgColor} ${txtColor} text-[10px] rounded-md px-2 py-2 cursor-pointer truncate hover:opacity-90 transition-opacity shadow-sm`}
            data-pr-tooltip={`${res.customer} (${res.status})`}
            data-pr-position='top'
            onClick={() => onClickRes(res)}
          >
            {res.customer || res.status}
          </div>
        </td>
      )
      skip = span - 1
    } else if (!res) {
      cells.push(
        <td
          key={toDateStr(day)}
          className={`px-1 py-1 border-b border-gray-200 ${isToday ? 'bg-blue-50' : ''}`}
        />
      )
    }
    // if res exists but it's not the start, skip was already handled
  }

  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='sticky left-0 z-10 bg-white px-4 py-2 border-b border-gray-200'>
        <div className='flex flex-col text-left'>
          <span className='font-semibold text-sm text-gray-800'>
            {room.no_room}
          </span>
          <span
            className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded text-blue-700 bg-blue-100 w-fit uppercase`}
          >
            {room.type}
          </span>
        </div>
      </td>
      {cells}
    </tr>
  )
}
