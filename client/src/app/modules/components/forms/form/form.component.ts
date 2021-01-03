import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Form, FormFieldUpdated } from '@dynrec/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FormComponent<T> implements OnInit {
    @ViewChild('submitButton', { static: false }) submitButton: ElementRef;

    @Input() form: Form<T>;

    @Input() showSubmit = true; // Whether or not to show the submit button. Generally true, save for places like when placed in a modal.

    @Input() forceSubmit: Observable<boolean>; // If provided, can be used to forcefully submit the form, regardless of user intention

    @Output() onSubmit: EventEmitter<T> = new EventEmitter();

    @Output() onFieldChange: EventEmitter<FormFieldUpdated> = new EventEmitter();

    internalStore: Partial<T> = {};

    Array = Array;

    rowLayouts: { [key: string]: number[] } = {};

    pageNumber = 0; // which page number of the form are we currently executing?

    ngOnInit(): void {
        if (this.forceSubmit) {
            this.forceSubmit.subscribe({
                next: () => {
                    setTimeout(() => this.submitButton.nativeElement.click());
                },
            });
        }

        this.loadDefaultFormData();
    }

    ngOnChanges(): void {
        this.loadDefaultFormData();
    }

    loadDefaultFormData(): void {
        if (!this.form) return;

        this.recomputeLayout();

        // First, we load in the defaults
        this.form.inputs.forEach(input => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.internalStore as any)[(input.name ?? 'unknown') as string] = input.value;
        });
    }

    // Generates an array where each index is a row, and the value of the index is how many columns that row has
    recomputeLayout(): void {
        this.rowLayouts = {};

        // Each group will have its own layouts per group
        this.form.inputGroups.forEach(group => {
            // Find all inputs on this page
            const inputs = this.form.inputs.filter(
                input => input.group === group.name || (group.name === '' && !input.group)
            );

            this.rowLayouts[group.name ?? 'unknown'] = [1]; // By default, we have a 1x1 grid, and will fill it out more as needed

            inputs.forEach(input => {
                const groupName = group.name ?? 'unknown';
                // If there isn't a row or col, we assign 0 to the row and col
                // This will put it into the first grid position
                // eslint-disable-next-line no-param-reassign
                input.row = input.row || 0;
                // eslint-disable-next-line no-param-reassign
                input.col = input.col || 0;

                // Now we insert the row if needed
                // This is done by adding an array of (needed length - current length) filled with 1 to the end of the array.
                if (input.row + 1 > this.rowLayouts[groupName].length)
                    this.rowLayouts[groupName] = [
                        ...this.rowLayouts[groupName],
                        ...Array(input.row + 1 - this.rowLayouts[groupName].length).fill(1),
                    ];

                // And now we increment the column if needed
                if (input.col + 1 > this.rowLayouts[groupName][input.row])
                    this.rowLayouts[groupName][input.row] = input.col + 1;
            });
        });
    }

    handleFieldInput(data: FormFieldUpdated) {
        Object.assign(this.internalStore, { [data.name]: data.value });
        this.onFieldChange.emit(data);
    }

    nextPage(): void {
        if (this.form.pages.length > this.pageNumber + 1) this.pageNumber += 1;
        else this.submit();
    }

    prevPage(): void {
        if (this.form.pages.length && this.pageNumber > 0) this.pageNumber -= 1;
    }

    submit(): void {
        this.onSubmit.emit(this.internalStore as T);
    }
}
