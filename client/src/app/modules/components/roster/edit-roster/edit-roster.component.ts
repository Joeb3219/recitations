import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, Form, FormFieldUpdated, RosterFormatPayload } from '@dynrec/common';
import { RosterService } from '@services/roster.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

type FormData = { formatId?: string; file?: string };

@Component({
    selector: 'app-edit-roster',
    templateUrl: './edit-roster.component.html',
    styleUrls: ['./edit-roster.component.scss'],
})
export class EditRosterComponent implements OnInit {
    @Input()
    course: Course;

    @Input() isVisible: boolean;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    form: Form<FormData>;

    formData: FormData = {};

    rosterFormats?: RosterFormatPayload[];

    verificationText?: string;

    constructor(private readonly rosterService: RosterService, private readonly toastr: ToastrService) {}

    ngOnInit(): void {
        this.generateForm();
        this.loadRosterFormats();
    }

    async loadRosterFormats() {
        const result = await this.rosterService.getRosterFormats();
        this.rosterFormats = result.data;
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form<FormData>();

        this.form.inputs = [
            {
                type: 'select',
                options: this.rosterFormats?.map(format => ({ value: format.id, label: format.name })) ?? [],
                name: 'formatId',
                value: this.formData.formatId,
                label: 'Roster Type',
                row: 0,
                col: 0,
                hidden: !this.rosterFormats || this.rosterFormats.length === 0,
            },
            {
                type: 'file',
                name: 'file',
                value: this.formData.file,
                label: 'Roster File',
                course: this.course,
                hidden: !this.formData.formatId,
                row: 1,
                col: 0,
            },
            {
                type: 'textBlock',
                name: undefined,
                label: 'Verification',
                row: 2,
                col: 0,
                hidden: !this.formData.file || !this.verificationText,
                value: this.verificationText,
            },
        ];
    }

    onFieldChanged(data: FormFieldUpdated<FormData>) {
        this.formData[data.name] = data.value;

        if (data.name === 'file') {
            this.loadVerification();
        }

        this.generateForm();
    }

    async loadVerification() {
        if (!this.formData.file || !this.formData.formatId) {
            this.verificationText = undefined;
            return;
        }

        try {
            const payload = await this.rosterService.updateRoster(
                this.course,
                this.formData.formatId,
                this.formData.file
            );

            const updates = payload.data.updates;
            const groups = _.groupBy(updates, u => u.moveType);

            this.verificationText = `This roster will cause ${groups.created?.length ?? 0} students to be added, ${
                groups.deleted?.length ?? 0
            } students to be removed, and ${groups.moved?.length ?? 0} students to change sections.`;
        } catch (err) {
            this.toastr.error('Failed to process uploaded roster');
        }

        this.generateForm();
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(formData: FormData): Promise<void> {
        if (!this.formData.formatId || !this.formData.file) {
            this.toastr.error('Cannot update roster without the roster format and file.');
            return;
        }

        try {
            await this.rosterService.updateRoster(this.course, this.formData.formatId, this.formData.file, false);
            this.toastr.success('Successfully updated roster');
            this.forceClose.next();
            this.handleClose();
        } catch (err) {
            this.toastr.error('Failed to update roster');
        }
    }
}
