import { CourseSettings } from '../interfaces/courseSetting.interface';

export const DefaultCourseSettings: CourseSettings = {
    semester_start_date: {
        type: 'date',
        key: 'semester_start_date',
        name: 'Semester Start Date',
        section: 'dates',
        default: undefined,
        description: 'This is the date that the semester starts on. This date is used in week computations.',
    },
    semester_end_date: {
        type: 'date',
        key: 'semester_end_date',
        name: 'Semester End Date',
        section: 'dates',
        default: undefined,
        description:
            'This is the date that the semester ends on. This date is used to determine when to stop course events.',
    },
};
