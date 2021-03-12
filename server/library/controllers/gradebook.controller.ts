import {
    Course,
    GradebookOverride,
    MeetingReport,
    StudentGradebookPayload,
    StudentMeetingReport,
} from '@dynrec/common';
import Boom from '@hapi/boom';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Controller, GetRequest } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';
import { MeetingManager } from './meetings/datasource/meeting.manager';

@Controller
export class GradebookController {
    @GetRequest('/gradebook/:courseID/me')
    async getGradebook({
        currentUser,
        params,
        ability,
    }: HttpArgs<never, { courseID: string }>): Promise<StudentGradebookPayload[]> {
        const course = await Course.findOne(
            { id: params.courseID },
            { relations: ['sections'], cache: MeetingManager.CACHE_DURATION }
        );

        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.existsOnCourse('view', 'gradebook', course)) {
            throw Boom.unauthorized('Unauthorized to fetch personal gradebook');
        }

        const sections = _.flatten(
            (course.sections ?? []).filter(section => section.students?.find(s => s.id === currentUser.id))
        );

        const userMeetingTimeIds = _.flatten(
            sections.map(section => (section.meetingTimes ?? []).map(time => time.id))
        );

        const meetings = await MeetingManager.getMeetings(course);
        const userMeetings = meetings.filter(meeting => userMeetingTimeIds.includes(meeting.meetingTime.id));

        const studentReports = await StudentMeetingReport.find({
            where: { course, creator: currentUser },
            cache: MeetingManager.CACHE_DURATION,
        });
        const attendanceReports = await MeetingReport.find({ where: { course }, cache: MeetingManager.CACHE_DURATION });
        const allOverrides = await GradebookOverride.find({ where: { course }, cache: MeetingManager.CACHE_DURATION });

        // and now we can generate the gradebook entries
        return userMeetings.map(meeting => {
            const overrides = allOverrides.filter(
                override =>
                    override.userOverrides.find(
                        uOverride =>
                            uOverride.user.id === currentUser.id &&
                            uOverride.meetingTime.id === meeting.meetingTime.id &&
                            dayjs(uOverride.date).isSame(meeting.date)
                    ) ||
                    override.meetingOverrides.find(
                        mOverride =>
                            mOverride.meetingTime.id === meeting.meetingTime.id &&
                            dayjs(mOverride.date).isSame(meeting.date)
                    ) ||
                    override.dateRangeOverrides.find(
                        drOverride =>
                            dayjs(drOverride.start).isBefore(meeting.date) &&
                            dayjs(drOverride.end).isAfter(meeting.date)
                    )
            );

            const report = attendanceReports.find(
                rep =>
                    rep.meetingTimes.find(time => userMeetingTimeIds.includes(time.id)) &&
                    dayjs(rep.date).isSame(meeting.date)
            );

            const feedback = studentReports.find(
                report => dayjs(report.date).isSame(meeting.date) && report.meetingTime.id === meeting.meetingTime.id
            );

            const attendanceOverridden = overrides.find(override => override.overrideAttendance);
            const quizOverridden = overrides.find(override => override.overrideQuiz);

            return {
                meeting,
                // eslint-disable-next-line no-nested-ternary
                attended: report
                    ? // eslint-disable-next-line no-nested-ternary
                      report.studentsPresent.find(student => student.id === currentUser.id)
                        ? 'present'
                        : attendanceOverridden
                        ? 'overriden'
                        : 'absent'
                    : 'unsubmitted',
                // eslint-disable-next-line no-nested-ternary
                didQuiz: feedback ? 'complete' : quizOverridden ? 'overriden' : 'incomplete',
            };
        });
    }
}
