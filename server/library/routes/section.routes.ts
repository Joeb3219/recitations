import { SectionController } from '@controllers/section.controller'

import { isAuthenticated } from '@helpers/auth/auth.helper'

export function registerSectionRoutes(app){
	const controller = new SectionController();

	app.route('/course/:courseID/sections')
		.get(
			isAuthenticated,
			controller.getCourseSections
		)

}