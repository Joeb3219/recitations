import { Meeting, MeetingType, Section } from '@dynrec/common';
import _ from 'lodash';
import { MeetingDataSource } from './meeting.datasource';
import { MeetingDataSourceConfig } from './meeting.manager';

export class RecitationMeetingDataSource extends MeetingDataSource<MeetingType.RECITATION> {
    async getPotentialMeetingDates(config: MeetingDataSourceConfig): Promise<Meeting<MeetingType.RECITATION>[]> {
        const sections = config.course.sections ?? [];

        const sectionMeetings = await Promise.all(
            sections.map(async section => this.getSectionMeetingTimes(section, config))
        );

        return _.flatten(sectionMeetings);
    }

    private async getSectionMeetingTimes(
        section: Section,
        config: MeetingDataSourceConfig
    ): Promise<Meeting<MeetingType.RECITATION>[]> {
        const meetingTimes = section.meetingTimes?.filter(time => time.type === MeetingType.RECITATION) ?? [];

        return _.flatten(
            config.dates.map(date => {
                return meetingTimes
                    .filter(time => time.canOccurOnDate(date))
                    .map(
                        time =>
                            new Meeting<MeetingType.RECITATION>({
                                meetingTime: time,
                                meetingType: MeetingType.RECITATION,
                                date: time.getStartTime(date),
                            })
                    );
            })
        );
    }
}
