import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToOne, JoinTable, JoinColumn, OneToMany, ManyToOne } from 'typeorm'

import { ProblemInterface } from '@interfaces/problem.interface'
import { User } from '@models/user'
import { Course } from '@models/course'

@Entity()
export class Problem extends BaseEntity implements ProblemInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string

	@Column()
	public difficulty: number

	@Column()
	public name: string

	@Column()
	public question: string

	@Column()
	public solution: string

	@Column()
	public estimatedDuration: number

	@ManyToOne(type => Course, { eager: true })
	@JoinColumn()
	public course: Course
	
	@ManyToOne(type => User, { eager: true, cascade: true })
    @JoinColumn()
	public creator?: User
	
	constructor(args: {
		id?: string,
		difficulty?: number,
		name?: string,
		question?: string,
		solution?: string,
		estimatedDuration?: number,
		creator?: User,
		course?: Course,
	} = {}){
		super()
		Object.assign(this, args)
	}

	public static getMinuteUnit(estimatedDuration: number): string{
		let unit: string;
		estimatedDuration > 1 ? unit = "minutes" : unit = "minute";
		return unit;
	}
}