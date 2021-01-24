import { FreeResponse } from './FreeResponse.definition';
import { MultipleChoice } from './MultipleChoice.definition';
import { QuizElementId } from './QuizElement.definition';
export * from './FreeResponse.definition';
export * from './MultipleChoice.definition';
export * from './QuizElement.definition';

export function getQuizElementDefinition<ElementId extends QuizElementId>(elementId: ElementId) {
    switch (elementId) {
        case 'free_response':
            return new FreeResponse();
        case 'multiple_choice':
            return new MultipleChoice();
        default:
            throw new Error('No definition found');
    }
}
