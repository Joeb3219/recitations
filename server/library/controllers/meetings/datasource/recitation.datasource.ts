import { Meeting, MeetingTime, MeetingType, Section } from '@dynrec/common';
import dayjs from 'dayjs';
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
        const { coverageRequests } = config;

        return _.flatten(
            config.dates.map(date => {
                return meetingTimes
                    .filter(time => time.canOccurOnDate(date))
                    .map(time => {
                        const meetingDate = time.getStartTime(date);
                        return new Meeting<MeetingType.RECITATION>({
                            meetingTime: new MeetingTime({ ...time, meetable: section }),
                            meetingType: MeetingType.RECITATION,
                            date: meetingDate,
                            meetingIdentifier: `Section ${section.sectionNumber}`,
                            leader:
                                coverageRequests.find(
                                    request =>
                                        dayjs(request.date).isSame(meetingDate) &&
                                        request.meetingTime.id === time.id &&
                                        !!request.coveredBy
                                )?.coveredBy ?? time.leader,
                        });
                    });
            })
        );
    }
}
