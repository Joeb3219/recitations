import { Course, MeetingReport } from '@dynrec/common';
import Boom from '@hapi/boom';
import { Between } from 'typeorm';
import { Controller, GetRequest, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(MeetingReport, {
    dataDict: (args: HttpArgs<MeetingReport>) => {
        const { body, currentUser } = args;
        return {
            date: body.date,
            meetingTimes: body.meetingTimes,
            course: body.course,
            feedback: body.feedback,
            studentsPresent: body.studentsPresent,
            problemFeedback: body.problemFeedback,
            creator: body.creator || currentUser,
        };
    },
})
export class MeetingReportController {
    @GetRequest('/course/:courseID/meetingReports/date/:date')
    async getMeetingsAtTime({
        params,
        currentUser,
        ability,
    }: HttpArgs<never, { courseID: string; date: string }>): Promise<MeetingReport> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        const report = await MeetingReport.findOne({
            course,
            creator: currentUser,
            date: new Date(params.date),
        });

        if (!report) {
            throw Boom.notFound('No report found');
        }

        if (!ability.can('create', report) && !ability.can('view', report)) {
            throw Boom.unauthorized('Unauthorized to fetch report');
        }

        return report;
    }

    @GetRequest('/course/:courseID/meetingReports/range/:start/:end')
    async getMeetingReportsInRange({
        params,
        ability,
    }: HttpArgs<never, { courseID: string; start: string; end: string }>): Promise<MeetingReport[]> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.existsOnCourse('view', 'reports', course)) {
            throw Boom.unauthorized('Unauthorized to view reports');
        }

        return MeetingReport.find({
            course,
            date: Between(new Date(params.start), new Date(params.end)),
        });
    }
}
