import React, {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import axios from "axios";

import "react-big-calendar/lib/css/react-big-calendar.css";

import {format, addDays, subDays} from "date-fns";
import RRule from "rrule";
import {find_nearest_date_from_day, generate_recurrent_date} from "../../../utils";

const localizer = momentLocalizer(moment);

export const UserDashboardPage = () => {
    const [events, setEvents] = useState([]);

    async function viewRosterModule(values) {
        let eventList = []
        for (let i = 0; i < values.length; i++) {
            console.log(values[i])
            let start_date = find_nearest_date_from_day(values[i].day, values[i].start_hour)
            let end_date = find_nearest_date_from_day(values[i].day, values[i].end_hour)
            let dt = await generate_recurrent_date(start_date, end_date, values[i].subject.name)
            eventList = eventList.concat(dt)
        }
        setEvents(eventList)
    }

    useEffect(() => {
        axios
            .put('/api/rosters/me', {}, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            }).then(resp => {
                console.log(resp.data);
                viewRosterModule(resp.data)
            })
            .catch(err => console.log(err));
    }, [])

    useEffect(() => {
        // setEvents(generate_recurrent_date(new Date(), moment().add(50, 'days').toDate(), 'subject title'))
    }, [])


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
                events={events}
                style={{height: "100vh"}}
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
