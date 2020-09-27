import { Meetable } from '@models/meetable';
import { LessonPlan } from '@models/lessonPlan';
import { Course } from '@models/course';

export class Form{
	constructor(
		public inputGroups: {
			name?: string,
			label?: string,
			page?: number,
		}[] = [{
			name: '',
			label: '',
			page: 0,
		}],
		public pages: {
			number?: number,
			label?: string,
			continueButton?: string;
			previousButton?: string;
		}[] = [{
			number: 0,
			label: '',
			continueButton: 'Submit',
			previousButton: ''
		}],
		public inputs: {
			group?: string,
			name?: string,
			options?: {}[]
			label?: string,
			type?: string,
			value?: any,
			meetable?: Meetable,
			lessonPlan?: LessonPlan
			formatted?: any,
			row?: number,
			col?: number,
			hidden?: boolean,
			disabled?: boolean,
			course?: Course,
		}[] = []
	){}
}