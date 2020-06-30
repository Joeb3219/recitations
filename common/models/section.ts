import { ChildEntity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToOne, JoinTable, JoinColumn, OneToMany, ManyToOne } from 'typeorm'

import { SectionInterface } from '@interfaces/section.interface'
import { User } from '@models/user'
import { Course } from '@models/course'
import { MeetingTime } from '@models/meetingTime'
import { Meetable } from '@models/meetable'

@ChildEntity()
export class Section extends Meetable implements SectionInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string

	@Column()
	public index: string

	@Column()
	public sectionNumber: string

	@ManyToOne(type => Course, course => course.sections)
	@JoinColumn()
	public course: Course

	@ManyToOne(type => User, { eager: true, cascade: true })
    @JoinColumn()
	public ta?: User
	
	@ManyToOne(type => User, { eager: true, cascade: true })
    @JoinColumn()
	public professor?: User

	@ManyToMany(type => User)
    @JoinTable()
	public students?: User[]
	
	constructor(args: {
		id?: string,
		index?: string,
		sectionNumber?: string,
		course?: Course,
		students?: User[],
		ta?: User,
		professor?: User
	} = {}){
		super()
		Object.assign(this, args)
	}
}