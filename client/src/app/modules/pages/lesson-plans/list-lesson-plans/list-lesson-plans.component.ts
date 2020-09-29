import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@models/course';
import { LessonPlan } from '@models/lessonPlan';
import { Problem } from '@models/problem';
import { CourseService } from '@services/course.service';
import { LessonPlanService } from '@services/lesson-plan.service';

@Component({
    selector: 'app-list-lesson-plans',
    templateUrl: './list-lesson-plans.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-lesson-plans.component.scss'],
})
export class ListLessonPlansComponent implements OnInit {
    course: Course;

    lessonPlans: LessonPlan[];

    isLoading = true;

    selectedLessonPlan: LessonPlan = null;

    isEditLessonPlanModalOpen = false;

    isDeleteLessonPlanModalOpen = false;

    constructor(
        private courseService: CourseService,
        private lessonPlanService: LessonPlanService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(async (params) => {
            if (params.courseID) {
                this.course = await this.courseService.getCourse(
                    params.courseID
                );
                this.lessonPlans = await this.lessonPlanService.getCourseLessonPlans(
                    this.course
                );
                this.isLoading = false;
            }
        });
    }

    handleOpenNewLessonPlanModal(): void {
        this.isEditLessonPlanModalOpen = true;

        this.selectedLessonPlan = new LessonPlan({
            course: new Course(this.course),
        });
    }

    getMinuteUnit(estimatedDuration: number): string {
        return Problem.getMinuteUnit(estimatedDuration);
    }

    handleCloseEditLessonPlanModal(): void {
        this.isEditLessonPlanModalOpen = false;

        // And now we add the lesson plan if needed
        // We perform a search for if there is a lesson plan with that id already
        const foundLessonPlan = this.lessonPlans.find((lp) => {
            return lp.id === this.selectedLessonPlan.id;
        });

        // if the lesson plan was found, we already have it in our array, and the data would be updated via the component
        // if it wasn't found, we insert it new.
        if (!foundLessonPlan) this.lessonPlans.push(this.selectedLessonPlan);

        this.selectedLessonPlan = null;
    }

    handleOpenEditLessonPlanModal(lessonPlan: LessonPlan): void {
        this.isEditLessonPlanModalOpen = true;
        this.selectedLessonPlan = lessonPlan;
    }

    handleOpenDeleteLessonPlanModal(lessonPlan: LessonPlan): void {
        this.isDeleteLessonPlanModalOpen = true;
        this.selectedLessonPlan = lessonPlan;
    }

    handleCloseDeleteLessonPlanModal($event): void {
        this.isDeleteLessonPlanModalOpen = false;

        if ($event) {
            this.lessonPlans.splice(
                this.lessonPlans.indexOf(this.selectedLessonPlan),
                1
            );
        }
    }
}
