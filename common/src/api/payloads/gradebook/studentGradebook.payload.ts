import { Type } from 'class-transformer';
import { Meeting } from '../../../models/index';

export class StudentGradebookPayload {
    @Type(() => Meeting)
    meeting: Meeting;

    attended: boolean;
    didQuiz: boolean;
}
