import {
    CourseInterface,
    MeetableInterface,
    UserInterface,
} from '../interfaces';

export interface SectionInterface extends MeetableInterface {
    id: string; // the document id

    index: string; // The index code of this section
    sectionNumber: string; // The string numerically identifying this section.

    // students: UserInterface[]; 		// All of the students registered to this section

    course: CourseInterface; // the course that the section belongs to

    ta?: UserInterface; // the TA for the section
    instructor?: UserInterface; // the instructor for the section
    students?: UserInterface[]; // the students for the section
}
