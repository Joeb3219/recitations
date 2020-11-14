import { Component } from '@angular/core';
import { Course } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg } from '../../../../decorators';

@Component({
    selector: 'app-view-course',
    templateUrl: './view-course.component.html',
    styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;
}
