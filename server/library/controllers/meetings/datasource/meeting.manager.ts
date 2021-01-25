import { Course, dateRange, Lesson, Meeting, MeetingTime, MeetingType, MeetingWithLesson } from '@dynrec/common';
import dayjs from 'dayjs';
import _ from 'lodash';
import { AllMeetingSources } from './index';

export interface MeetingDataSourceConfig {
    course: Course;
    dates: Date[];
}

export class MeetingManager {
    private static async getDateRange(course: Course): Promise<Date[]> {
        // TODO: restructure the types of the settings so we don't have to cast like this.
        const semesterStartDate = new Date(course.getSetting('semester_start_date').value ?? '');
        const semesterEndDate = new Date(course.getSetting('semester_end_date').value ?? '');

        const defaultLessons = await Lesson.createQueryBuilder('e')
            .where(`e.courseId = :course`, { course: course.id })
            .andWhere(`e.meetingTimeId IS NULL`)
            .getMany();

        const range = dateRange(semesterStartDate ?? new Date(), semesterEndDate ?? new Date());

        return range.filter(date => defaultLessons.find(lesson => this.lessonOverlapsDate(lesson, date)));
    }

    static async getMeetings(course: Course): Promise<Meeting<MeetingType>[]> {
        const meetings = await Promise.all(
            AllMeetingSources.map(async MeetingSourceClass => {
                const sourceInstance = new MeetingSourceClass();
                const dates = await this.getDateRange(course);

                return sourceInstance.getPotentialMeetingDates({
                    course,
                    dates,
                });
            })
        );

        return _.flatten(meetings);
    }

    static async getMeeting(course: Course, meetingTime: MeetingTime, date: Date) {
        const meetings = await MeetingManager.getMeetings(course);
        return meetings.find(meeting => dayjs(meeting.date).isSame(date) && meeting.meetingTime.id === meetingTime.id);
    }

    static lessonOverlapsDate(lesson: Lesson, date: Date) {
        return dayjs(lesson.beginDate).isBefore(date) && dayjs(lesson.endDate).isAfter(date);
    }

    static async getMeetingWithLessons(
        course: Course,
        meetingFilter?: (meeting: Meeting) => boolean
    ): Promise<MeetingWithLesson<MeetingType>[]> {
        const lessons = await Lesson.find({ course });
        const courseMeetings = await MeetingManager.getMeetings(course);

        return courseMeetings
            .filter(meeting => (meetingFilter ? meetingFilter(meeting) : true))
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
