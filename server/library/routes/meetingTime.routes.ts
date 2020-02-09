import { MeetingTimeController } from '@controllers/meetingTime.controller'

import { isAuthenticated } from '@helpers/auth/auth.helper'

export function registerMeetingTimeRoutes(app){
	const controller = new MeetingTimeController();

	app.route('/meetingTime')
		.put(
			isAuthenticated,
			controller.createMeetingTime
		)
	// 	.get(
	// 		isAuthenticated,
	// 		controller.getCourses
	// 	)


	// app.route('/course/:courseID')
	// 	.get(
	// 		isAuthenticated,
	// 		controller.getCourse
	// 	)

}