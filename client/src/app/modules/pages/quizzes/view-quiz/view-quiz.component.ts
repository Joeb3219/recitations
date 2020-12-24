import { Component, Input, OnInit } from '@angular/core';
import { Quiz } from '@dynrec/common';
import { LoadedArg } from '../../../../decorators/input.decorator';
import { QuizService } from '../../../../services/quiz.service';

@Component({
    selector: 'app-view-quiz',
    templateUrl: './view-quiz.component.html',
    styleUrls: ['./view-quiz.component.scss'],
})
export class ViewQuizComponent implements OnInit {
    @LoadedArg(QuizService, Quiz, 'quizID')
    @Input()
    quiz: Quiz;

    constructor() {}

    ngOnInit(): void {}
}
