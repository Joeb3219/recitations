import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, Form, FormFieldUpdated, SectionSyncFormatPayload } from '@dynrec/common';
import { SectionService } from '@services/section.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

type FormData = { syncFormat?: string };

@Component({
    selector: 'app-sections-sync',
    templateUrl: './sections-sync.component.html',
    styleUrls: ['./sections-sync.component.scss'],
})
export class SectionsSyncComponent implements OnInit {
    @Input() course: Course;

    form: Form<FormData>;
    formData: FormData = {};

    syncFormats?: SectionSyncFormatPayload[];

    @Input() isVisible: boolean;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    constructor(private readonly sectionService: SectionService, private readonly toastr: ToastrService) {}

    ngOnInit(): void {
        this.loadSyncTypes();
    }

    async loadSyncTypes() {
        const result = await this.sectionService.getSyncFormats();
        this.syncFormats = result.data;
        this.generateForm();
    }

    generateForm() {
        if (!this.syncFormats || !this.syncFormats.length) {
            return;
        }

        const selectedFormat = this.syncFormats.find(format => this.formData.syncFormat === format.id);

        this.form = new Form<FormData>();
        this.form.inputs = [
            {
                name: 'syncFormat',
                type: 'select',
                options: this.syncFormats.map(format => ({ value: format.id, label: format.name })),
                label: 'Sync Source',
                value: this.formData.syncFormat,
                row: 0,
                col: 0,
            },
            {
                label: 'Description',
                type: 'textBlock',
                row: 1,
                col: 0,
                hidden: !this.formData.syncFormat || !selectedFormat,
                value: selectedFormat?.description,
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
        if (!this.formData.syncFormat) {
            this.toastr.error('Cannot sync sections without a selected format.');
            return;
        }
        try {
            await this.sectionService.syncSections(this.course, this.formData.syncFormat);
            this.toastr.success('Successfully synced sections');
            this.forceClose.next();
            this.handleClose();
        } catch (err) {
            this.toastr.error('Failed to sync sections');
        }
    }
}
