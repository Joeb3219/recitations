import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form, FormFieldUpdated } from '@dynrec/common';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-form-modal',
    templateUrl: './form-modal.component.html',
    styleUrls: ['./form-modal.component.scss'],
})
export class FormModalComponent<T> {
    @Input() form: Form<T>;

    @Input() title: string;

    @Input() submitText: string;

    @Input() showModal: boolean;

    @Input() forceClose: Observable<void> = new Observable();

    @Input() modalSize = 'lg';

    @Input() loading: boolean = false;

    @Output() onSubmit: EventEmitter<T> = new EventEmitter();

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    @Output() onFieldChange: EventEmitter<{
        name: keyof T;
        value: T[keyof T];
    }> = new EventEmitter();

    forceFormSubmit: Subject<boolean> = new Subject<boolean>();

    handleOnSubmit(val: T): void {
        this.onSubmit.emit(val);
    }

    handleOnClose(): void {
        this.onClose.emit();
    }

    handleOnFieldChange(val: FormFieldUpdated<T>): void {
        this.onFieldChange.emit(val);
    }

    handleModalSubmit(): void {
        this.forceFormSubmit.next();
    }
}
