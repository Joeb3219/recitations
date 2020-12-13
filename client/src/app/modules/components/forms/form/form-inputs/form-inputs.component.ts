import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormFieldUpdated, FormInput } from '@dynrec/common';

@Component({
    selector: 'app-form-inputs',
    templateUrl: './form-inputs.component.html',
    styleUrls: ['./form-inputs.component.scss'],
})
export class FormInputsComponent {
    @Input() input: FormInput;
    @Input() disabled: boolean;
    @Output() onFieldChange: EventEmitter<FormFieldUpdated> = new EventEmitter();

    Editor = ClassicEditor;

    fieldUpdatedWysiwyg(name: string | number | symbol | undefined, { editor }: ChangeEvent): void {
        if (!name) {
            return;
        }

        this.onFieldChange.emit({
            name,
            value: editor.getData(),
        });
    }

    fieldUpdated(name: string | number | symbol | undefined, data: { target?: { value: any } } | any): void {
        if (!name) {
            return;
        }

        const value = data.target?.value ?? data;

        // This is hella hacky, we need a better solution to this later.
        const resolvedValue = value === '_INVALID_OPTION_' ? undefined : value;

        this.onFieldChange.emit({
            name,
            value: resolvedValue,
        });
    }
}
