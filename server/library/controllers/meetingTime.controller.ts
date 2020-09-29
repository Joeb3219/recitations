import { MeetingTime } from '@models/meetingTime';
import { Controller, PostRequest } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class MeetingTimeController {
    @PostRequest('/meetingTime')
    static async createMeetingTime({
        body,
        repo,
    }: HttpArgs): Promise<MeetingTime> {
        // First, we collect all of the submitted data
        const { startTime, endTime, weekday, type, frequency, leader } = body;

        const meetingTime = {
            startTime,
            endTime,
            weekday,
            type,
            frequency,
            leader,
        };

        return repo(MeetingTime).save(meetingTime);
    }
}
