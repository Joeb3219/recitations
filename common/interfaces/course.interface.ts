import { SectionInterface } from './section.interface'
import { UserInterface } from './user.interface'

export interface CourseInterface {

	name: string; 			// name of the course
	department: string;		// department of the course
	courseCode: string; 	// an identifier for the course, either a number or code of some sort

	sections: SectionInterface[];	// All of the sections in the course

	createdBy: UserInterface;		// The user who created the course

	// mongo specific
	_id: string;			// the document id
	createdAt: Date;		// when the document was created
	updatedAt: Date;		// when the document was last modified

}