import { Meetable, MeetingTime } from '../models';

export class Meeting {
    meetingTime: MeetingTime;

    meetable: Meetable;

    date: Date;

    constructor(args: Partial<Meeting> = {}) {
        Object.assign(this, args);
    }
}
