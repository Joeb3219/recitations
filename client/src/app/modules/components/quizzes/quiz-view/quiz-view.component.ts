import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    Quiz,
    QuizElementAnswerInterface,
    QuizElementId,
    QuizElementItem,
    QuizElementResponsePayload,
} from '@dynrec/common';

export type EditElementPayload = {
    element: QuizElementItem;
    index: number;
};

@Component({
    selector: 'app-quiz-view',
    templateUrl: './quiz-view.component.html',
    styleUrls: ['./quiz-view.component.scss'],
})
export class QuizViewComponent implements OnInit {
    @Input() quiz: Quiz;
    @Output() editElement: EventEmitter<EditElementPayload> = new EventEmitter<EditElementPayload>();
    @Input() showEditButtons: boolean = false;

    @Input() answers?: QuizElementAnswerInterface[];
    @Output() answersUpdated: EventEmitter<QuizElementAnswerInterface[]> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {
        if (!this.answers) {
            this.answers = this.quiz.elements.map<QuizElementAnswerInterface>(element => ({
                elementId: element.elementId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response: this.defaultResponse(element.elementId) as any,
            }));
        }
    }

    defaultResponse<ElementId extends QuizElementId = QuizElementId>(
        elementId: ElementId
    ): QuizElementResponsePayload['response'] {
        switch (elementId) {
            case 'free_response':
                return { response: '' };
            case 'multiple_choice':
                return { selections: [] as string[] };
            default:
                throw new Error('Undefined response');
        }
    }

    handleEditElement(element: QuizElementItem, index: number) {
        this.editElement.emit({ element, index });
    }

    handleResponseChanged(index: number, response: QuizElementResponsePayload) {
        if (!this.answers) {
            return;
        }

        this.answers[index].response = response;
        this.answersUpdated.emit(this.answers);
    }
}
