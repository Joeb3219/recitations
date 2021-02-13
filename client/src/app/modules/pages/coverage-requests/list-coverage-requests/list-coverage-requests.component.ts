import { Component, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import { Course, CoverageRequest, StandardResponseInterface, User } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { CourseService } from '@services/course.service';
import { CoverageRequestService } from '@services/coverageRequest.service';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { LoadedArg } from '../../../../decorators';

@Component({
    selector: 'app-list-coverage-requests',
    templateUrl: './list-coverage-requests.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-coverage-requests.component.scss'],
})
export class ListCoverageRequestsComponent implements OnChanges {
    @LoadedArg<Course>(CourseService, Course, 'courseID')
    course: Course;

    columns: DatatableColumn<CoverageRequest>[] = [
        {
            name: 'Meeting Date',
            prop: 'date',
            cellTemplate: 'dateCell',
        },
        {
            name: 'Accepted By',
            prop: 'coveredBy',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: CoverageRequest) => {
                const instance = new CoverageRequest(row);
                return [
                    {
                        text: 'Accept',
                        can: { action: 'use', subject: instance },
                        click: () => this.handleToggleAcceptance(row),
                        if: !row.coveredBy && this.currentUser?.id !== row.meetingTime.leader?.id,
                    },
                    {
                        text: 'Reject',
                        can: { action: 'use', subject: instance },
                        click: () => this.handleToggleAcceptance(row),
                        if: !!row.coveredBy && row.coveredBy.id === this.currentUser?.id,
                    },
                    {
                        text: 'Delete',
                        can: { action: 'delete', subject: instance },
                        click: () => this.handleDeleteCoverageRequest(row),
                    },
                ];
            },
        },
    ];

    selectedCoverageRequest?: CoverageRequest = undefined;

    refreshData: EventEmitter<void> = new EventEmitter();

    isEditCoverageRequestModalOpen = false;

    currentUser?: User;

    constructor(
        private coverageRequestService: CoverageRequestService,
        private readonly userService: UserService,
        private readonly toastr: ToastrService
    ) {
        this.fetchCoverageRequests = this.fetchCoverageRequests.bind(this);
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe({
            next: user => {
                this.currentUser = user;
            },
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.refreshData.next();
        }
    }

    async fetchCoverageRequests(args: HttpFilterInterface): Promise<StandardResponseInterface<CoverageRequest[]>> {
        return this.coverageRequestService.getCourseCoverageRequests(this.course, args);
    }

    async handleToggleAcceptance(request: CoverageRequest) {
        try {
            await this.coverageRequestService.toggleCoverageRequestCoverage(request);
            this.toastr.success('Successfully toggled acceptance of coverage request.');
            this.refreshData.emit();
        } catch (err) {
            this.toastr.error('Unable to toggle acceptance of coverage request.');
        }
    }

    handleOpenNewCoverageRequestModal(): void {
        this.isEditCoverageRequestModalOpen = true;

        this.selectedCoverageRequest = new CoverageRequest({
            course: new Course(this.course),
        });
    }

    handleCloseEditCoverageRequestModal(): void {
        this.isEditCoverageRequestModalOpen = false;
        this.refreshData.next();
    }

    handleOpenEditCoverageRequestModal(coverageRequest: CoverageRequest): void {
        this.isEditCoverageRequestModalOpen = true;
        this.selectedCoverageRequest = coverageRequest;
    }

    async handleDeleteCoverageRequest(coverageRequest: CoverageRequest) {
        try {
            await this.coverageRequestService.deleteCoverageRequest(coverageRequest.id);
            this.toastr.success('Successfully deleted coverage request');
            this.refreshData.emit();
        } catch (err) {
            this.toastr.error('Failed to delete coverage request');
        }
    }
}
