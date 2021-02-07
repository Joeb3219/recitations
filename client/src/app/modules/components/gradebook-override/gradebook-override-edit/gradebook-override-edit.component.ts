import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, GradebookOverride } from '@dynrec/common';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { GradebookOverrideService } from '../../../../services/gradebookOverride.service';

type OverrideFormData = {
    overrides: GradebookOverride;
} & Pick<GradebookOverride, 'reason' | 'overrideAttendance' | 'overrideQuiz'>;

@Component({
    selector: 'app-gradebook-override-edit',
    templateUrl: './gradebook-override-edit.component.html',
    styleUrls: ['./gradebook-override-edit.component.scss'],
})
export class GradebookOverrideEditComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() override?: GradebookOverride;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    form: Form<OverrideFormData>;

    constructor(private overrideService: GradebookOverrideService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    ngOnChanges(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form<OverrideFormData>();

        if (!this.override?.course) {
            return;
        }

        this.form.inputs = [
            {
                type: 'text',
                name: 'reason',
                value: this.override.reason,
                label: 'Reason',
                row: 0,
                col: 0,
            },
            {
                type: 'checkbox',
                name: 'overrideAttendance',
                value: this.override.overrideAttendance,
                label: 'Override Attendance',
                row: 1,
                col: 0,
            },
            {
                type: 'checkbox',
                name: 'overrideQuiz',
                value: this.override.overrideQuiz,
                label: 'Override Quiz',
                row: 1,
                col: 1,
            },
            {
                type: 'override',
                name: 'overrides',
                value: this.override,
                label: 'Overrides',
                row: 2,
                col: 0,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(override: OverrideFormData): Promise<void> {
        // We apply any fields from the object, and then any from the overwritten data
        // This allows us to submit a new object with the changes between this.override and override, without
        // having to commit them to the real copy before we've sent to the database
        const { reason, overrideQuiz, overrideAttendance, overrides } = override;
        const { dateRangeOverrides, userOverrides, meetingOverrides } = overrides;
        const updatedOverride = Object.assign({}, this.override, {
            reason,
            overrideAttendance,
            overrideQuiz,
            dateRangeOverrides,
            userOverrides,
            meetingOverrides,
        });
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await this.overrideService.upsertGradebookOverride(updatedOverride);

            // and now we store the ground truth back in our real object
            Object.assign(this.override, result);

            this.toastr.success('Successfully edited problem');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to edit problem');
        }
    }
}
