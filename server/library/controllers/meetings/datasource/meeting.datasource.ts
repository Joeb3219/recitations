import { Meeting, MeetingType } from '@dynrec/common';
import { MeetingDataSourceConfig } from './meeting.manager';

export abstract class MeetingDataSource<T extends MeetingType> {
    abstract getPotentialMeetingDates(config: MeetingDataSourceConfig): Promise<Meeting<T>[]>;
}
