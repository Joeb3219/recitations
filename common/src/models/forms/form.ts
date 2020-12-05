import { Course, LessonPlan, Meetable } from '../../models';

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
    | 'learningGoals';

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

export type FormInput<InputType extends FormInputType = FormInputType> = {
    group?: string;
    name?: string;
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
    (InputType extends 'wysiwyg' ? WysiwygInput : Undefinable<WysiwygInput>);

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
