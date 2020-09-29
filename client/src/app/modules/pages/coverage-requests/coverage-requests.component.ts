import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';

@Component({
    selector: 'app-coverage-requests',
    templateUrl: './coverage-requests.component.html',
    styleUrls: ['./coverage-requests.component.scss'],
})
export class CoverageRequestsComponent implements OnInit {
    course: Course;

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
