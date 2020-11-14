import { MeetableInterface } from './meetable.interface';
import { MeetingTimeInterface } from './meetingTime.interface';
export interface MeetingInterface {
    id: string;
    meetingTime: MeetingTimeInterface;
    meetable: MeetableInterface;
    instanceNumber: number;
    date: Date;
}
