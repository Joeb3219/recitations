import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';

@Component({
    selector: 'app-view-course',
    templateUrl: './view-course.component.html',
    styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent implements OnInit {
    course: Course = null;

    isLoading = true;

    constructor(
        private courseService: CourseService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(async (params) => {
            if (params.courseID) {
                this.course = await this.courseService.getCourse(
                    params.courseID
                );
                this.isLoading = false;
            }
        });
    }
}
