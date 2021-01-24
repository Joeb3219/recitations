import { Course, MeetingType, Section, StudentMeetingReport } from '@dynrec/common';
import Boom from '@hapi/boom';
import dayjs from 'dayjs';
import { Brackets } from 'typeorm';
import { Controller, Resource } from '../decorators';
import { GetRequest, PostRequest } from '../decorators/request.decorator';
import { HttpArgs } from '../helpers/route.helper';
import { MeetingManager } from './meetings/datasource/meeting.manager';

const dataDict = (args: HttpArgs<StudentMeetingReport>) => {
    const { body, currentUser } = args;
    return {
        answers: body.answers,
        meetingTime: body.meetingTime,
        quiz: body.quiz,
        date: body.date,
        course: body.course,
        creator: body.creator || currentUser,
    };
};

@Controller
@Resource(
    StudentMeetingReport,
    {
        sortable: {
            dataDictionary: {
                course: report => report.course.name,
                creator: report => `${report.creator.firstName} ${report.creator.lastName}`,
            },
        },
        searchable: ['name'],
        dataDict,
    },
    ['get']
)
export class StudentMeetingReportController {
    @PostRequest('/studentmeetingreport')
    async createStudentMeetingReport(args: HttpArgs<StudentMeetingReport & { code: string }>) {
        const { code } = args.body;
        const data = dataDict(args);

        const course = await Course.findOne({ id: data.course?.id }, { relations: ['sections'] });

        if (!data.course?.id || !course || !data.meetingTime || !data.date) {
            throw Boom.badRequest('Invalid quiz data.');
        }

        if (!args.ability.can('create', new StudentMeetingReport({ ...data, course }))) {
            throw Boom.unauthorized('Unauthorized to answer quiz.');
        }

        const meeting = await MeetingManager.getMeeting(course, data.meetingTime, new Date(data.date));
        if (
            !meeting ||
            meeting.getAccessCode() !== code ||
            dayjs(meeting.date).isAfter(data.date) ||
            !meeting.canTakeQuiz(course)
        ) {
            throw Boom.badRequest('Invalid access code.');
        }

        // Now we try to find the existing feedback
        const existingFeedback = await StudentMeetingReport.findOne({
            creator: { id: args.currentUser.id },
            date: new Date(data.date),
            meetingTime: { id: meeting.meetingTime.id },
        });

        if (existingFeedback) {
            existingFeedback.answers = data.answers ?? [];
            return existingFeedback.save();
        }

        return StudentMeetingReport.create(data).save();
    }

    @GetRequest('/course/:courseID/quiz/:date/code/:code')
    async getQuizAtTime({
        params,
        currentUser,
    }: HttpArgs<{ code: string }, { courseID: string; date: string; code: string }>): Promise<StudentMeetingReport> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        const assignedSection = await Section.createQueryBuilder('s')
            .leftJoinAndSelect('s.meetingTimes', 'meetingTimes')
            .leftJoinAndSelect('s.students', 'student')
            .andWhere(new Brackets(qb => qb.where('student.id = :id', { id: currentUser.id })))
            .getOne();

        const assignedMeetingTime = assignedSection?.meetingTimes?.find(time => time.type === MeetingType.RECITATION);

        if (!assignedMeetingTime) {
            throw Boom.notFound('No assigned meeting found.');
        }

        const meetings = await MeetingManager.getMeetingWithLessons(
            course,
            meeting =>
                meeting.meetingTime.id === assignedMeetingTime.id && dayjs(meeting.date).isSame(new Date(params.date))
        );

        const meeting = meetings[0];

        if (meetings.length !== 1 || !meeting?.lesson?.quiz) {
            throw Boom.notFound('No lessons for this time');
        }

        if (!meeting.canTakeQuiz(course)) {
            throw Boom.badRequest('Cannot take this quiz yet');
        }

        if (meeting.getAccessCode() !== params.code) {
            console.log({ real: meeting.getAccessCode() });
            throw Boom.badRequest('Wrong access code');
        }

        // Now we try to find the existing feedback
        const feedback = await StudentMeetingReport.findOne({
            creator: { id: currentUser.id },
            date: new Date(params.date),
            meetingTime: { id: meeting.meetingTime.id },
        });

        return (
            feedback ??
            new StudentMeetingReport({
                course,
                meetingTime: meeting.meetingTime,
                quiz: meeting.lesson.quiz,
                date: meeting.date,
                answers: [],
            })
        );
    }
}
