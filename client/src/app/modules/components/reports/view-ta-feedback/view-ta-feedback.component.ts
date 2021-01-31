import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Course, Meeting, MeetingReport } from '@dynrec/common';
import dayjs from 'dayjs';
import _ from 'lodash';
import { MeetingReportService } from '../../../../services/meetingReport.service';

type ReportBucket = {
    date: Date;
    found: MeetingReport[];
    missing: Meeting[];
};

@Component({
    selector: 'app-view-ta-feedback',
    templateUrl: './view-ta-feedback.component.html',
    styleUrls: ['./view-ta-feedback.component.scss'],
})
export class ViewTaFeedbackComponent implements OnInit, OnChanges {
    @Input() course: Course;
    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() meetings: Meeting[];

    reports?: MeetingReport[];
    loading: boolean = false;
    reportBuckets: ReportBucket[];

    constructor(private readonly meetingReportService: MeetingReportService) {}

    ngOnInit(): void {
        this.generateReport();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.generateReport();
        }
    }

    async generateReport() {
        this.loading = true;

        if (!this.startDate || !this.endDate) {
            this.loading = false;
            return;
        }

        const results = await this.meetingReportService.getMeetingReportsInRange(
            this.course,
            this.startDate,
            this.endDate
        );

        this.reports = results.data;

        this.processReport();

        this.loading = false;
    }

    processReport() {
        const uniqueMeetingDates = _.uniqBy(
            this.meetings.map(meeting => meeting.date),
            date => dayjs(date).startOf('day').toISOString()
        );

        this.reportBuckets = uniqueMeetingDates.map(date => ({
            date: dayjs(date).startOf('day').toDate(),
            found: this.reports?.filter(report => dayjs(report.date).isSame(dayjs(date), 'day')) ?? [],
            missing: this.meetings?.filter(
                meeting =>
                    (dayjs(meeting.date).isSame(date, 'day') &&
                        !this.reports?.find(report => dayjs(report.date).isSame(dayjs(date), 'day'))) ??
                    []
            ),
        }));

        this.reportBuckets = _.sortBy(this.reportBuckets, bucket => bucket.date.toISOString());
    }
}
