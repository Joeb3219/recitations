import {
    Course,
    CourseGradebookEntryPayload,
    CourseGradebookEntryScorePayload,
    GradebookOverride,
    Meeting,
    MeetingReport,
    StudentGradebookPayload,
    StudentMeetingReport,
    User,
} from '@dynrec/common';
import Boom from '@hapi/boom';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Controller, GetRequest } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';
import { MeetingManager } from './meetings/datasource/meeting.manager';

@Controller
export class GradebookController {
    private getStudentEntry(data: {
        user: User;
        meetingReports: StudentMeetingReport[];
        attendanceReports: MeetingReport[];
        meetings: Meeting[];
        overrides: GradebookOverride[];
        userMeetingTimeIds: string[];
    }): CourseGradebookEntryPayload {
        const { user, meetingReports, attendanceReports, meetings, overrides, userMeetingTimeIds } = data;

        const userMeetings = _.sortBy(
            meetings.filter(meeting => userMeetingTimeIds.includes(meeting.meetingTime.id)),
            meeting => meeting.date
        );

        const scores = userMeetings.map<CourseGradebookEntryScorePayload>(meeting => {
            const userOverrides = overrides.filter(
                override =>
                    override.userOverrides.find(
                        uOverride =>
                            uOverride.user.id === user.id &&
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

            const fullReport = attendanceReports.find(
                rep =>
                    rep.meetingTimes.find(time => userMeetingTimeIds.includes(time.id)) &&
                    dayjs(rep.date).isSame(meeting.date)
            );

            // const fullReport = report ? await MeetingReport.findOne({ id: report.id }) : undefined;

            const feedback = meetingReports.find(
                fullReport =>
                    dayjs(fullReport.date).isSame(meeting.date) && fullReport.meetingTime.id === meeting.meetingTime.id
            );

            const attendanceOverridden = userOverrides.find(override => override.overrideAttendance);
            const quizOverridden = userOverrides.find(override => override.overrideQuiz);

            const didAttend =
                fullReport?.studentsPresent.find(student => student.id === user.id) ?? attendanceOverridden;
            const didQuiz = feedback ?? quizOverridden;

            return {
                date: meeting.date,
                score: (didAttend ? 4 : 0) + (didQuiz ? 1 : 0),
            };
        });

        // and now we can generate the gradebook entries
        return {
            studentId: user.username,
            scores,
        };
    }

    @GetRequest('/gradebook/:courseID')
    async getCourseGradebook({
        params,
        ability,
    }: HttpArgs<never, { courseID: string }>): Promise<CourseGradebookEntryPayload[]> {
        const course = await Course.findOne(
            { id: params.courseID },
            { relations: ['sections', 'sections.students'], cache: MeetingManager.CACHE_DURATION }
        );

        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.existsOnCourse('view', 'roster', course)) {
            throw Boom.unauthorized('Unauthorized to fetch roster.');
        }

        const meetings = await MeetingManager.getMeetings(course);

        // Create list of all students
        const sectionUsers = _.compact(_.flatten((course.sections ?? []).map(section => section.students)));

        const meetingReports = await StudentMeetingReport.createQueryBuilder('smr')
            .where({ course })
            .leftJoinAndSelect('smr.meetingTime', 'meetingTime')
            .getMany();
        const attendanceReports = await MeetingReport.createQueryBuilder('mr')
            .where({ course })
            .leftJoinAndSelect('mr.meetingTimes', 'meetingTimes')
            .leftJoinAndSelect('mr.studentsPresent', 'studentsPresent')
            .getMany();
        const allOverrides = await GradebookOverride.find({ where: { course } });

        return sectionUsers.map(user => {
            const userMeetingTimeIds = _.flatten(
                (course.sections ?? [])
                    .filter(section => section.students?.find(student => student.id === user.id))
                    .map(section => (section.meetingTimes ?? []).map(time => time.id))
            );

            return this.getStudentEntry({
                user,
                meetings,
                attendanceReports,
                meetingReports,
                userMeetingTimeIds,
                overrides: allOverrides,
            });
        });
    }

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
        const userMeetings = meetings.filter(
            meeting => userMeetingTimeIds.includes(meeting.meetingTime.id) && dayjs().isAfter(meeting.date)
        );

        const studentReports = await StudentMeetingReport.createQueryBuilder('smr')
            .where({ course, creator: currentUser })
            .leftJoinAndSelect('smr.meetingTime', 'meetingTime')
            .getMany();
        const attendanceReports = await MeetingReport.createQueryBuilder('mr')
            .where({ course })
            .leftJoinAndSelect('mr.meetingTimes', 'meetingTimes')
            .getMany();
        const allOverrides = await GradebookOverride.find({ where: { course } });
        // and now we can generate the gradebook entries
        return Promise.all(
            userMeetings.map<Promise<StudentGradebookPayload>>(async meeting => {
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

                const fullReport = report ? await MeetingReport.findOne({ id: report.id }) : undefined;

                const feedback = studentReports.find(
                    fullReport =>
                        dayjs(fullReport.date).isSame(meeting.date) &&
                        fullReport.meetingTime.id === meeting.meetingTime.id
                );

                const attendanceOverridden = overrides.find(override => override.overrideAttendance);
                const quizOverridden = overrides.find(override => override.overrideQuiz);

                return {
                    meeting,
                    // eslint-disable-next-line no-nested-ternary
                    attended: fullReport
                        ? // eslint-disable-next-line no-nested-ternary
                          fullReport.studentsPresent.find(student => student.id === currentUser.id)
                            ? 'present'
                            : attendanceOverridden
                            ? 'overriden'
                            : 'absent'
                        : 'unsubmitted',
                    // eslint-disable-next-line no-nested-ternary
                    didQuiz: feedback ? 'complete' : quizOverridden ? 'overriden' : 'incomplete',
                };
            })
        );
    }
}
