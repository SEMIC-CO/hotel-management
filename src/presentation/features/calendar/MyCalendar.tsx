import { useEffect, useState } from "react";
import {
  type EventApi,
  type DateSelectArg,
  type EventClickArg,
  type EventContentArg,
  type DatesSetArg,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createEventId } from "./event-utils";
import { useContainer } from "../../hooks/useContainer";
import { createParamsUrl } from "../../../core/shared/utils/utils";
import { useUser } from "../../hooks/useUser";
import dayjs, { Dayjs } from "dayjs";
import type { ICalendarReservation } from "../../../core/shared/types/data";
import { CALENDAR_EVENT_COLORS } from "../../../core/shared/utils/constants";

interface DemoAppState {
  weekendsVisible: boolean;
  currentEvents: EventApi[];
}

export const MyCalendar = () => {
  const { bookingRepository } = useContainer();
  const user = useUser();

  const [startDate, setStartDate] = useState<Dayjs>(() =>
    dayjs().startOf("day").day(1),
  );
  const [bookingsData, setBookingsData] = useState<ICalendarReservation[]>([]);

  const toDateStr = (d: Dayjs) => d.format("YYYY-MM-DD");

  useEffect(() => {
    const params = createParamsUrl({
      company_id: user.company_id,
      center_id: user.center_id,
      start: toDateStr(startDate),
      end: toDateStr(startDate.add(1, "month").subtract(1, "day")),
    });

    bookingRepository
      .getCalendarReservations(params)
      .then(setBookingsData)
      .catch(() => setBookingsData([]));
  }, [bookingRepository, user, startDate]);

  console.log("Calendar bookingsData", bookingsData);
  

  const [state, setState] = useState<DemoAppState>({
    weekendsVisible: true,
    currentEvents: [],
  });

  // const addEvent = () => {
  //   console.log("addEvent");
  // };

  // const removeEvent = () => {
  //   console.log("removeEvent");
  // };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`,
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events: EventApi[]) => {
    console.log("handleEvents", events);
    setState({
      ...state,
      currentEvents: events,
    });
  };

  function renderEventContent(eventContent: EventContentArg) {
    const state =
      (eventContent.event.extendedProps.state as string | undefined) ?? '';
    return (
      <div className='w-full h-full flex flex-col justify-center px-1 overflow-hidden'>
        <span className='font-semibold text-[11px] leading-tight truncate'>
          {eventContent.event.extendedProps.no_room ?? eventContent.event.title}
        </span>
        <span className='text-[10px] opacity-90'>
          {state || eventContent.timeText}
        </span>
      </div>
    );
  }

  const handleDatesSet = (info: DatesSetArg) => {
    setStartDate(dayjs(info.start).startOf("day"));
  };

  return (
    <>
      <div className="demo-app">
        {/* {this.renderSidebar()} */}
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              // left: 'prev,next',
              // center: 'title',
              // right: 'dayGridMonth,timeGridWeek,timeGridDay'
              right: "prev,next",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={bookingsData.map((b) => {
              const colors =
                CALENDAR_EVENT_COLORS[b.state ?? ''] ??
                CALENDAR_EVENT_COLORS.CONFIRMADA;
              return {
                id: String(b.id),
                title: `${b.no_room} ${b.customer}`,
                start: b.start,
                end: b.end,
                backgroundColor: colors.background,
                borderColor: colors.border,
                textColor: colors.text,
                extendedProps: { state: b.state ?? 'CONFIRMADA' },
              };
            })}
            // select={handleDateSelect}
            datesSet={handleDatesSet}
            eventContent={renderEventContent} // custom render function
            // eventClick={handleEventClick}
            // eventsSet={handleEvents}
            // eventAdd={addEvent}
            // eventRemove={removeEvent}
            // eventChange={addEvent}
            // events={[
            //   { title: 'event 1', start: '2026-03-01', end: '2026-03-02' },
            //   { title: 'event 2', start: '2026-03-02', end: '2026-03-04' },
            //   { title: 'event 3', start: '2026-03-04', end: '2026-03-06' }
            // ]}
            // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    </>
  );
};
