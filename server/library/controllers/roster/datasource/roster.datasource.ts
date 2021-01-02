import { Section, User } from '@dynrec/common';
export type RosterType = 'regis' | 'canvas';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserDescriptor extends Pick<Partial<User>, 'email' | 'username' | 'firstName' | 'lastName'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SectionDescriptor extends Pick<Partial<Section>, 'index' | 'sectionNumber'> {}

export type CourseRosterDataItem = {
    user: UserDescriptor;
    section: SectionDescriptor;
};

export type CourseRosterData = CourseRosterDataItem[];

export abstract class RosterDatasource {
    abstract id: RosterType;
    abstract name: string;
    abstract description: string;
    abstract fileTypes: string[];

    abstract parseRoster: (path: string) => Promise<CourseRosterData> | CourseRosterData;
    abstract validateRoster: (path: string) => Promise<boolean> | boolean;
}
