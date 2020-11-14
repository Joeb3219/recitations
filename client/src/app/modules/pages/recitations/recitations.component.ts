import { Component } from '@angular/core';
import { Course } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg } from '../../../decorators';

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
