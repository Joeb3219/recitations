import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

import { UserInterface } from '@interfaces/user.interface'

@Entity()
export class User extends BaseEntity implements UserInterface {
	
	@PrimaryGeneratedColumn("uuid")
	public id: string

	@Column()
	public firstName: string

	@Column()
	public lastName: string

	@Column()
	public username: string

	@Column()
	public email: string

	@Column({ select: false })
	public passwordHash: string

	constructor(args: {
		id?: string,
		firstName?: string,
		lastName?: string,
		username?: string,
		email?: string,
		passwordHash?: string,
	} = {}){
		super()
		if(args){
			this.id = args.id
			this.firstName = args.firstName
			this.lastName = args.lastName
			this.username = args.username
			this.email = args.email
			this.passwordHash = args.passwordHash
		}
	}

	public static getFullName(user: User): string{
		if(user==null){
			return null;
		}
		return user.firstName + " " + user.lastName;
	}

}