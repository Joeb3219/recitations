import { Type } from 'class-transformer';
import { Meeting } from '../../../models/index';

export class StudentGradebookPayload {
    @Type(() => Meeting)
    meeting: Meeting;

    attended: 'present' | 'absent' | 'unsubmitted' | 'overriden';
    didQuiz: 'complete' | 'incomplete' | 'overriden';
}
