import { MeetingType } from '@enums/meetingType.enum';
import { UserInterface } from '@interfaces/user.interface';
import { MeetableInterface } from '@interfaces/meetable.interface';

export interface MeetingTimeInterface {
    id: string;
    startTime: string;
    endTime: string;
    weekday: string;
    type: MeetingType;
    frequency: number;
    leader?: UserInterface;
    meetable: MeetableInterface;
}
