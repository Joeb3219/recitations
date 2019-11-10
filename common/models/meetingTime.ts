import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

import { MeetingTimeInterface } from '@interfaces/meetingTime.interface'
import { User } from '@models/user'
import { MeetingType } from '@enums/meetingType.enum'

@Entity()
export class MeetingTime extends BaseEntity implements MeetingTimeInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string

	@Column()
	public startTime: Date

	@Column()
	public endTime: Date

	@Column()
	public weekday: string

	@Column()
	public type: MeetingType

	@Column()
	public frequency: number

	constructor(args: {
			id?: string,
			startTime?: Date,
			endTime?: Date,
			weekday?: string,
			type?: MeetingType,
			frequency?: number
	} = {}){
		super()
		if(args) {
			this.id = args.id
			this.startTime = args.startTime
			this.endTime = args.endTime
			this.weekday = args.weekday
			this.type = args.type
			this.frequency = args.frequency
		}
	}
}