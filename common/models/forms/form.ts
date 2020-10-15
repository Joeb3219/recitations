import { Course } from '@models/course';
import { LessonPlan } from '@models/lessonPlan';
import { Meetable } from '@models/meetable';

export type FormInputType =
    | 'text'
    | 'user'
    | 'problem'
    | 'meetingTimes'
    | 'lessonPlanSteps'
    | 'wysiwyg'
    | 'select'
    | 'time'
    | 'number'
    | 'password'
    | 'date';

export interface FormInput {
    group?: string;
    name?: string;
    options?: { label: string; value: any }[];
    label?: string;
    type?: FormInputType;
    value?: any;
    meetable?: Meetable;
    lessonPlan?: LessonPlan;
    formatted?: any;
    row?: number;
    col?: number;
    hidden?: boolean;
    disabled?: boolean;
    course?: Course;
}

export interface FormFieldUpdated {
    name: string;
    value: any;
}

export class Form {
    constructor(
        public inputGroups: {
            name?: string;
            label?: string;
            page?: number;
        }[] = [
            {
                name: '',
                label: '',
                page: 0,
            },
        ],
        public pages: {
            number?: number;
            label?: string;
            continueButton?: string;
            previousButton?: string;
        }[] = [
            {
                number: 0,
                label: '',
                continueButton: 'Submit',
                previousButton: '',
            },
        ],
        public inputs: FormInput[] = []
    ) {}
}
