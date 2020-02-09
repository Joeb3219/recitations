import { UserController } from '@controllers/user.controller'

export function registerUserRoutes(app){
	const controller = new UserController();

	app.route('/user')
		.get(
			controller.getUsers
		)

	app.route('/user/me')
		.get(
			controller.getCurrentUser
		)

	app.route('/user/signin')
		.post(
			controller.signin
		)

}