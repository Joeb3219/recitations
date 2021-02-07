import { Component, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import { Course, GradebookOverride, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { CourseService } from '@services/course.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { LoadedArg } from '../../../../decorators';
import { GradebookOverrideService } from '../../../../services/gradebookOverride.service';

@Component({
    selector: 'app-list-gradebook-overrides',
    templateUrl: './list-gradebook-overrides.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-gradebook-overrides.component.scss'],
})
export class ListGradebookOverridesComponent implements OnChanges {
    @LoadedArg<Course>(CourseService, Course, 'courseID')
    course: Course;

    testOverride: GradebookOverride;

    columns: DatatableColumn<GradebookOverride>[] = [
        {
            name: 'Reason',
            prop: 'reason',
        },
        {
            name: 'Summary',
            fn: row => this.summarizeOverride(row),
            cellTemplate: 'fnCell',
        },
        {
            name: 'Override Quiz',
            prop: 'overrideQuiz',
        },
        {
            name: 'Override Attendance',
            prop: 'overrideAttendance',
        },
        {
            name: 'Creator',
            prop: 'creator',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: GradebookOverride) => [
                {
                    text: 'Modify',
                    click: () => this.handleOpenEditGradebookOverrideModal(row),
                    can: { action: 'update', subject: new GradebookOverride(row) },
                },
                {
                    text: 'Delete',
                    click: () => this.handleDeleteGradebookOverride(row),
                    can: { action: 'delete', subject: new GradebookOverride(row) },
                },
            ],
        },
    ];

    selectedGradebookOverride?: GradebookOverride = undefined;

    refreshData: EventEmitter<void> = new EventEmitter();

    isEditGradebookOverrideModalOpen = false;

    constructor(private gradebookOverrideService: GradebookOverrideService, private readonly toastr: ToastrService) {
        this.fetchOverrides = this.fetchOverrides.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.testOverride = new GradebookOverride({ course: this.course });
            this.refreshData.next();
        }
    }

    async fetchOverrides(args: HttpFilterInterface): Promise<StandardResponseInterface<GradebookOverride[]>> {
        return this.gradebookOverrideService.getCourseGradebookOverrides(this.course, args);
    }

    summarizeOverride(override: GradebookOverride): string {
        const userStrings = override.userOverrides
            .map(uOverride => `${uOverride.user.getFullName()} -- ${dayjs(uOverride.date).format('MM/DD')}`)
            .join(',');

        const meetingOverrides = override.meetingOverrides
            .map(
                mOverride =>
                    `${mOverride.meetingTime.meetable?.meetingIdentifier ?? ''} ${dayjs(mOverride.date).format(
                        'MM/DD'
                    )}`
            )
            .join(', ');

        const dateRangeOverrides = override.dateRangeOverrides
            .map(dRange => `${dayjs(dRange.start).format('MM/DD HH:mm')} - ${dayjs(dRange.end).format('MM/DD HH:mm')}`)
            .join(', ');

        return [dateRangeOverrides, meetingOverrides, userStrings].filter(r => r && r !== '').join('; ');
    }

    handleOpenNewGradebookOverrideModal(): void {
        this.isEditGradebookOverrideModalOpen = true;

        this.selectedGradebookOverride = new GradebookOverride({
            course: this.course,
            meetingOverrides: [],
            userOverrides: [],
            dateRangeOverrides: [],
            overrideAttendance: false,
            overrideQuiz: false,
        });
    }

    handleCloseEditGradebookOverrideModal(): void {
        this.isEditGradebookOverrideModalOpen = false;
        this.refreshData.next();
    }

    handleOpenEditGradebookOverrideModal(override: GradebookOverride): void {
        this.isEditGradebookOverrideModalOpen = true;
        this.selectedGradebookOverride = override;
    }

    async handleDeleteGradebookOverride(override: GradebookOverride) {
        try {
            const result = await this.gradebookOverrideService.deleteGradebookOverride(override.id);

            if (!result) {
                throw new Error('Failed to delete override');
            }

            this.toastr.success('Successfully deleted override');
        } catch (err) {
            this.toastr.error('Failed to delete override');
        }
    }
}
