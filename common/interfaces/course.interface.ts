import { SectionInterface } from './section.interface'
import { UserInterface } from './user.interface'

export interface CourseInterface {

	id: string;			// the document id
	
	name: string; 			// name of the course
	department: string;		// department of the course
	courseCode: string; 	// an identifier for the course, either a number or code of some sort

}