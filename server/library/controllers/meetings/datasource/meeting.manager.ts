import { Course, dateRange, Meeting, MeetingType } from '@dynrec/common';
import _ from 'lodash';
import { AllMeetingSources } from './index';

export interface MeetingDataSourceConfig {
    course: Course;
    dates: Date[];
}

export class MeetingManager {
    static async getMeetings(course: Course): Promise<Meeting<MeetingType>[]> {
        // TODO: restructure the types of the settings so we don't have to cast like this.
        const semesterStartDate = new Date(course.getSetting('semester_start_date').value ?? '');
        const semesterEndDate = new Date(course.getSetting('semester_end_date').value ?? '');

        const meetings = await Promise.all(
            AllMeetingSources.map(async MeetingSourceClass => {
                const sourceInstance = new MeetingSourceClass();
                return sourceInstance.getPotentialMeetingDates({
                    course,
                    dates: dateRange(semesterStartDate ?? new Date(), semesterEndDate ?? new Date()),
                });
            })
        );

        return _.flatten(meetings);
    }
}
