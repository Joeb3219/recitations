import { CourseInterface } from '@interfaces/course.interface'
import { UserInterface } from '@interfaces/user.interface'
import { MeetingTimeInterface } from '@interfaces/meetingTime.interface'

export interface SectionInterface {

	index: string;			// The index code of this section
	sectionNumber: string;	// The string numerically identifying this section.

	students: UserInterface[]; 		// All of the students registered to this section

	ta?: UserInterface; 	// the TA for the section
	professor?: UserInterface;		// the professor for the section

	meetingTimes: MeetingTimeInterface[]

	createdBy: UserInterface;		// The user who created the section

	// mongo specific
	_id: string;			// the document id
	createdAt: Date;		// when the document was created
	updatedAt: Date;		// when the document was last modified

}