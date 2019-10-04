import { Request, Response } from 'express'
import { User } from '@models/user.model'

export class UserController{

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

			const user = await User.findOne({ username }).select("+credentials")

			if(!user){
				return res.status(401).json({ message: `Failed to find the user ${username}.`}).end()
			}

			// now we attempt to validate the user by password
			if(await User.comparePasswords(password, user.credentials.manual.hash)){
				const jwt = User.generateJWT(user._id)
				return res.status(200).json({ data: jwt, message: `Successfully authenticated user ${username}.`})
			}else{
				return res.status(400).json({ message: `Failed to sign user ${username} in.` })
			}
		}catch(err){
			console.error(err);
			return res.status(400).json({ error: err, message: `Failed to sign user ${username} in.` }).end()
		}
	}

}