import { CourseController } from '@controllers/course.controller'

import { isAuthenticated } from '@helpers/auth/auth.helper'

export function registerCourseRoutes(app){
	const controller = new CourseController();

	app.route('/course')
		.put(
			isAuthenticated,
			controller.createCourse
		)
		.get(
			isAuthenticated,
			controller.getCourses
		)

}