import { CourseInterface } from './course.interface';

export interface LearningGoalInterface {
    name: string;
    number: string;
    description: string;
    // eslint-disable-next-line no-use-before-define
    category: LearningGoalCategoryInterface;
}

export interface LearningGoalCategoryInterface {
    name: string;
    number: string;
    goals: LearningGoalInterface[];
    course: CourseInterface; // the course that the section belongs to
}
