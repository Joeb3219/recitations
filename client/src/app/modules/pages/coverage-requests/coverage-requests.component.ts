import { Component } from '@angular/core';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';
import { LoadedArg } from 'src/app/decorators';

@Component({
    selector: 'app-coverage-requests',
    templateUrl: './coverage-requests.component.html',
    styleUrls: ['./coverage-requests.component.scss'],
})
export class CoverageRequestsComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;
}
