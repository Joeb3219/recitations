import { CourseInterface } from '../interfaces/course.interface';
import { MeetingTimeInterface } from '../interfaces/meetingTime.interface';
import { UserInterface } from '../interfaces/user.interface';

export interface MeetingOverride {
    date: Date;
    meetingTime: MeetingTimeInterface;
}

export interface DateRangeOverride {
    start: Date;
    end: Date;
}

export interface UserOverride {
    user: UserInterface;
    date: Date;
    meetingTime: MeetingTimeInterface;
}

export interface GradebookOverrideInterface {
    id: string;

    dateRangeOverrides: DateRangeOverride[];
    meetingOverrides: MeetingOverride[];
    userOverrides: UserOverride[];

    reason: string;
    overrideAttendance?: boolean;
    overrideQuiz?: boolean;

    course: CourseInterface;
    creator: UserInterface;
}
