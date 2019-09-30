import { UserController } from '@controllers/user.controller'

export function registerUserRoutes(app){
	const controller = new UserController();

	app.route('/user/me')
		.get(
			controller.getCurrentUser
		)
}