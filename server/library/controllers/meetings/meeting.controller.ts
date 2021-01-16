import { Course, Lesson, Meeting, MeetingType, MeetingWithLesson, Section } from '@dynrec/common';
import * as Boom from '@hapi/boom';
import dayjs from 'dayjs';
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

    lessonOverlapsDate(lesson: Lesson, date: Date) {
        return dayjs(lesson.beginDate).isBefore(date) && dayjs(lesson.endDate).isAfter(date);
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

        const lessons = await Lesson.find({ course: course });
        const courseMeetings = await MeetingManager.getMeetings(course);

        return courseMeetings
            .filter(meeting => meeting.meetingTime.meetable.id === section.id)
            .map(
                meeting =>
                    new MeetingWithLesson({
                        ...meeting,
                        lesson:
                            lessons.find(
                                lesson =>
                                    lesson.meetingTime?.id === meeting.meetingTime.id &&
                                    this.lessonOverlapsDate(lesson, meeting.date)
                            ) ??
                            lessons.find(
                                lesson => !lesson.meetingTime && this.lessonOverlapsDate(lesson, meeting.date)
                            ),
                    })
            )
            .filter(meeting => !!meeting.lesson);
    }
}
