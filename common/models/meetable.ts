import { Entity, TableInheritance, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, JoinTable, BaseEntity } from 'typeorm'

import { MeetableInterface } from '@interfaces/meetable.interface'
import { MeetingTime } from '@models/meetingTime'

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Meetable extends BaseEntity implements MeetableInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string

	@OneToMany(type => MeetingTime, meetingTime => meetingTime.meetable, { eager: true, cascade: true })
	@JoinTable()
	public meetingTimes?: MeetingTime[]

	constructor(args: {
		meetingTimes?: MeetingTime[],
	} = {}){
		super()
		Object.assign(this, args)
	}
}