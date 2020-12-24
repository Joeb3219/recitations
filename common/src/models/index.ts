export * from './course';
export * from './forms/form';
export * from './learningGoal';
export * from './learningGoalCategory';
export * from './lessonPlan';
export * from './lessonPlanStep';
export * from './meetable';
export * from './meeting';
export * from './meetingTime';
export * from './problem';
export * from './quiz';
export * from './section';
export * from './user';
import { Course } from './course';
import { LearningGoal } from './learningGoal';
import { LearningGoalCategory } from './learningGoalCategory';
import { LessonPlan } from './lessonPlan';
import { LessonPlanStep } from './lessonPlanStep';
import { Meetable } from './meetable';
import { Meeting } from './meeting';
import { MeetingTime } from './meetingTime';
import { Problem } from './problem';
import { Quiz } from './quiz';
import { Section } from './section';
import { User } from './user';

export const AllEntities = [
    Meetable,
    Course,
    LearningGoal,
    LearningGoalCategory,
    LessonPlan,
    LessonPlanStep,
    Meeting,
    MeetingTime,
    Problem,
    Quiz,
    Section,
    User,
];
