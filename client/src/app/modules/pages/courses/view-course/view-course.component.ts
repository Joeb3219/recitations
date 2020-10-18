import { Component } from '@angular/core';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';
import { LoadedArg } from 'src/app/decorators';

@Component({
    selector: 'app-view-course',
    templateUrl: './view-course.component.html',
    styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;
}
