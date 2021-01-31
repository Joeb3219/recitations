import { Course, LessonPlan, Meetable, User } from '../../models';

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
    | 'date'
    | 'learningGoals'
    | 'multiChoiceOptions'
    | 'file'
    | 'textBlock'
    | 'lessonPlan'
    | 'quiz'
    | 'abilities'
    | 'roster'
    | 'checkbox';

type Undefinable<T> = { [P in keyof T]?: never };

interface ProblemInput {
    course: Course;
}

interface MeetingTimeInput {
    meetable: Meetable;
}

interface LessonPlanStepsInput {
    lessonPlan: LessonPlan;
}

interface WysiwygInput {
    formatted: any;
}

interface LearningGoalsInput {
    course: Course;
}

interface AbilitiesInput {
    abilities: string[];
}

interface UserInput {
    multi?: boolean;
}

interface RosterInput {
    users?: User[];
    course: Course;
}

export type FormInput<InputType extends FormInputType = FormInputType, G extends any = any> = {
    group?: string;
    name?: keyof G & string;
    options?: { label: string; value: any }[];
    label?: string;
    type: InputType;
    value?: any;
    row?: number;
    col?: number;
    hidden?: boolean;
    disabled?: boolean;
} & (InputType extends 'problem' ? ProblemInput : Undefinable<ProblemInput>) &
    (InputType extends 'meetingTimes' ? MeetingTimeInput : Undefinable<MeetingTimeInput>) &
    (InputType extends 'lessonPlanSteps' ? LessonPlanStepsInput : Undefinable<LessonPlanStepsInput>) &
    (InputType extends 'learningGoals' ? LearningGoalsInput : Undefinable<LearningGoalsInput>) &
    (InputType extends 'abilities' ? AbilitiesInput : Undefinable<AbilitiesInput>) &
    (InputType extends 'user' ? UserInput : Undefinable<UserInput>) &
    (InputType extends 'lessonPlan' ? ProblemInput : Undefinable<ProblemInput>) &
    (InputType extends 'quiz' ? ProblemInput : Undefinable<ProblemInput>) &
    (InputType extends 'roster' ? RosterInput : Undefinable<RosterInput>) &
    (InputType extends 'wysiwyg' ? WysiwygInput : Undefinable<WysiwygInput>);

export interface FormFieldUpdated<T extends any = any> {
    name: keyof T;
    value: T[keyof T];
}

export class Form<T extends any = any> {
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
        public inputs: FormInput<FormInputType, T>[] = []
    ) {}
}
