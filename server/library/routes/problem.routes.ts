import { ProblemController } from '@controllers/problem.controller'

import { isAuthenticated } from '@helpers/auth/auth.helper'

export function registerProblemRoutes(app){
	const controller = new ProblemController();

	app.route('/course/:courseID/problems')
		.get(
			isAuthenticated,
			controller.getCourseProblems
		)

	app.route('/problem/:problemID')
		.put(
			isAuthenticated,
			controller.updateProblem
		)

	app.route('/problem')
		.post(
			isAuthenticated,
			controller.createProblem
		)

}