import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

export class UserHelper {

	hashPassword(str) {
		return new Promise((resolve, reject) => {
			const saltRounds = 15;
			bcrypt.hash(str, saltRounds, function(err, hash) {
				if(err) reject(err)
				else resolve(hash)
			});		
		})
	}

	comparePasswords(rawStr, storedHash) {
		return new Promise(async (resolve, reject) => {
			bcrypt.compare(rawStr, storedHash, function(err, res) {
				if(err) reject(err)
				else resolve(res)
			});
		})
	}

	generateJWT(userid) {
		const data = {
			userid,
			exp: Date.now() + Number(process.env.JWT_EXPIRY_SECONDS)
		}

		return jwt.sign(data, process.env.JWT_SECRET)
	}

}