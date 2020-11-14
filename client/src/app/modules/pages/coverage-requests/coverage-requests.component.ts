import { Component } from '@angular/core';
import { Course } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg } from '../../../decorators';

@Component({
    selector: 'app-coverage-requests',
    templateUrl: './coverage-requests.component.html',
    styleUrls: ['./coverage-requests.component.scss'],
})
export class CoverageRequestsComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;
}
