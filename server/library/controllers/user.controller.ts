import { UserModel } from '@models/user.model'

export class UserController{

	getCurrentUser = async (res, req) => {
		return new UserModel();
	}

}