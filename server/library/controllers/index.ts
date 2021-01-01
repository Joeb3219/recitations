import { CourseController } from './course.controller';
import { LearningGoalController } from './learningGoal.controller';
import { LessonPlanController } from './lessonPlan.controller';
import { MeetingController } from './meetings/meeting.controller';
import { MeetingTimeController } from './meetingTime.controller';
import { ProblemController } from './problem.controller';
import { QuizController } from './quiz.controller';
import { RoleController } from './role.controller';
import { RosterController } from './roster/roster.controller';
import { SectionController } from './sections/section.controller';
import { UploadController } from './upload.controller';
import { UserController } from './user.controller';

export {
    CourseController,
    LessonPlanController,
    MeetingController,
    MeetingTimeController,
    ProblemController,
    SectionController,
    UserController,
    LearningGoalController,
    QuizController,
    RosterController,
    UploadController,
    RoleController,
};

export const AllControllers = [
    CourseController,
    LessonPlanController,
    MeetingController,
    MeetingTimeController,
    ProblemController,
    SectionController,
    UserController,
    LearningGoalController,
    QuizController,
    RosterController,
    UploadController,
    RoleController,
];
