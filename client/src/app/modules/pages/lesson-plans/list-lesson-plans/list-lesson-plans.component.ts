import { Component, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import { Course, LessonPlan, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { CourseService } from '@services/course.service';
import { LessonPlanService } from '@services/lesson-plan.service';
import { LoadedArg } from '../../../../decorators';

@Component({
    selector: 'app-list-lesson-plans',
    templateUrl: './list-lesson-plans.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-lesson-plans.component.scss'],
})
export class ListLessonPlansComponent implements OnChanges {
    @LoadedArg<Course>(CourseService, Course, 'courseID')
    course: Course;

    testLessonPlan: LessonPlan;

    columns: DatatableColumn<LessonPlan>[] = [
        {
            name: 'Name',
            prop: 'name',
        },
        {
            name: 'Creator',
            prop: 'creator',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: LessonPlan) => [
                {
                    text: 'View',
                    href: `/courses/${row.course.id}/lesson-plans/${row.id}`,
                },
                {
                    text: 'Modify',
                    click: () => this.handleOpenEditLessonPlanModal(row),
                    can: { action: 'update', subject: new LessonPlan(row) },
                },
            ],
        },
    ];

    selectedLessonPlan?: LessonPlan = undefined;

    refreshData: EventEmitter<void> = new EventEmitter();

    isEditLessonPlanModalOpen = false;

    isDeleteLessonPlanModalOpen = false;

    constructor(private lessonPlanService: LessonPlanService) {
        this.fetchLessonPlans = this.fetchLessonPlans.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.testLessonPlan = new LessonPlan({ course: this.course });
            this.refreshData.next();
        }
    }

    async fetchLessonPlans(args: HttpFilterInterface): Promise<StandardResponseInterface<LessonPlan[]>> {
        return this.lessonPlanService.getCourseLessonPlans(this.course, args);
    }

    handleOpenNewLessonPlanModal(): void {
        this.isEditLessonPlanModalOpen = true;

        this.selectedLessonPlan = new LessonPlan({
            course: new Course(this.course),
        });
    }

    handleCloseEditLessonPlanModal(): void {
        this.isEditLessonPlanModalOpen = false;
        this.refreshData.next();
    }

    handleOpenEditLessonPlanModal(lessonPlan: LessonPlan): void {
        this.isEditLessonPlanModalOpen = true;
        this.selectedLessonPlan = lessonPlan;
    }

    handleOpenDeleteLessonPlanModal(lessonPlan: LessonPlan): void {
        this.isDeleteLessonPlanModalOpen = true;
        this.selectedLessonPlan = lessonPlan;
    }

    handleCloseDeleteLessonPlanModal(): void {
        this.isDeleteLessonPlanModalOpen = false;
        this.refreshData.emit();
    }
}
