import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm'

import { SectionInterface } from '@interfaces/section.interface'
import { User } from '@models/user'
import { Course } from '@models/course'
import { MeetingTime } from '@models/meetingTime'
import { Meetable } from '@models/meetable'

@Entity()
export class Section extends Meetable implements SectionInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string
	
	@Column()
	public index: string

	@Column()
	public sectionNumber: string

	@OneToOne(type => Course)
	@JoinColumn()
	public course: Course

	@OneToOne(type => User, { eager: true })
    @JoinColumn()
	public ta?: User
	
	@OneToOne(type => User, { eager: true })
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
		professor?: User,
		meetingTimes?: MeetingTime[],
	} = {}){
		super()
		if(args){
			this.index = args.index
			this.sectionNumber = args.sectionNumber
			this.ta = args.ta
			this.course = args.course
			this.students = args.students
			this.professor = args.professor
			this.id = args.id		
			this.meetingTimes = args.meetingTimes	
		}
	}
}