import { CourseController } from './course.controller';
import { CoverageRequestController } from './coverageRequest.controller';
import { LearningGoalController } from './learningGoal.controller';
import { LessonController } from './lesson.controller';
import { LessonPlanController } from './lessonPlan.controller';
import { MeetingReportController } from './meetingReport.controller';
import { MeetingController } from './meetings/meeting.controller';
import { MeetingTimeController } from './meetingTime.controller';
import { ProblemController } from './problem.controller';
import { QuizController } from './quiz.controller';
import { RoleController } from './role.controller';
import { RosterController } from './roster/roster.controller';
import { SectionController } from './sections/section.controller';
import { StudentMeetingReportController } from './studentMeetingReport.controller';
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
    CoverageRequestController,
    LessonController,
    MeetingReportController,
    StudentMeetingReportController,
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
    CoverageRequestController,
    LessonController,
    MeetingReportController,
    StudentMeetingReportController,
];
