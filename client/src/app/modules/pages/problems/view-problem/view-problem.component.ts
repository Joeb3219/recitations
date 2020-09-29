import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@models/course';
import { Problem } from '@models/problem';
import { CourseService } from '@services/course.service';
import { ProblemService } from '@services/problem.service';

@Component({
    selector: 'app-view-problem',
    templateUrl: './view-problem.component.html',
    styleUrls: ['./view-problem.component.scss'],
})
export class ViewProblemComponent implements OnInit {
    problem: Problem;

    course: Course;

    isLoading = true;

    constructor(
        private courseService: CourseService,
        private problemService: ProblemService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(async (params) => {
            if (params.problemID) {
                this.course = await this.courseService.getCourse(
                    params.courseID
                );
                this.problem = await this.problemService.getProblem(
                    params.problemID
                );
                this.isLoading = false;
            }
        });
    }
}
