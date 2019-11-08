import { SectionInterface } from '@interfaces/section.interface'
import { User } from '@models/user'
import { MeetingTime } from '@models/meetingTime'

export class Section implements SectionInterface{
	constructor(
		public index: string = '',
		public sectionNumber: string = '',
		public students: User[] = [], 
		public ta: User = null,
		public professor: User = null,
		public meetingTimes: MeetingTime[] = [],
		public createdBy: User = null,
		public _id: string = '',
		public createdAt: Date = null,
		public updatedAt: Date = null
	){}
}