import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form, FormFieldUpdated } from '@models/forms/form';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-form-modal',
    templateUrl: './form-modal.component.html',
    styleUrls: ['./form-modal.component.scss'],
})
export class FormModalComponent {
    @Input() form: Form;

    @Input() title: string;

    @Input() submitText: string;

    @Input() showModal: boolean;

    @Input() forceClose: Observable<void> = new Observable();

    @Input() modalSize = 'lg';

    @Output() onSubmit: EventEmitter<any> = new EventEmitter();

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    @Output() onFieldChange: EventEmitter<{
        name: string;
        value: any;
    }> = new EventEmitter();

    forceFormSubmit: Subject<any> = new Subject<any>();

    handleOnSubmit(val): void {
        this.onSubmit.emit(val);
    }

    handleOnClose(): void {
        this.onClose.emit(null);
    }

    handleOnFieldChange(val: FormFieldUpdated): void {
        this.onFieldChange.emit(val);
    }

    handleModalSubmit(): void {
        this.forceFormSubmit.next();
    }
}
