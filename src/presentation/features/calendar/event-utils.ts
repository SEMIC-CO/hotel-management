import type { EventInput } from '@fullcalendar/core'


// let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: '0',
    title: 'All-day event',
    start: '2026-03-02',
    end: '2026-03-05'
  },
  {
    id: '1',
    title: 'Timed event',
    start: '2026-03-02',
    end: '2026-03-04'
  }
]
let eventGuid = 0
export function createEventId() {
  return String(eventGuid++)
}