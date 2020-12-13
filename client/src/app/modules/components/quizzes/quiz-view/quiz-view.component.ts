import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quiz, QuizElementItem } from '@dynrec/common';

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

    constructor() {}

    ngOnInit(): void {}

    handleEditElement(element: QuizElementItem, index: number) {
        this.editElement.emit({ element, index });
    }
}
