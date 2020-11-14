import { CourseInterface, UserInterface } from '../interfaces';

export interface ProblemInterface {
    id: string;

    difficulty?: number; // How hard, on a scale of 1 to n, is this problem?
    name: string; // What is this problem called?
    question: string; // What question are we actually asking?
    solution: string; // What is the solution?
    estimatedDuration: number; // How long will this take, in minutes?

    creator?: UserInterface; // Who made this problem?
    course: CourseInterface; // What course does this problem belong to?
}
