import { MeetingTime } from '@dynrec/common';
import { Controller, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource<MeetingTime>(
    MeetingTime,
    {
        dataDict: (args: HttpArgs<MeetingTime>) => {
            const { body } = args;
            return {
                startTime: body.startTime,
                endTime: body.endTime,
                weekday: body.weekday,
                type: body.type,
                frequency: body.frequency,
                leader: body.leader,
            };
        },
    },
    ['create', 'delete', 'get', 'update']
)
export class MeetingTimeController {}
