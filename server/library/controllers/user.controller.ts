import { Controller, GetRequest, PostRequest } from '../decorators';
import * as Boom from '@hapi/boom';

import { User } from '@models/user'

import { UserHelper } from '@helpers/user.helper'

@Controller
export class UserController{
	@GetRequest('/user')
	async getUsers({ repo }) {
		return await repo(User).find({})
	}

	@GetRequest('/user/me')
	async getCurrentUser({ currentUser }) {
		return currentUser;
	}

	@PostRequest('/user/signin')
	async signin( { body, repo }) {
		var { username, password } = body;

		const user = await repo(User).findOne({ where: { username }, select: ["id", "passwordHash", "username"] })

		if(!user) throw Boom.notFound('User not found');

		// now we attempt to validate the user by password
		const userHelper = new UserHelper();
		if(await userHelper.comparePasswords(password, user.passwordHash)){
			const jwt = userHelper.generateJWT(user.id)
			return jwt;
		}

		throw Boom.unauthorized('Failed to sign in as user')
	}

}