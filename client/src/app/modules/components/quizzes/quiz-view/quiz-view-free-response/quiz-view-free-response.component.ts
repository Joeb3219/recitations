import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quiz, QuizElementItem, QuizElementResponsePayload } from '@dynrec/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-quiz-view-free-response',
    templateUrl: './quiz-view-free-response.component.html',
    styleUrls: ['./quiz-view-free-response.component.scss'],
})
export class QuizViewFreeResponseComponent implements OnInit {
    @Input() quiz: Quiz;
    @Input() element: QuizElementItem<'free_response'>;

    @Input() response?: QuizElementResponsePayload<'free_response'>['response'];
    @Output() responseChanged: EventEmitter<
        QuizElementResponsePayload<'free_response'>['response']
    > = new EventEmitter();

    constructor(private readonly toastr: ToastrService) {}

    ngOnInit(): void {
        this.response = this.response ?? { response: '' };
    }

    handleResponseUpdated() {
        if (!this.response?.response) {
            return;
        }

        this.responseChanged.emit(this.response);
    }
}
