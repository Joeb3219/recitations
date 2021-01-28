import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MultipleChoiceOption, Quiz, QuizElementItem, QuizElementResponsePayload } from '@dynrec/common';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-quiz-view-multiple-choice',
    templateUrl: './quiz-view-multiple-choice.component.html',
    styleUrls: ['./quiz-view-multiple-choice.component.scss'],
})
export class QuizViewMultipleChoiceComponent implements OnInit, OnChanges {
    @Input() quiz: Quiz;
    @Input() element: QuizElementItem<'multiple_choice'>;

    @Input() response?: QuizElementResponsePayload<'multiple_choice'>['response'];
    @Output() responseChanged: EventEmitter<
        QuizElementResponsePayload<'multiple_choice'>['response']
    > = new EventEmitter();

    shuffledChoices: MultipleChoiceOption[];

    constructor(private readonly toastr: ToastrService) {}

    ngOnInit(): void {
        this.shuffle();
        this.response = this.response ?? { selections: [] };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.element) {
            this.shuffle();
        }
    }

    shuffle() {
        this.shuffledChoices = _.shuffle(this.element.config.options);
    }

    handleResponseToggled(item: MultipleChoiceOption): void {
        if (!this.response) {
            return;
        }

        const foundMatch = this.response.selections.find(selection => selection === item.value);

        if (!foundMatch) {
            if (this.response.selections.length + 1 > this.element.config.maxNumberSelections) {
                this.toastr.error(`Must select at most ${this.element.config.maxNumberSelections} selections`);
                return;
            }

            this.response.selections = [...(this.response.selections ?? []), item.value];
            this.responseChanged.emit(this.response);
        } else {
            if (this.response.selections.length - 1 < this.element.config.minNumberSelections) {
                this.toastr.error(`Must select at least ${this.element.config.minNumberSelections} selections`);
                return;
            }

            this.response.selections = (this.response.selections ?? []).filter(selection => selection !== item.value);
            this.responseChanged.emit(this.response);
        }
    }
}
