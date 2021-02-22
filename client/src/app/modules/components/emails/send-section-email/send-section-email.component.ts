import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, Form, Section } from '@dynrec/common';
import { EmailService } from '@services/email.service';
import { SectionService } from '@services/section.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

type FormData = {
    sectionID: string;
    subject: string;
    body: string;
};

@Component({
    selector: 'app-send-section-email',
    templateUrl: './send-section-email.component.html',
    styleUrls: ['./send-section-email.component.scss'],
})
export class SendSectionEmailComponent implements OnInit {
    @Input() course: Course;
    @Input() isVisible: boolean;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    sections: Section[];

    form: Form<FormData>;

    forceClose: Subject<void> = new Subject<void>();

    constructor(
        private readonly emailService: EmailService,
        private readonly sectionService: SectionService,
        private readonly toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.loadSections();
    }

    async loadSections() {
        if (!this.course) {
            return;
        }
        const result = await this.sectionService.getCourseSections(this.course);
        this.sections = result.data;
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();

        if (!this.course) {
            return;
        }

        const sectionOptions = (this.sections ?? []).map(section => ({
            value: section.id,
            label: `Section ${section.sectionNumber}`,
        }));

        this.form.inputs = [
            {
                type: 'select',
                name: 'sectionID',
                options: sectionOptions,
                label: 'Section',
                row: 0,
                col: 0,
            },
            {
                type: 'text',
                name: 'subject',
                label: 'Subject',
                row: 1,
                col: 0,
            },
            {
                type: 'wysiwyg',
                name: 'body',
                label: 'Email',
                row: 2,
                col: 0,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(data: FormData): Promise<void> {
        const section = (this.sections ?? []).find(section => section.id === data.sectionID);
        if (!section || !data.subject || !data.body) {
            this.toastr.error('Missing section, subject, or body.');
            return;
        }

        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await this.emailService.emailSection(section, data.subject, data.body);

            if (result.data.status === 'success') {
                this.toastr.success('Successfully sent email.');
            } else {
                this.toastr.error('Email delivery failed, please check with support.');
            }

            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to send email');
        }
    }
}
