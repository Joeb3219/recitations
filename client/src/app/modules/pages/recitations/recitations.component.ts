import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';

@Component({
    selector: 'app-recitations',
    templateUrl: './recitations.component.html',
    styleUrls: ['./recitations.component.scss'],
})
export class RecitationsComponent implements OnInit {
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
