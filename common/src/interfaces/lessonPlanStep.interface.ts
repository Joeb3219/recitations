import {
    CourseInterface,
    ProblemInterface,
    UserInterface,
} from '../interfaces';

export interface LessonPlanStepInterface {
    id: string;

    // We support two kinds of steps:
    // (1) problems
    // (2) descriptive steps, e.g. to tell students to do something
    // Either a problem will be set, or the title, description, and estimatedDuration will be set.
    title?: string; // What is this lesson plan called?
    description?: string; // Actual instructions for the step
    estimatedDuration?: number; // How long will this take, in minutes?

    type?: 'problem' | 'task';

    problem?: ProblemInterface; // What problem is this step referencing?

    creator?: UserInterface; // Who made this problem?
    course: CourseInterface; // What course does this problem belong to?
}
