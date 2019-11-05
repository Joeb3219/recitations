import { CourseInterface } from '@interfaces/course.interface'
import { User } from '@models/user'
import { Section } from '@models/section'

export class Course implements CourseInterface{
	constructor(
		public name: string = '',
		public department: string = '',
		public courseCode: string = '',
		public sections: Section[] = [],
		public createdBy: User = null,
		public _id: string = '',
		public createdAt: Date = null,
		public updatedAt: Date = null
	){}
}