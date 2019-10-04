import { UserInterface } from '@interfaces/user.interface'

export class User implements UserInterface{
	constructor(
		public firstName: string = '',
		public lastName: string = '',
		public username: string = '',
		public email: string = '',
		public _id: string = '',
		public createdAt: Date = null,
		public updatedAt: Date = null
	){}
}