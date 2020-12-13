import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quiz } from '@dynrec/common';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { QuizService } from '../../../../services/quiz.service';

@Component({
    selector: 'app-quiz-edit',
    templateUrl: './quiz-edit.component.html',
    styleUrls: ['./quiz-edit.component.scss'],
})
export class QuizEditComponent implements OnInit {
    @Input() isVisible: boolean;
    @Input() quiz: Quiz;

    @Input() title?: string = 'Quiz Builder';
    @Input() submitText?: string = 'Submit Quiz';

    forceClose: Subject<void> = new Subject();

    @Input() modalSize = 'lg';

    @Output() onSubmit: EventEmitter<Quiz> = new EventEmitter();

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    constructor(private readonly quizService: QuizService, private readonly toastr: ToastrService) {}

    ngOnInit(): void {}

    handleSubmit() {
        this.isVisible = false;
        this.onSubmit.emit(this.quiz);
        try {
            this.quizService.upsertQuiz(this.quiz);
            this.toastr.success('Successfully saved quiz');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to save quiz');
        }
    }

    handleOnClose() {
        this.onClose.emit();
        this.isVisible = false;
        this.forceClose.next();
    }
}
