import { Entity, Column, BaseEntity, ManyToOne, JoinTable, PrimaryGeneratedColumn } from 'typeorm'

import { MeetingTimeInterface } from '@interfaces/meetingTime.interface'
import { User } from '@models/user'
import { Meetable } from '@models/meetable'
import { MeetingType } from '@enums/meetingType.enum'

@Entity()
export class MeetingTime extends BaseEntity implements MeetingTimeInterface {

	@PrimaryGeneratedColumn("uuid")
	public id: string

	@Column({
		type: "time"
	})
	public startTime: string

	@Column({
		type: "time"
	})
	public endTime: string

	@Column()
	public weekday: string

	@ManyToOne(type => User, { eager: true })
	@JoinTable()
	public leader?: User

	@Column({
		type: "enum",
		enum: MeetingType,
		default: MeetingType.RECITATION
	})
	public type: MeetingType

	@Column()
	public frequency: number

	@ManyToOne(type => Meetable, meetable => meetable.meetingTimes)
	@JoinTable()
	public meetable: Meetable

	constructor(args: {
			id?: string,
			startTime?: string,
			endTime?: string,
			weekday?: string,
			type?: MeetingType,
			frequency?: number,
			leader?: User,
			meetable?: Meetable,
	} = {}){
		super()
		if(args) {
			this.id = args.id
			this.startTime = args.startTime
			this.endTime = args.endTime
			this.weekday = args.weekday
			this.type = args.type
			this.frequency = args.frequency
			this.leader = args.leader
			this.meetable = args.meetable
		}
	}
}