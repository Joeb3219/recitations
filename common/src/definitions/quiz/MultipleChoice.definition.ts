import { Form } from '../../models/forms/form';
import { QuizElement, QuizElementId } from './QuizElement.definition';

export interface MultipleChoiceOption {
    label: string;
    value: string;
    correctAnswer: boolean;
}

export interface MultipleChoiceSettingsPayload {
    question: string;
    options: MultipleChoiceOption[];
    maxNumberSelections: number;
    minNumberSelections: number;
    allowPartialCredit: boolean;
}

export interface MultipleChoiceDataPayload {
    selections: string[];
}

export class MultipleChoice extends QuizElement<MultipleChoiceSettingsPayload, MultipleChoiceDataPayload> {
    id: QuizElementId = 'multiple_choice';
    name = 'Multiple Choice';
    description: 'Ask students to choose one of several responses to a question. Can be graded.';

    public getInitialState = () => ({
        question: '',
        options: [],
        maxNumberSelections: 1,
        minNumberSelections: 1,
        allowPartialCredit: false,
    });

    public getConfigForm = (config?: MultipleChoiceSettingsPayload) => {
        const form = new Form();

        console.log(config);

        form.inputs = [
            {
                name: 'question',
                label: 'Question',
                type: 'text',
                value: config?.question ?? '',
                row: 0,
                col: 0,
            },
            {
                name: 'options',
                label: 'Options',
                type: 'multiChoiceOptions',
                value: config?.options ?? [],
                row: 1,
                col: 0,
            },
            {
                name: 'maxNumberSelections',
                label: 'Maximum number of selections',
                type: 'number',
                value: config?.maxNumberSelections ?? 1,
                row: 2,
                col: 0,
            },
            {
                name: 'minNumberSelections',
                label: 'Minimum number of selections',
                type: 'number',
                value: config?.maxNumberSelections ?? 1,
                row: 2,
                col: 1,
            },
            {
                name: 'allowPartialCredit',
                label: 'Allow Partial Credit',
                type: 'select',
                options: [
                    { label: 'Allow', value: true },
                    { label: 'Disallow', value: false },
                ],
                value: config?.allowPartialCredit ?? true,
                row: 2,
                col: 2,
            },
        ];

        return form;
    };

    public validateSubmission = (config: MultipleChoiceSettingsPayload, payload: MultipleChoiceDataPayload) => {
        const validSelections = payload.selections.filter(id => !!config.options.find(option => option.value === id));

        if (
            validSelections.length > config.maxNumberSelections ||
            validSelections.length < config.minNumberSelections
        ) {
            return false;
        }

        if (validSelections.length !== payload.selections.length) {
            return false;
        }

        return true;
    };

    public getSubmissionScore = (config: MultipleChoiceSettingsPayload, payload: MultipleChoiceDataPayload) => {
        // Get list of all correct values
        const correctValues = config.options.filter(option => option.correctAnswer);
        // If we only allow n responses of which m are correct, whichever is smaller is the biggest number of correct answers needed for a 100.
        const maxCorrect = Math.min(correctValues.length, config.maxNumberSelections);

        // Fetch the number of selections which map to correct responses.
        const numCorrectSelected = payload.selections.filter(
            id => !!correctValues.find(correct => correct.value === id)
        ).length;

        if (config.allowPartialCredit) {
            return Math.min(1, numCorrectSelected / maxCorrect);
        }

        return numCorrectSelected >= maxCorrect ? 1 : 0;
    };
}
