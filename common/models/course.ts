import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

import { CourseInterface } from '@interfaces/course.interface'
import { User } from '@models/user'
import { Section } from '@models/section'

@Entity()
export class Course extends BaseEntity implements CourseInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public name: string;

	@Column()
	public department: string

	@Column()
	public courseCode: string

	constructor(args: {
		id?: string,
		name?: string,
		department?: string,
		courseCode?: string,
	} = {}){
		super()
		if(args){
			this.id = args.id
			this.name = args.name
			this.department = args.department
			this.courseCode = args.courseCode			
		}
	}
}