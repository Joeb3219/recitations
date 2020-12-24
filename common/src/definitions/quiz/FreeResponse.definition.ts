import { Form } from '../../models/forms/form';
import { QuizElement, QuizElementId } from './QuizElement.definition';

export interface FreeResponseSettingsPayload {
    question: string;
    minLength: number;
    responseRequired: boolean;
}

export interface FreeResponseDataPayload {
    response: string;
}

export class FreeResponse extends QuizElement<FreeResponseSettingsPayload, FreeResponseDataPayload> {
    id: QuizElementId = 'free_response';
    name = 'Free Response';
    description: 'Ask students to provide a written response to a question. Can be graded.';

    public getInitialState = () => ({
        question: '',
        minLength: 1,
        responseRequired: true,
    });

    public getConfigForm = (config?: FreeResponseSettingsPayload) => {
        const form = new Form<FreeResponseSettingsPayload>();

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
                name: 'minLength',
                label: 'Minimum Number of Characters',
                type: 'number',
                value: config?.minLength ?? 1,
                row: 1,
                col: 0,
            },
            {
                name: 'responseRequired',
                label: 'Response Required',
                type: 'select',
                options: [
                    { label: 'Required', value: true },
                    { label: 'Optional', value: false },
                ],
                value: config?.responseRequired,
                row: 1,
                col: 1,
            },
        ];

        return form;
    };

    public validateSubmission = (config: FreeResponseSettingsPayload, payload: FreeResponseDataPayload) => {
        if (!config.responseRequired) {
            return true;
        }

        return payload.response?.length >= config.minLength;
    };

    public getSubmissionScore = (config: FreeResponseSettingsPayload, payload: FreeResponseDataPayload) => {
        return this.validateSubmission(config, payload) ? 1 : 0;
    };
}
