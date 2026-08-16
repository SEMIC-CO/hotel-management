import { useEffect, useState } from "react";
import {
  type EventContentArg,
  type DatesSetArg,
  // type DateSelectArg,
  type EventClickArg,
  // type EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useContainer } from "../../hooks/useContainer";
import { createParamsUrl } from "../../../core/shared/utils/utils";
import { useUser } from "../../hooks/useUser";
import dayjs, { Dayjs } from "dayjs";
import type { ICalendarReservation } from "../../../core/shared/types/data";
import {
  CALENDAR_EVENT_COLORS,
  STATUS_COLORS,
} from "../../../core/shared/utils/constants";
import type { Reservation } from "./RoomsCalendar";
import { InfoReservationCalendar } from "./InfoReservationCalendar";
// import { createEventId } from "./event-utils";

export const MyCalendar = () => {
  const { bookingRepository } = useContainer();
  const user = useUser();

  const [startDate, setStartDate] = useState<Dayjs>(() =>
    dayjs().startOf("day").day(1),
  );

  const [bookingsData, setBookingsData] = useState<ICalendarReservation[]>([]);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

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

  // const addEvent = () => {
  //   console.log("addEvent");
  // };

  // const removeEvent = () => {
  //   console.log("removeEvent");
  // };

  function renderEventContent(eventContent: EventContentArg) {
    const state =
      (eventContent.event["_def"].extendedProps.status as string | undefined) ??
      "";
    let stateColor = state.replace(/\s+/g, "_").toUpperCase();
    return (
      <div
        className={`w-full h-full flex flex-col justify-center px-1 overflow-hidden cursor-pointer ${STATUS_COLORS[stateColor] ?? "#3B5998"}`}
      >
        <span className="font-semibold text-[11px] leading-tight truncate">
          {eventContent.event.title}
        </span>
        <span className="text-[10px] opacity-90">
          {state || eventContent.timeText}
        </span>
      </div>
    );
  }

  const handleDatesSet = (info: DatesSetArg) => {
    setStartDate(dayjs(info.start).startOf("day"));
  };

  // const handleDateSelect = (selectInfo: DateSelectArg) => {
  //   let title = prompt("Please enter a new title for your event");
  //   let calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) {
  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //     });
  //   }
  // };

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("handleEventClick", clickInfo);
    setSelectedRes({
      customer: clickInfo.event.extendedProps.customer,
      entry_date: clickInfo.event.startStr,
      exit_date: clickInfo.event.endStr,
      status: clickInfo.event.extendedProps.status,
      observations: clickInfo.event.extendedProps.description,
    });
  };

  // const handleEvents = (events: EventApi[]) => {
  //   console.log("handleEvents", events);
  //   setState({
  //     ...state,
  //     currentEvents: events,
  //   });
  // };

  return (
    <>
      <div className="demo-app">
        {/* {this.renderSidebar()} */}
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
              // right: "prev,next",
            }}
            initialView="dayGridMonth"
            locale={esLocale}
            // editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={bookingsData.map((b) => {
              const stateColor = (b.state ?? "").replace(/\s+/g, "_").toUpperCase();
              const colors =
                CALENDAR_EVENT_COLORS[stateColor] ??
                CALENDAR_EVENT_COLORS.RESERVADA;
              return {
                id: `${b.id}-${b.no_room}`,
                title: `${b.no_room} ${b.customer}`,
                start: b.start,
                end: b.end,
                backgroundColor: colors.background,
                borderColor: colors.border,
                textColor: colors.text,
                extendedProps: {
                  status: b.state ?? "RESERVADA",
                  no_room: b.no_room,
                  customer: b.customer,
                  entry_date: b.start,
                  exit_date: b.end,
                  description: b.observations ?? ""  ,
                },
              };
            })}
            // select={handleDateSelect}
            datesSet={handleDatesSet}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
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
          <InfoReservationCalendar
            selectedRes={selectedRes}
            setSelectedRes={setSelectedRes}
          />
        </div>
      </div>
    </>
  );
};
