import { FreeResponseDataPayload } from '../definitions/quiz/FreeResponse.definition';
import { MultipleChoiceDataPayload } from '../definitions/quiz/MultipleChoice.definition';
import { QuizElementId } from '../definitions/quiz/QuizElement.definition';
import { CourseInterface } from '../interfaces/course.interface';
import { MeetingTimeInterface } from '../interfaces/meetingTime.interface';
import { QuizInterface } from '../interfaces/quiz.interface';
import { User } from '../models/user';

export type QuizElementResponsePayload<ElementId extends QuizElementId = QuizElementId> = {
    response: ElementId extends 'multiple_choice' ? MultipleChoiceDataPayload : FreeResponseDataPayload;
};

export interface QuizElementAnswerInterface<ElementId extends QuizElementId = QuizElementId> {
    elementId: ElementId;
    response: QuizElementResponsePayload<ElementId>;
}

export interface StudentMeetingReportInterface {
    id: string;
    date: Date;

    meetingTime: MeetingTimeInterface;
    course: CourseInterface;
    quiz: QuizInterface;

    answers: QuizElementAnswerInterface[];

    creator: User;
}
