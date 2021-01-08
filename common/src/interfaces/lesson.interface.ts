import { Course } from '../models/course';
import { LessonPlan } from '../models/lessonPlan';
import { MeetingTime } from '../models/meetingTime';
import { Quiz } from '../models/quiz';

export interface LessonInterface {
    id: string;
    beginDate: Date;
    endDate: Date;

    lessonPlan: LessonPlan;
    meetingTime?: MeetingTime | null;
    course: Course;
    quiz?: Quiz | null;
}
