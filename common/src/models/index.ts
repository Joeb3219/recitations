export * from './course';
export * from './coverageRequest';
export * from './forms/form';
export * from './learningGoal';
export * from './learningGoalCategory';
export * from './lesson';
export * from './lessonPlan';
export * from './lessonPlanStep';
export * from './meetable';
export * from './meeting';
export * from './meetingReport';
export * from './meetingTime';
export * from './problem';
export * from './quiz';
export * from './role';
export * from './section';
export * from './studentMeetingReport';
export * from './user';
import { Course } from './course';
import { CoverageRequest } from './coverageRequest';
import { LearningGoal } from './learningGoal';
import { LearningGoalCategory } from './learningGoalCategory';
import { Lesson } from './lesson';
import { LessonPlan } from './lessonPlan';
import { LessonPlanStep } from './lessonPlanStep';
import { Meetable } from './meetable';
import { Meeting } from './meeting';
import { MeetingReport } from './meetingReport';
import { MeetingTime } from './meetingTime';
import { Problem } from './problem';
import { Quiz } from './quiz';
import { Role } from './role';
import { Section } from './section';
import { StudentMeetingReport } from './studentMeetingReport';
import { User } from './user';

export const AllEntities = [
    Meetable,
    Section,
    Role,
    Course,
    LearningGoal,
    LearningGoalCategory,
    LessonPlan,
    LessonPlanStep,
    Meeting,
    MeetingTime,
    Problem,
    Quiz,
    User,
    CoverageRequest,
    Lesson,
    MeetingReport,
    StudentMeetingReport,
];
