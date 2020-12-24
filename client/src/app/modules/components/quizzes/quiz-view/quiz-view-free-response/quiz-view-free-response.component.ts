import { Component, Input } from '@angular/core';
import { Quiz, QuizElementItem } from '@dynrec/common';

@Component({
    selector: 'app-quiz-view-free-response',
    templateUrl: './quiz-view-free-response.component.html',
    styleUrls: ['./quiz-view-free-response.component.scss'],
})
export class QuizViewFreeResponseComponent {
    @Input() quiz: Quiz;
    @Input() element: QuizElementItem<'free_response'>;
}
