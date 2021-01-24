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
    recitations_quiz_end: {
        type: 'number',
        key: 'recitations_quiz_end',
        name: 'Stop Acccepting Quizzes after Recitation (minutes)',
        section: 'quizzes',
        default: 60 * 24 * 5,
        description: 'Number of minutes after a recitation starts to allow quizzes to be submitted',
    },
    recitations_quiz_start: {
        type: 'number',
        key: 'recitations_quiz_start',
        name: 'Start Accepting Quizzes after Recitation (minutes)',
        section: 'quizzes',
        default: 50,
        description: 'Number of minutes after a recitation starts to allow quizzes to begin being submitted',
    },
};
