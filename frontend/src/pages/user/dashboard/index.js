import React, {useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { format, addDays, subDays } from "date-fns";
import RRule from "rrule";

const localizer = momentLocalizer(moment);

export const UserDashboardPage = () => {
    const [events, setEvents] = useState([]);

    // const sub_1_start_date = new RRule({
    //     freq: RRule.WEEKLY,
    //     dtstart: new Date(2022, 1, 1, 10, 30),
    //     // until: new Date(2022, 2, 28)
    // }).all()
    //
    // const sub_1_end_date = new RRule({
    //     freq: RRule.WEEKLY,
    //     dtstart: new Date(2022, 1, 1, 11, 30),
    //     // until: new Date(2022, 2, 28)
    // }).all()
    //
    // const title = "Maths";
    //
    // const events = []
    //
    // for (let i = 0; i < 50; i++) {
    //     events.push({
    //         title: title,
    //         start: new Date(sub_1_start_date[i]),
    //         end: new Date(sub_1_end_date[i]),
    //     })
    // }

  return (
	<>
      <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          // events={events}
          style={{ height: "100vh" }}
          // startAccessor={start => {
          //   var s = toNewDate(start.dates[0].days.startDate);
          //   return subDays(s, start.dates[0].numPreDays);
          // }}
          // endAccessor={end => {
          //   var e = toNewDate(end.dates[0].days.endDate);
          //   return addDays(e, end.dates[0].numPostDays);
          // }}
      />
    </>
  );
};
