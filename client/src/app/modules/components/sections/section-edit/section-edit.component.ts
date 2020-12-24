import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, Section } from '@dynrec/common';
import { SectionService } from '@services/section.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-section-edit',
    templateUrl: './section-edit.component.html',
    styleUrls: ['./section-edit.component.scss'],
})
export class SectionEditComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() section: Section;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(private sectionService: SectionService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    ngOnChanges(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();
        this.form.inputs = [
            {
                type: 'text',
                name: 'sectionNumber',
                value: this.section ? this.section.sectionNumber : null,
                label: 'Section Number',
            },
            {
                type: 'text',
                name: 'index',
                value: this.section ? this.section.index : null,
                label: 'Index Number',
            },
            {
                type: 'user',
                name: 'ta',
                value: this.section ? this.section.ta : null,
                label: 'TA',
            },
            {
                type: 'user',
                name: 'instructor',
                value: this.section ? this.section.instructor : null,
                label: 'Instructor',
            },
            {
                type: 'meetingTimes',
                name: 'meetingTimes',
                meetable: this.section,
                label: 'Meeting Times',
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(section: Section): Promise<void> {
        // We apply any fields from the object, and then any from the overwritten data
        // This allows us to submit a new object with the changes between this.section and section, without
        // having to commit them to the real copy before we've sent to the database
        const updatedSection = Object.assign({}, this.section, section);
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await (await this.sectionService.upsertSection(updatedSection)).data;

            // and now we store the ground truth back in our real object
            Object.assign(this.section, result);

            this.toastr.success('Successfully edited section');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to edit section');
        }
    }
}
