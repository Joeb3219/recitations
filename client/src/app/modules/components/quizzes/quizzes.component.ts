import { Component, OnChanges, OnInit } from '@angular/core';
import { Course, Quiz } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg } from '../../../../app/decorators';

@Component({
    selector: 'app-quizzes',
    templateUrl: './quizzes.component.html',
    styleUrls: ['./quizzes.component.scss'],
})
export class QuizzesComponent implements OnInit, OnChanges {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    // Temporary, will go away later.
    quiz: Quiz;

    ngOnInit() {
        this.quiz = new Quiz();
    }

    ngOnChanges() {
        this.quiz = new Quiz({ course: this.course });
    }
}
