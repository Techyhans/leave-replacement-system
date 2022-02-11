import RRule from "rrule";
import moment from "moment";


const find_nearest_date_from_day = (dayOfWeek) => {
	//  SUN = 0
	//  MON = 1
	//  TUE = 2
	//  WED = 3
	//  THU = 4
	//  FRI = 5
	//  SAT = 6
	return moment().isoWeekday(-7+((1+1)*7)+dayOfWeek).toDate()
}

export const generate_recurrent_date = (start_datetime = null, end_datetime = null, title = "title") => {

	const start_year = moment(start_datetime).toDate().getFullYear()
	const start_month = moment(start_datetime).toDate().getMonth()
	const start_date = moment(start_datetime).toDate().getDate()
	const start_hours = moment(start_datetime).toDate().getHours()
	const start_minutes = moment(start_datetime).toDate().getMinutes()

	const end_year = moment(end_datetime).toDate().getFullYear()
	const end_month = moment(end_datetime).toDate().getMonth()
	const end_date = moment(end_datetime).toDate().getDate()
	const end_hours = moment(end_datetime).toDate().getHours()
	const end_minutes = moment(end_datetime).toDate().getMinutes()

	const sub_1_start_date = new RRule({
		freq: RRule.WEEKLY,
		dtstart: new Date(start_year, start_month, start_date, start_hours, start_minutes),
		until: moment(start_datetime).add(50, "days").toDate()
	}).all()

	const sub_1_end_date = new RRule({
		freq: RRule.WEEKLY,
		dtstart: new Date(end_year, end_month, end_date, end_hours, end_minutes),
		until: moment(end_datetime).add(50, "days").toDate()
	}).all()

	const events = []

	for (let i = 0; i < sub_1_start_date.length; i++) {
		events.push({
			title: title,
			start: new Date(sub_1_start_date[i]),
			end: new Date(sub_1_end_date[i]),
		})
	}

	console.log(events)

	return events
}
