import { CourseInterface } from '@interfaces/course.interface';
import { UserInterface } from '@interfaces/user.interface';
import { LessonPlanStepInterface } from '@interfaces/lessonPlanStep.interface';

export interface LessonPlanInterface {
    id: string;

    name: string; // What is this lesson plan called?
    steps?: LessonPlanStepInterface[]; // What steps are in this lesson plan?

    creator?: UserInterface; // Who made this problem?
    course: CourseInterface; // What course does this problem belong to?
}
