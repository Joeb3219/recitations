import { Course, Meeting, MeetingType } from '@dynrec/common';
import * as Boom from '@hapi/boom';
import { Controller, GetRequest } from '../../decorators';
import { HttpArgs } from '../../helpers/route.helper';
import { MeetingManager } from './datasource/meeting.manager';

@Controller
export class MeetingController {
    @GetRequest('/course/:courseID/meetings')
    async getMeetings({ params }: HttpArgs<any, { courseID: string }>): Promise<Meeting<MeetingType>[]> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        return MeetingManager.getMeetings(course);
    }
}
