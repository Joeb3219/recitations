import { Entity, Column, BaseEntity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'

import { MeetingTimeInterface } from '@interfaces/meetingTime.interface'
import { User } from '@models/user'
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

	@OneToOne(type => User, { eager: true })
    @JoinColumn()
	public leader?: User

	@Column({
		type: "enum",
		enum: MeetingType,
		default: MeetingType.RECITATION
	})
	public type: MeetingType

	@Column()
	public frequency: number

	constructor(args: {
			id?: string,
			startTime?: string,
			endTime?: string,
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