import { Component, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Course, Email, StandardResponseInterface } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg } from '../../../../decorators';
import { HttpFilterInterface } from '../../../../http/httpFilter.interface';
import { EmailService } from '../../../../services/email.service';
import { DatatableColumn } from '../../../components/datatable/datatable.component';

@Component({
    selector: 'app-list-emails',
    templateUrl: './list-emails.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-emails.component.scss'],
})
export class ListEmailsComponent implements OnChanges {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    refreshData: EventEmitter<void> = new EventEmitter();

    columns: DatatableColumn<Email>[] = [
        {
            name: 'Date',
            prop: 'date',
            cellTemplate: 'dateCell',
        },
        {
            name: 'Subject',
            fn: row => row.email.subject,
            cellTemplate: 'fnCell',
        },
        {
            name: 'Status',
            prop: 'status',
        },
        {
            name: 'Creator',
            prop: 'creator',
            cellTemplate: 'userCell',
        },
    ];

    isEditEmailModalOpen = false;

    constructor(private emailService: EmailService) {
        this.fetchEmails = this.fetchEmails.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.refreshData.next();
        }
    }

    async fetchEmails(args: HttpFilterInterface): Promise<StandardResponseInterface<Email[]>> {
        return this.emailService.getCourseEmails(this.course, args);
    }

    handleOpenNewEmailModal(): void {
        this.isEditEmailModalOpen = true;
    }

    handleCloseEditEmailModal(): void {
        this.isEditEmailModalOpen = false;

        this.refreshData.emit();
    }
}
