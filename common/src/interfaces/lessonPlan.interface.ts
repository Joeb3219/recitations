import { CourseInterface, LessonPlanStepInterface, UserInterface } from '../interfaces';

export interface LessonPlanInterface {
    id: string;

    name: string; // What is this lesson plan called?
    steps?: LessonPlanStepInterface[]; // What steps are in this lesson plan?

    creator?: UserInterface; // Who made this problem?
    course: CourseInterface; // What course does this problem belong to?
}
