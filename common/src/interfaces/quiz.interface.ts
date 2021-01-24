import { FreeResponseSettingsPayload } from '../definitions/quiz/FreeResponse.definition';
import { MultipleChoiceSettingsPayload } from '../definitions/quiz/MultipleChoice.definition';
import { QuizElementId } from '../definitions/quiz/QuizElement.definition';
import { CourseInterface, UserInterface } from '../interfaces';

export interface QuizElementItem<ElementId extends QuizElementId = QuizElementId> {
    elementId: QuizElementId;
    config: ElementId extends 'multiple_choice' ? MultipleChoiceSettingsPayload : FreeResponseSettingsPayload;
    points: number;
}

export interface QuizInterface {
    id: string;

    name: string;
    elements: QuizElementItem[];

    creator?: UserInterface; // Who made this quiz?
    course: CourseInterface; // What course does this quiz belong to?
}
