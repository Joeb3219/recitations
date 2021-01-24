/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { Course, CourseSemesterDescriptor, MeetingType, Weekdays } from '@dynrec/common';
import axios from 'axios';
import _ from 'lodash';
import { MeetingTimeDescriptor, SectionDatasource, SectionDescriptor, SectionSourceType } from './section.datasource';

interface SOC_Course {
    subjectNotes?: any;
    courseNumber: string;
    subject: string;
    campusCode: string;
    openSections: number;
    synopsisUrl: string;
    subjectGroupNotes?: any;
    offeringUnitCode: string;
    offeringUnitTitle?: any;
    title: string;
    courseDescription?: any;
    preReqNotes?: string;
    sections: SOC_Section[];
    supplementCode: string;
    credits?: number;
    unitNotes?: any;
    coreCodes: SOC_CoreCode[];
    courseNotes?: string;
    expandedTitle?: string;
}

interface SOC_CoreCode {
    id: string;
    subject: string;
    year: string;
    description: string;
    term: string;
    code: string;
    coreCode: string;
    coreCodeDescription: string;
    lastUpdated: number;
    unit: string;
    effective: string;
    coreCodeReferenceId: string;
    offeringUnitCode: string;
    course: string;
    offeringUnitCampus: string;
    supplement: string;
}

interface SOC_Section {
    sectionEligibility?: any;
    sessionDatePrintIndicator: string;
    examCode: string;
    specialPermissionAddCode?: string;
    crossListedSections: (SOC_CrossListedSection | SOC_CrossListedSection)[];
    sectionNotes?: null | string | string;
    specialPermissionDropCode?: any;
    instructors: SOC_Instructor[];
    number: string;
    majors: (SOC_Major | SOC_Major)[];
    sessionDates?: any;
    specialPermissionDropCodeDescription?: any;
    subtopic?: any;
    openStatus: boolean;
    comments: (SOC_Comment | SOC_Comment)[];
    minors: (SOC_Minor | SOC_Minor)[];
    campusCode: string;
    index: string;
    unitMajors: SOC_UnitMajor[][];
    printed: string;
    specialPermissionAddCodeDescription?: string;
    subtitle?: null | string | string;
    meetingTimes: SOC_MeetingTime[];
    legendKey?: any;
    honorPrograms: SOC_Minor[];
}

interface SOC_MeetingTime {
    campusLocation?: string;
    baClassHours?: string;
    roomNumber?: null | string | string;
    pmCode?: string;
    campusAbbrev?: string;
    campusName?: string;
    meetingDay?: string;
    buildingCode?: null | string | string;
    startTime?: string;
    endTime?: string;
    meetingModeDesc: string;
    meetingModeCode: string;
}

interface SOC_UnitMajor {
    unitCode: string;
    majorCode: string;
}

interface SOC_Minor {
    code: string;
}

interface SOC_Comment {
    code: string;
    description: string;
}

interface SOC_Major {
    code: string;
    isUnitCode: boolean;
    isMajorCode: boolean;
}

interface SOC_Instructor {
    name: string;
}

interface SOC_CrossListedSection {
    courseNumber: string;
    supplementCode: string;
    sectionNumber: string;
    offeringUnitCampus: string;
    primaryRegistrationIndex: string;
    offeringUnitCode: string;
    registrationIndex: string;
    subjectCode: string;
}

export class RutgersSocDatasource extends SectionDatasource {
    id: SectionSourceType = 'rutgers_soc';
    name = 'Rutgers SOC';
    description = 'The Schedule of Classes for Rutgers University';

    // Fetches the course data from the SOC api.
    async fetchSOC(query: {
        subject: string;
        semester: string;
        campus: 'NB' | 'CA' | 'NK';
        level: 'UG' | 'G';
    }): Promise<SOC_Course[]> {
        const { subject, semester, campus, level } = query;
        const url = `https://sis.rutgers.edu/oldsoc/courses.json?subject=${subject}&semester=${semester}&campus=${campus}&level=${level}`;
        const result = await axios.get<SOC_Course[]>(url);

        return result.data;
    }

    semesterToSocCode = (descriptor: CourseSemesterDescriptor) => {
        switch (descriptor.term) {
            case 'Fall':
                return `9${descriptor.year}`;
            case 'Winter':
                return `0${descriptor.year}`;
            case 'Spring':
                return `1${descriptor.year}`;
            case 'Summer':
                return `7${descriptor.year}`;
            default:
                return '11776';
        }
    };

    private timeFormat(time: number) {
        const timeStr = `${time}`.padStart(4, '0');
        return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}:00`;
    }

    private processMeetingTime(meetingTime: SOC_MeetingTime): MeetingTimeDescriptor | undefined {
        // for now, we are only dealing with recitations.
        if (meetingTime.meetingModeDesc !== 'RECIT') {
            return undefined;
        }

        let startTime = parseInt(meetingTime.startTime ?? '1200', 10);
        let endTime = parseInt(meetingTime.endTime ?? '1200', 10);
        if (meetingTime.pmCode === 'P') {
            if (startTime < 1200) startTime += 1200;
            if (endTime < 1200) endTime += 1200;
        } else if (endTime < startTime) endTime += 1200;

        const weekdayMap: { [key: string]: Weekdays } = {
            M: 'monday',
            T: 'tuesday',
            W: 'wednesday',
            TH: 'thursday',
            F: 'friday',
            SA: 'saturday',
            SU: 'sunday',
        };

        // For now, we are not bothering to copy over location information.
        // After COVID, we will revisit this.
        return {
            frequency: 1,
            type: MeetingType.RECITATION,
            weekday: meetingTime.meetingDay ? weekdayMap[meetingTime.meetingDay] ?? 'sunday' : 'sunday',
            startTime: this.timeFormat(startTime),
            endTime: this.timeFormat(endTime),
        };
    }

    private createDefaultMeetingTime(): MeetingTimeDescriptor {
        return {
            frequency: 1,
            type: MeetingType.RECITATION,
            weekday: 'monday',
            startTime: this.timeFormat(1200),
            endTime: this.timeFormat(1255),
        };
    }

    private processSection(section: SOC_Section): SectionDescriptor | undefined {
        const meetingTimes = _.compact(section.meetingTimes.map(time => this.processMeetingTime(time)));

        if (!meetingTimes.find(m => m.type === MeetingType.RECITATION)) {
            meetingTimes.push(this.createDefaultMeetingTime());
        }

        return {
            index: section.index,
            sectionNumber: section.number,
            meetingTimes,
        };
    }

    fetchSections = async (course: Course) => {
        const soc = await this.fetchSOC({
            subject: course.department,
            semester: this.semesterToSocCode(course.semester),
            campus: 'NB',
            level: 'UG',
        });

        // First we find the course within the SOC data
        const courseData = soc.find(socCourse => socCourse.courseNumber === course.courseCode);
        if (!courseData) {
            return [];
        }

        // Now we can process individual sections
        return _.compact(courseData.sections.map(section => this.processSection(section)));
    };
}
