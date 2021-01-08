import { CourseInterface } from './course.interface';
import { MeetingTimeInterface } from './meetingTime.interface';
import { UserInterface } from './user.interface';

export interface CoverageRequestInterface {
    id: string;
    date: Date;
    meetingTime: MeetingTimeInterface;
    reason?: string;
    coveredBy?: UserInterface | null;
    course: CourseInterface;
}
