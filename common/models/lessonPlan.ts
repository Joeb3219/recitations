import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToOne, JoinTable, JoinColumn, OneToMany, ManyToOne } from 'typeorm'

import { LessonPlanInterface } from '@interfaces/lessonPlan.interface'
import { User } from '@models/user'
import { Course } from '@models/course'
import { Problem } from '@models/problem'
import { LessonPlanStep } from '@models/lessonPlanStep'

@Entity()
export class LessonPlan extends BaseEntity implements LessonPlanInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string

	@Column()
	public name: string;

	@ManyToOne(type => LessonPlanStep, { eager: true })
	@JoinColumn()
	public steps: LessonPlanStep[];

	@ManyToOne(type => Course, { eager: true })
	@JoinColumn()
	public course: Course
	
	@ManyToOne(type => User, { eager: true, cascade: true })
    @JoinColumn()
	public creator?: User
	
	constructor(args: {
		id?: string,
		name?: number,
		steps?: LessonPlanStep[],
		creator?: User,
		course?: Course,
	} = {}){
		super()
		Object.assign(this, args)
	}
}