import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StandardResponseInterface } from '@interfaces/http/standardResponse.interface';
import { MeetingTime } from '@models/meetingTime';
import { UpsertRequest } from '../decorators';

@Injectable()
export class MeetingTimeService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<MeetingTime>(MeetingTime)
    public async upsertMeetingTime(
        meetingtime: MeetingTime
    ): Promise<StandardResponseInterface<MeetingTime>> {
        throw new Error('Decorator Overloading Failed');
    }
}
