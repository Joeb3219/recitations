import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity } from 'typeorm'

import { MeetableInterface } from '@interfaces/meetable.interface'
import { MeetingTime } from '@models/meetingTime'

@Entity()
export abstract class Meetable extends BaseEntity implements MeetableInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string

	@ManyToMany(type => MeetingTime, { eager: true })
    @JoinTable()
	public meetingTimes?: MeetingTime[]

	constructor(args: {
		meetingTimes?: MeetingTime[],
	} = {}){
		super()
		if(args){
			this.meetingTimes = args.meetingTimes
		}
	}
}