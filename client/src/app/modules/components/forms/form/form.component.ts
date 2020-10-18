import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { Form, FormFieldUpdated } from '@models/forms/form';
import Quill from 'quill';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    @ViewChild('submitButton', { static: false }) submitButton: ElementRef;

    @Input() form: Form;

    @Input() showSubmit = true; // Whether or not to show the submit button. Generally true, save for places like when placed in a modal.

    @Input() forceSubmit: Observable<boolean>; // If provided, can be used to forcefully submit the form, regardless of user intention

    @Output() onSubmit: EventEmitter<{
        [key: string]: unknown;
    }> = new EventEmitter();

    @Output() onFieldChange: EventEmitter<
        FormFieldUpdated
    > = new EventEmitter();

    internalStore: { [key: string]: unknown } = {};

    Array = Array;

    rowLayouts: { [key: string]: number[] } = {};

    pageNumber = 0; // which page number of the form are we currently executing?

    defaultWYSIWYGModules = {
        formula: true,
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],

            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript and subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent and indent

            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme

            ['formula', 'link', 'image', 'video'], // link and image, video
        ],
    };

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

        this.form.inputs.forEach((input) => {
            this.internalStore[input.name ?? 'unknown'] = input.value;
        });
    }

    // Generates an array where each index is a row, and the value of the index is how many columns that row has
    recomputeLayout(): void {
        this.rowLayouts = {};

        // Each group will have its own layouts per group
        this.form.inputGroups.forEach((group) => {
            // Find all inputs on this page
            const inputs = this.form.inputs.filter(
                (input) =>
                    input.group === group.name ||
                    (group.name === '' && !input.group)
            );

            this.rowLayouts[group.name ?? 'unknown'] = [1]; // By default, we have a 1x1 grid, and will fill it out more as needed

            inputs.forEach((input) => {
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
                        ...Array(
                            input.row + 1 - this.rowLayouts[groupName].length
                        ).fill(1),
                    ];

                // And now we increment the column if needed
                if (input.col + 1 > this.rowLayouts[groupName][input.row])
                    this.rowLayouts[groupName][input.row] = input.col + 1;
            });
        });
    }

    // When an editor is created, we pass back the value we wish to save into it in addition to the editor
    // we then can format the content and then set the contents
    // Why not do this beforehand? It seems they don't support it very well.
    // This approach is documented here: https://github.com/KillerCodeMonkey/ngx-quill/issues/77
    wysiwygCreated(value: string, editor: Quill): void {
        const contents = editor.clipboard.convert({ html: value });
        editor.setContents(contents);
    }

    nextPage(): void {
        if (this.form.pages.length > this.pageNumber + 1) this.pageNumber += 1;
        else this.submit();
    }

    prevPage(): void {
        if (this.form.pages.length && this.pageNumber > 0) this.pageNumber -= 1;
    }

    fieldUpdatedWysiwyg(
        name: string,
        data: { target?: { value: any } } | any
    ): void {
        const value = (data.target?.value ?? data).html;
        this.internalStore[name] = value;

        this.onFieldChange.emit({
            name,
            value,
        });
    }

    fieldUpdated(name: string, data: { target?: { value: any } } | any): void {
        const value = data.target?.value ?? data;
        Object.assign(this.internalStore, { [name]: value });

        this.onFieldChange.emit({
            name,
            value,
        });
    }

    submit(): void {
        this.onSubmit.emit(this.internalStore);
    }
}
