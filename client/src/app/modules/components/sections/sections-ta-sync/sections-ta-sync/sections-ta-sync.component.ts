import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, Form, FormFieldUpdated } from '@dynrec/common';
import { SectionService } from '@services/section.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

type FormData = { path?: string };

@Component({
    selector: 'app-sections-ta-sync',
    templateUrl: './sections-ta-sync.component.html',
    styleUrls: ['./sections-ta-sync.component.scss'],
})
export class SectionsTaSyncComponent implements OnInit {
    @Input() course: Course;

    form: Form<FormData>;
    formData: FormData = {};

    @Input() isVisible: boolean;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    constructor(private readonly sectionService: SectionService, private readonly toastr: ToastrService) {}

    ngOnInit() {
        this.generateForm();
    }

    generateForm() {
        this.form = new Form<FormData>();
        this.form.inputs = [
            {
                label: 'Description',
                type: 'textBlock',
                row: 0,
                col: 0,
                value: `CSV must be in the format of "First Name,Last Name,Username,Email,Recitation", one recitation per line. Recitation string should be in the format of "sectionNumber: time".`,
            },
            {
                name: 'path',
                type: 'file',
                label: 'TA File',
                value: this.formData.path,
                course: this.course,
                row: 1,
                col: 0,
            },
        ];
    }

    onFieldChanged(data: FormFieldUpdated<FormData>) {
        this.formData[data.name] = data.value;

        this.generateForm();
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(formData: FormData): Promise<void> {
        if (!this.formData.path) {
            this.toastr.error('Cannot sync TAs without a file upload.');
            return;
        }
        try {
            await this.sectionService.syncTAs(this.course, this.formData.path);
            this.toastr.success('Successfully synced sections');
            this.forceClose.next();
            this.handleClose();
        } catch (err) {
            this.toastr.error('Failed to sync sections');
        }
    }
}
