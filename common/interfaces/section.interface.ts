import { CourseInterface } from '@interfaces/course.interface'
import { UserInterface } from '@interfaces/user.interface'
import { MeetingTimeInterface } from '@interfaces/meetingTime.interface'

export interface SectionInterface {

	id: string;			// the document id

	index: string;			// The index code of this section
	sectionNumber: string;	// The string numerically identifying this section.

	// students: UserInterface[]; 		// All of the students registered to this section

	course: CourseInterface; 	// the course that the section belongs to 

	ta?: UserInterface; 	// the TA for the section
	professor?: UserInterface;		// the professor for the section
	students?: UserInterface[];		// the students for the section

	meetingTimes?: MeetingTimeInterface[];

}