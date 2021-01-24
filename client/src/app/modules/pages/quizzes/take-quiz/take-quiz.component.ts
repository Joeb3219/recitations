import { Component } from '@angular/core';
import { Course } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg, LoadedStringArg } from '../../../../decorators/input.decorator';

@Component({
    selector: 'app-take-quiz',
    templateUrl: './take-quiz.component.html',
    styleUrls: ['./take-quiz.component.scss'],
})
export class TakeQuizComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    @LoadedStringArg('date')
    dateStr: string;

    getDate(): Date {
        return new Date(this.dateStr);
    }
}
