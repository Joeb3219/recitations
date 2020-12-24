import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultipleChoiceOption } from '@dynrec/common';
import { v4 } from 'uuid';

@Component({
    selector: 'app-multiple-choice',
    templateUrl: './multiple-choice.component.html',
    styleUrls: ['./multiple-choice.component.scss'],
})
export class MultipleChoiceComponent implements OnInit {
    @Input() options: MultipleChoiceOption[] = [];

    @Input() name?: string = undefined;

    @Output() onChange: EventEmitter<MultipleChoiceOption[]> = new EventEmitter<MultipleChoiceOption[]>();

    constructor() {}

    ngOnInit(): void {}

    handleDeleteOption(index: number) {
        this.options.splice(index, 1);
        this.onChange.emit(this.options);
    }

    handleAddOption() {
        this.options.push({ value: v4(), label: '', correctAnswer: false });
        this.onChange.emit(this.options);
    }

    handleOptionUpdated(index: number, field: keyof MultipleChoiceOption, data: { target?: { value: any } } | any) {
        const value = data.target?.value ?? data;

        if (!this.options[index]) {
            return;
        }

        (this.options[index][field] as any) = value;
    }
}
