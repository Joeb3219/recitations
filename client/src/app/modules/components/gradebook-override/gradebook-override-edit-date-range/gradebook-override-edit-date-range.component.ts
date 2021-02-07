import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, GradebookDateRangeOverride } from '@dynrec/common';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-gradebook-override-edit-date-range',
    templateUrl: './gradebook-override-edit-date-range.component.html',
    styleUrls: ['./gradebook-override-edit-date-range.component.scss'],
})
export class GradebookOverrideEditDateRangeComponent implements OnInit {
    @Input() dateRange: GradebookDateRangeOverride;

    @Input() isVisible: boolean;

    @Output() onChange: EventEmitter<GradebookDateRangeOverride> = new EventEmitter<GradebookDateRangeOverride>();

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(private toastr: ToastrService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    ngOnChanges(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();

        if (!this.dateRange) {
            return;
        }

        this.form.inputs = [
            {
                type: 'date',
                name: 'start',
                value: this.dateRange.start,
                label: 'Start',
                row: 0,
                col: 0,
            },

            {
                type: 'date',
                name: 'end',
                value: this.dateRange.end,
                label: 'End',
                row: 0,
                col: 0,
            },
        ];
    }

    handleClose(): void {
        this.onChange.emit(this.dateRange);
    }

    async formSubmitted(range: GradebookDateRangeOverride): Promise<void> {
        Object.assign(this.dateRange, range);
        this.forceClose.next();
    }
}
