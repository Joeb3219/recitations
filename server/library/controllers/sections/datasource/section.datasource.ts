import { Course, MeetingTime, Section } from '@dynrec/common';
export type SectionSourceType = 'rutgers_soc' | '';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MeetingTimeDescriptor
    extends Pick<MeetingTime, 'frequency' | 'type' | 'weekday' | 'startTime' | 'endTime'> {}
export interface SectionDescriptor extends Pick<Section, 'index' | 'sectionNumber'> {
    meetingTimes: MeetingTimeDescriptor[];
}

export abstract class SectionDatasource {
    abstract id: SectionSourceType;
    abstract name: string;
    abstract description: string;

    abstract fetchSections: (course: Course) => Promise<SectionDescriptor[]>;
}
