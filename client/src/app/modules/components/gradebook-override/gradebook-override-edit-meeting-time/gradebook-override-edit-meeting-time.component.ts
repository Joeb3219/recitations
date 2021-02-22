import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, Form, GradebookMeetingOverride, Meeting, MeetingTime } from '@dynrec/common';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { MeetingService } from '../../../../services/meeting.service';

type FormData = {
    meetingTime: {
        id?: string | MeetingTime;
        date?: Date;
    };
};

@Component({
    selector: 'app-gradebook-override-edit-meeting-time',
    templateUrl: './gradebook-override-edit-meeting-time.component.html',
    styleUrls: ['./gradebook-override-edit-meeting-time.component.scss'],
})
export class GradebookOverrideEditMeetingTimeComponent implements OnInit {
    @Input() meeting: GradebookMeetingOverride;

    @Input() course: Course;

    @Input() isVisible: boolean;

    @Output() onChange: EventEmitter<GradebookMeetingOverride> = new EventEmitter<GradebookMeetingOverride>();

    @Input() meetings: Meeting[];

    forceClose: Subject<void> = new Subject<void>();

    form: Form<FormData>;

    constructor(private readonly meetingService: MeetingService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form<FormData>();

        if (!this.meeting) {
            return;
        }

        const requestOptions = _.sortBy(this.meetings, meeting => meeting.date).map(meeting => ({
            value: JSON.stringify({ date: meeting.date, id: meeting.meetingTime.id }),
            label: this.getMeetingLabel(meeting),
        }));

        this.form.inputs = [
            {
                type: 'select',
                name: 'meetingTime',
                options: requestOptions,
                value: JSON.stringify({ id: this.meeting?.meetingTime?.id, date: this.meeting.date }),
                label: 'Meeting',
                row: 0,
                col: 0,
            },
        ];
    }

    getMeetingLabel(meeting: Meeting): string {
        return meeting.toString();
    }

    handleClose(): void {
        this.onChange.emit(this.meeting);
    }

    async formSubmitted(data: FormData): Promise<void> {
        if (typeof data.meetingTime === 'string') {
            const { date, id } = JSON.parse(data.meetingTime);
            const resolvedMeetingTime = this.meetings?.find(time => time.meetingTime.id === id)?.meetingTime;

            this.meeting.date = new Date(date);
            if (resolvedMeetingTime) this.meeting.meetingTime = resolvedMeetingTime;
        }

        this.forceClose.next();
    }
}
