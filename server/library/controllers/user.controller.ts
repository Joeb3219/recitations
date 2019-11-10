import { Request, Response } from 'express'
import { User } from '@models/user'

import { getConnection, getRepository } from 'typeorm';

import { UserHelper } from '@helpers/user.helper'

export class UserController{
	userHelper: UserHelper = new UserHelper()

	getCurrentUser = async (req: Request, res: Response) => {
		try{
			return res.status(200).json({ data: res.locals.currentUser, message: `Successfully fetched user from JWT.` })
		}catch(err){
			console.error(err);
			return res.status(400).json({ error: err, message: `Failed to find user provided by JWT.` })
		}
	}

	signin = async (req: Request, res: Response) => {
		try{
			var { username, password } = req.body;

			const user = await res.locals.repo(User).findOne({ username })

			if(!user){
				return res.status(401).json({ message: `Failed to find the user ${username}.`}).end()
			}

			// now we attempt to validate the user by password
			if(await this.userHelper.comparePasswords(password, user.passwordHash)){
				const jwt = this.userHelper.generateJWT(user.id)
				return res.status(200).json({ data: jwt, message: `Successfully authenticated user ${username}.`}).end()
			}else{
				return res.status(400).json({ message: `Failed to sign user ${username} in.` }).end()
			}
		}catch(err){
			console.error(err);
			return res.status(400).json({ error: err, message: `Failed to sign user ${username} in.` }).end()
		}
	}

}