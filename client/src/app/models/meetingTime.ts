import { MeetingTimeInterface } from '@interfaces/meetingTime.interface'
import { User } from '@models/user'
import { MeetingType } from '@enums/meetingType.enum'

export class MeetingTime implements MeetingTimeInterface {
	constructor(
		public startTime: Date = null,
		public endTime: Date = null,
		public weekday: string = '',
		public type: MeetingType = null,
		public frequency: number = 0
	){}
}