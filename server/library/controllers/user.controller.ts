import { Request, Response } from 'express'
import { getConnection, getRepository } from 'typeorm';
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'

import { User } from '@models/user'

import { UserHelper } from '@helpers/user.helper'

export class UserController{
	userHelper: UserHelper = new UserHelper()

	getUsers = async (req: Request, res: Response) => {
		try{
			const users = await res.locals.repo(User).find({})

			return req.ok(`Successfully fetched all users.`, users)
		}catch(err){
			return req.error(`Failed to fetch all users.`, err)
		}
	}

	getCurrentUser = async (req: Request, res: Response) => {
		try{
			return req.ok(`Successfully fetched user from JWT.`, res.local.currentUser)
		}catch(err){
			return req.error(`Failed to find user provided by JWT.`, err)
		}
	}

	signin = async (req: Request, res: Response) => {
		try{
			var { username, password } = req.body;

			const user = await res.locals.repo(User).findOne({ where: { username }, select: ["id", "passwordHash", "username"] })

			if(!user){
				return req.notFound(`Failed to find the user ${username}.`)
			}

			// now we attempt to validate the user by password
			if(await this.userHelper.comparePasswords(password, user.passwordHash)){
				const jwt = this.userHelper.generateJWT(user.id)
				return req.ok(`Successfully authenticated user.`, jwt)
			}else{
				return req.error(`Failed to sign user in`)
			}
		}catch(err){
			return req.error(`Failed to sign user in`, err)
		}
	}

}