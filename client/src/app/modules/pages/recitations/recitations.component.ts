import { Component } from '@angular/core';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';
import { LoadedArg } from 'src/app/decorators';

@Component({
    selector: 'app-recitations',
    templateUrl: './recitations.component.html',
    styleUrls: ['./recitations.component.scss'],
})
export class RecitationsComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    isLoading = true;
}
