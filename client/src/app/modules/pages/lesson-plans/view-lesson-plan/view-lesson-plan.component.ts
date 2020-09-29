import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@models/course';
import { LessonPlan } from '@models/lessonPlan';
import { CourseService } from '@services/course.service';
import { LessonPlanService } from '@services/lesson-plan.service';

@Component({
    selector: 'app-view-lesson-plan',
    templateUrl: './view-lesson-plan.component.html',
    styleUrls: ['./view-lesson-plan.component.scss'],
})
export class ViewLessonPlanComponent implements OnInit {
    lessonPlan: LessonPlan;

    course: Course;

    isLoading = true;

    constructor(
        private courseService: CourseService,
        private lessonPlanService: LessonPlanService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(async (params) => {
            if (params.lessonPlanID) {
                this.course = await this.courseService.getCourse(
                    params.courseID
                );
                this.lessonPlan = await this.lessonPlanService.getLessonPlan(
                    params.lessonPlanID
                );
                this.isLoading = false;
            }
        });
    }
}
