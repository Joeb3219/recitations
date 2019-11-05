import { CourseInterface } from './course.interface'
import { UserInterface } from './user.interface'
import { MeetingType } from '../enums/meetingType.enum'

export interface SectionInterface {

	index: string;			// The index code of this section
	sectionNumber: string;	// The string numerically identifying this section.

	students: UserInterface[]; 		// All of the students registered to this section

	ta?: UserInterface; 	// the TA for the section
	professor?: UserInterface;		// the professor for the section

	meetingTimes: {
		startTime: Date;
		endTime: Date;
		weekday: string;
		type: MeetingType;
	}[]

	createdBy: UserInterface;		// The user who created the section

	// mongo specific
	_id: string;			// the document id
	createdAt: Date;		// when the document was created
	updatedAt: Date;		// when the document was last modified

}