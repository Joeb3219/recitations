import { Type } from 'class-transformer';
import { MeetingType } from '../enums';
import { MeetingTime } from '../models';

export class Meeting<Type extends MeetingType = MeetingType> {
    @Type(() => MeetingTime)
    meetingTime: MeetingTime;

    meetingType: Type;

    date: Date;

    constructor(args: Partial<Meeting> = {}) {
        Object.assign(this, args);
    }
}
