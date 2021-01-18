import { Course } from '../models/course';
import { MeetingTime } from '../models/meetingTime';
import { User } from '../models/user';

export interface ProblemFeedbackInterface {
    problem: string;
    completed: boolean;
    duration: number;
    receptivity: number;
    comments?: string;
}

export interface MeetingReportInterface {
    id: string;
    date: Date;

    meetingTimes: MeetingTime[];
    course: Course;

    feedback: string;
    studentsPresent: User[];
    problemFeedback: ProblemFeedbackInterface[];
    creator: User;
}
