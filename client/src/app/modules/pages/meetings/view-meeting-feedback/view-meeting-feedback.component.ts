import { Component } from '@angular/core';
import { Course, MeetingWithLesson } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg, LoadedStringArg } from '../../../../decorators/input.decorator';

@Component({
    selector: 'app-view-meeting-feedback',
    templateUrl: './view-meeting-feedback.component.html',
    styleUrls: ['./view-meeting-feedback.component.scss'],
})
export class ViewMeetingFeedbackComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    @LoadedStringArg('date')
    dateStr: string;

    meetings: MeetingWithLesson[];

    getDate(): Date {
        return new Date(this.dateStr);
    }
}
