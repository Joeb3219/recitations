import { Form } from '../../models/forms/form';

export type QuizElementId = 'multiple_choice' | 'free_response';

export abstract class QuizElement<SettingsPayload extends any = any, DataPayload extends any = never> {
    abstract id: QuizElementId;
    abstract name: string;
    abstract description: string;

    abstract getInitialState: () => SettingsPayload;
    abstract getConfigForm: (existingConfig?: SettingsPayload) => Form;
    abstract validateSubmission: (config: SettingsPayload, payload: DataPayload) => boolean;
    abstract getSubmissionScore: ((config: SettingsPayload, payload: DataPayload) => number) | undefined;
}
