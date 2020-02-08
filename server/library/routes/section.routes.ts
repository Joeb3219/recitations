import { SectionController } from '@controllers/section.controller'

import { isAuthenticated } from '@helpers/auth/auth.helper'

export function registerSectionRoutes(app){
	const controller = new SectionController();

	app.route('/course/:courseID/sections')
		.get(
			isAuthenticated,
			controller.getCourseSections
		)

	app.route('/section/:sectionID')
		.put(
			isAuthenticated,
			controller.updateSection
		)

	app.route('/section')
		.post(
			isAuthenticated,
			controller.createSection
		)

}