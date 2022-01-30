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

export const generate_recurrent_date = (start_datetime, end_datetime, title) => {

	const sub_1_start_date = new RRule({
		freq: RRule.WEEKLY,
		dtstart: new Date(2022, 1, 1, 10, 30),
		// until: new Date(2022, 2, 28)
	}).all()

	const sub_1_end_date = new RRule({
		freq: RRule.WEEKLY,
		dtstart: new Date(2022, 1, 1, 11, 30),
		// until: new Date(2022, 2, 28)
	}).all()

	const events = []

	for (let i = 0; i < 50; i++) {
		events.push({
			title: title,
			start: new Date(sub_1_start_date[i]),
			end: new Date(sub_1_end_date[i]),
		})
	}

	return events
}
