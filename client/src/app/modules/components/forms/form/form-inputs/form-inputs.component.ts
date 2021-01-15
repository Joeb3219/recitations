import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormFieldUpdated, FormInput } from '@dynrec/common';

@Component({
    selector: 'app-form-inputs',
    templateUrl: './form-inputs.component.html',
    styleUrls: ['./form-inputs.component.scss'],
    encapsulation: ViewEncapsulation.None,
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

    fileUploaded(name: string | undefined, data?: FileList) {
        if (!data || !data.length) {
            return;
        }

        this.fieldUpdated(name, data[0]);
    }

    fieldUpdated(
        name: string | number | symbol | undefined,
        data?: { target?: { value: any } } | FileList | any
    ): void {
        if (!name) {
            return;
        }

        const value = data?.target?.value ?? data;

        // This is hella hacky, we need a better solution to this later.
        const resolvedValue = value === '_INVALID_OPTION_' ? undefined : value;

        this.onFieldChange.emit({
            name,
            value: resolvedValue,
        });
    }
}
