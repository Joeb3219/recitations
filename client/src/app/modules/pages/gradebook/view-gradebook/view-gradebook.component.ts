import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Course, StudentGradebookPayload } from '@dynrec/common';
import { LoadedArg } from 'app/decorators';
import _ from 'lodash';
import { CourseService } from '../../../../services/course.service';
import { GradebookService } from '../../../../services/gradebook.service';

@Component({
    selector: 'app-view-gradebook',
    templateUrl: './view-gradebook.component.html',
    styleUrls: ['./view-gradebook.component.scss'],
})
export class ViewGradebookComponent implements OnInit, OnChanges {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    loading: boolean = false;
    entries: StudentGradebookPayload[];

    constructor(private readonly gradebookService: GradebookService) {}

    ngOnInit(): void {
        this.loadGradebook();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadGradebook();
    }

    async loadGradebook() {
        if (!this.course) {
            return;
        }

        this.loading = true;

        const result = await this.gradebookService.getPersonalGradebook(this.course);
        this.entries = _.sortBy(result.data, entry => entry.meeting.date.toISOString());

        this.loading = false;
    }
}
