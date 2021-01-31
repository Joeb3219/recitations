import { Course, MeetingReport, StudentGradebookPayload, StudentMeetingReport } from '@dynrec/common';
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
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });

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

        const studentReports = await StudentMeetingReport.find({ course, creator: currentUser });
        const attendanceReports = await MeetingReport.find({ course });

        // and now we can generate the gradebook entries
        return userMeetings.map(meeting => ({
            meeting,
            attended: !!attendanceReports.find(
                report =>
                    report.meetingTimes.find(time => userMeetingTimeIds.includes(time.id)) &&
                    dayjs(report.date).isSame(meeting.date) &&
                    report.studentsPresent.find(student => student.id === currentUser.id)
            ),
            didQuiz: !!studentReports.find(
                report => dayjs(report.date).isSame(meeting.date) && report.meetingTime.id === meeting.meetingTime.id
            ),
        }));
    }
}
