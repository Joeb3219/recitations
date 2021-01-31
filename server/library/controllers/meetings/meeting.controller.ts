import { Course, Meeting, MeetingType, MeetingWithLesson, Section } from '@dynrec/common';
import * as Boom from '@hapi/boom';
import dayjs from 'dayjs';
import { Controller, GetRequest } from '../../decorators';
import { HttpArgs } from '../../helpers/route.helper';
import { MeetingManager } from './datasource/meeting.manager';

@Controller
export class MeetingController {
    @GetRequest('/course/:courseID/meetings')
    async getMeetings({ params, currentUser }: HttpArgs<any, { courseID: string }>): Promise<Meeting<MeetingType>[]> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        const meetings = await MeetingManager.getMeetings(course);
        return meetings.filter(meeting => meeting.leader?.id === currentUser.id);
    }

    @GetRequest('/section/:sectionID/meetings')
    async getSectionMeetings({
        params,
    }: HttpArgs<never, { sectionID: string }>): Promise<MeetingWithLesson<MeetingType>[]> {
        const section = await Section.findOne({ id: params.sectionID });

        if (!section) {
            throw Boom.notFound('No section found');
        }

        const course = await Course.findOne({ id: section?.course.id }, { relations: ['sections'] });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        return MeetingManager.getMeetingWithLessons(course, meeting => meeting.meetingTime.meetable.id === section.id);
    }

    @GetRequest('/course/:courseID/meetings/:date')
    async getMeetingsAtTime({
        params,
        currentUser,
    }: HttpArgs<never, { courseID: string; date: string }>): Promise<MeetingWithLesson<MeetingType>[]> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        return MeetingManager.getMeetingWithLessons(
            course,
            meeting =>
                (meeting.meetingTime.leader?.id === currentUser.id || meeting.leader?.id === currentUser.id) &&
                dayjs(meeting.date).isSame(new Date(params.date))
        );
    }
}
