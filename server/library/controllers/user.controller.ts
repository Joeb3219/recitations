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

			return res.status(OK).json({ data: users, message: `Successfully fetched all users.` })
		}catch(err){
			console.error(err)
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to fetch all users.` })
		}
	}

	getCurrentUser = async (req: Request, res: Response) => {
		try{
			return res.status(OK).json({ data: res.locals.currentUser, message: `Successfully fetched user from JWT.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to find user provided by JWT.` })
		}
	}

	signin = async (req: Request, res: Response) => {
		try{
			var { username, password } = req.body;

			const user = await res.locals.repo(User).findOne({ where: { username }, select: ["id", "passwordHash", "username"] })

			if(!user){
				return res.status(NOT_FOUND).json({ message: `Failed to find the user ${username}.`}).end()
			}

			// now we attempt to validate the user by password
			if(await this.userHelper.comparePasswords(password, user.passwordHash)){
				const jwt = this.userHelper.generateJWT(user.id)
				return res.status(OK).json({ data: jwt, message: `Successfully authenticated user ${username}.`}).end()
			}else{
				return res.status(BAD_REQUEST).json({ message: `Failed to sign user ${username} in.` }).end()
			}
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to sign user ${username} in.` }).end()
		}
	}

}