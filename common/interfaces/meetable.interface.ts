import { MeetingTimeInterface } from './meetingTime.interface';

export interface MeetableInterface {
    id: string;
    meetingTimes?: MeetingTimeInterface[];
}
