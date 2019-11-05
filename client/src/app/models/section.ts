import { SectionInterface } from '@interfaces/section.interface'
import { User } from '@models/user'
import { MeetingType } from '@enums/meetingType.enum'

export class Section implements SectionInterface{
	constructor(
		public index: string = '',
		public sectionNumber: string = '',
		public students: User[] = [], 
		public ta: User = null,
		public professor: User = null,
		public meetingTimes: {
			startTime: Date;
			endTime: Date;
			weekday: string;
			type: MeetingType;
		}[] = [],
		public createdBy: User = null,
		public _id: string = '',
		public createdAt: Date = null,
		public updatedAt: Date = null
	){}
}