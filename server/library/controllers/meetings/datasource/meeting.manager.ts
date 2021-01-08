import { Course, dateRange, Lesson, Meeting, MeetingType } from '@dynrec/common';
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

        const defaultLessons = await Lesson.find({ course: course, meetingTime: null });

        const range = dateRange(semesterStartDate ?? new Date(), semesterEndDate ?? new Date());
        return range.filter(date =>
            defaultLessons.find(lesson => dayjs(lesson.beginDate).isBefore(date) && dayjs(lesson.endDate).isAfter(date))
        );
    }

    static async getMeetings(course: Course): Promise<Meeting<MeetingType>[]> {
        const meetings = await Promise.all(
            AllMeetingSources.map(async MeetingSourceClass => {
                const sourceInstance = new MeetingSourceClass();
                return sourceInstance.getPotentialMeetingDates({
                    course,
                    dates: await this.getDateRange(course),
                });
            })
        );

        return _.flatten(meetings);
    }
}
