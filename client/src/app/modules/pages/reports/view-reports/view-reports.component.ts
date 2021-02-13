import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Course, Meeting } from '@dynrec/common';
import dayjs from 'dayjs';
import { LoadedArg } from '../../../../decorators';
import { CourseService } from '../../../../services/course.service';
import { MeetingService } from '../../../../services/meeting.service';

@Component({
    selector: 'app-view-reports',
    templateUrl: './view-reports.component.html',
    styleUrls: ['./view-reports.component.scss'],
})
export class ViewReportsComponent implements OnInit, OnChanges {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    meetings: Meeting[];

    activeTabIndex: number = 0;

    weekBeginDates: Date[];

    startDate: Date;
    endDate: Date;

    constructor(private readonly meetingsService: MeetingService) {}

    ngOnInit(): void {
        this.loadMeetings();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadMeetings();
    }

    updateDate(which: 'start' | 'end', data?: { target?: { value: any } } | any) {
        const value = dayjs(data?.target?.value ?? data).toDate();

        if (which === 'start') {
            this.startDate = value;
        } else {
            this.endDate = value;
        }
    }

    async loadMeetings() {
        if (!this.course) {
            return;
        }

        this.startDate = new Date(this.course.getSetting('semester_start_date').value ?? '');
        this.endDate = new Date(this.course.getSetting('semester_end_date').value ?? '');

        const result = await this.meetingsService.getMeetingTime(this.course);
        this.meetings = result.data;
    }
}
