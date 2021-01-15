import { Component, EventEmitter, Input } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import { Course, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { RosterService } from '@services/roster.service';

@Component({
    selector: 'app-view-roster',
    templateUrl: './view-roster.component.html',
    styleUrls: ['./view-roster.component.scss'],
})
export class ViewRosterComponent {
    @Input()
    course: Course;

    refreshData: EventEmitter<void> = new EventEmitter();

    // Because of Typescript limitations, we can't actually use the real type here, because then we
    // cannot access subprops (e.g. section.sectionNumber).... This is a for later problem.
    columns: DatatableColumn<any>[] = [
        {
            name: 'Section Number',
            prop: 'section.sectionNumber',
        },
        {
            name: 'Student',
            prop: 'student',
            cellTemplate: 'userCell',
        },
    ];

    constructor(private readonly rosterService: RosterService) {
        this.fetchRoster = this.fetchRoster.bind(this);
    }

    uploadingRosterModalOpen: boolean = false;

    handleUploadRosterClosed() {
        this.uploadingRosterModalOpen = false;
        this.refreshData.next();
    }

    handleUploadRosterOpened() {
        this.uploadingRosterModalOpen = true;
    }

    async fetchRoster(args: HttpFilterInterface): Promise<StandardResponseInterface<any>> {
        return this.rosterService.listCourseRoster(this.course, args);
    }
}
