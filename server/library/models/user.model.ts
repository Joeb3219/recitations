import { Model, model, Schema } from 'mongoose';
import * as timestamps from 'mongoose-timestamps'

import { UserInterface } from '@interfaces/user.interface'

export const UserSchema = new Schema({
 username: String, 
 firstName: String,
 lastName: String,
 email: String,
});

UserSchema.plugin(timestamps)

export const UserModel: Model<UserInterface> = model('User', UserSchema);