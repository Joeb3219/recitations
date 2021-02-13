import { MeetingType } from '../enums';
import { MeetableInterface, UserInterface } from '../interfaces';

export interface MeetingTimeInterface {
    id: string;
    startTime: string;
    endTime: string;
    weekday: string;
    type: MeetingType;
    frequency: number;
    leader?: UserInterface;
    meetable: MeetableInterface;
    asynchronous?: boolean;
}
