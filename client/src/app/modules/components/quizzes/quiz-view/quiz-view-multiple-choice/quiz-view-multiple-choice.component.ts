import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MultipleChoiceOption, Quiz, QuizElementItem } from '@dynrec/common';
import _ from 'lodash';

@Component({
    selector: 'app-quiz-view-multiple-choice',
    templateUrl: './quiz-view-multiple-choice.component.html',
    styleUrls: ['./quiz-view-multiple-choice.component.scss'],
})
export class QuizViewMultipleChoiceComponent implements OnInit, OnChanges {
    @Input() quiz: Quiz;
    @Input() element: QuizElementItem<'multiple_choice'>;

    shuffledChoices: MultipleChoiceOption[];

    ngOnInit(): void {
        this.shuffle();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.element) {
            this.shuffle();
        }
    }

    shuffle() {
        this.shuffledChoices = _.shuffle(this.element.config.options);
    }
}
