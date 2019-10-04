import { Model, model, Schema } from 'mongoose'
import * as timestamps from 'mongoose-timestamps'
import * as jwt from 'jsonwebtoken'

import * as bcrypt from 'bcrypt'

import { UserInterface } from '@interfaces/user.interface'

export const UserSchema = new Schema({
	username: String, 
	firstName: String,
	lastName: String,
	email: String,

	credentials: {
		select: false,
		type: {
			manual: {
				hash: String
			}
		}
	}
});

UserSchema.plugin(timestamps)

// Uses bcrypt to hash a raw password from the user
// Returns the hashed password on success, or the failure reason as a rejection otherwise.
UserSchema.statics.hashPassword = function(str){
	return new Promise((resolve, reject) => {
		const saltRounds = 15;
		bcrypt.hash(str, saltRounds, function(err, hash) {
			if(err) reject(err)
			else resolve(hash)
		});		
	})
}

// Compares two passwords, one provided from a user as a raw string, and one stored as a hash in the database
// this function will hash the raw string using bcrypt's native function, and then compare them, again with bcrypt's native function.
// Returns true if the passwords match, false if they do not, or an error via a rejection if any operation fails.
UserSchema.statics.comparePasswords = function(rawStr, storedHash){
	return new Promise(async (resolve, reject) => {
		bcrypt.compare(rawStr, storedHash, function(err, res) {
			if(err) reject(err)
			else resolve(res)
		});
	})
}

UserSchema.statics.generateJWT = function(userid){
	const data = {
		userid,
		exp: Date.now() + Number(process.env.JWT_EXPIRY_SECONDS)
	}

	return jwt.sign(data, process.env.JWT_SECRET)
}

export const User: Model<UserInterface> = model('User', UserSchema);