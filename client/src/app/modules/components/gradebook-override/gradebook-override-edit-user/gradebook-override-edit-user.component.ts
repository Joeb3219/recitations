import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, Form, GradebookUserOverride, Meeting, MeetingTime, User } from '@dynrec/common';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { MeetingService } from '../../../../services/meeting.service';

type FormData = {
    meetingTime: {
        id?: string | MeetingTime;
        date?: Date;
    };
    user: User;
};

@Component({
    selector: 'app-gradebook-override-edit-user',
    templateUrl: './gradebook-override-edit-user.component.html',
    styleUrls: ['./gradebook-override-edit-user.component.scss'],
})
export class GradebookOverrideEditUserComponent implements OnInit {
    @Input() user: GradebookUserOverride;

    @Input() course: Course;

    @Input() isVisible: boolean;

    @Output() onChange: EventEmitter<GradebookUserOverride> = new EventEmitter<GradebookUserOverride>();

    @Input() meetings: Meeting[];

    forceClose: Subject<void> = new Subject<void>();

    form: Form<FormData>;

    constructor(private readonly meetingService: MeetingService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form<FormData>();

        if (!this.user) {
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
                value: JSON.stringify({ id: this.user?.meetingTime?.id, date: this.user.date }),
                label: 'Meeting',
                row: 0,
                col: 0,
            },
            {
                type: 'user',
                name: 'user',
                value: this.user.user,
                label: 'User',
                row: 1,
                col: 0,
            },
        ];
    }

    getMeetingLabel(meeting: Meeting): string {
        const typeString = _.startCase(meeting.meetingType);
        const date = dayjs(meeting.date).format('MMM DD, YYYY HH:mm');
        const leader = (meeting.leader ?? meeting.meetingTime.leader)?.getFullName();
        return `${date} [${typeString}${leader ? `, led by ${leader}` : ''}]`;
    }

    handleClose(): void {
        this.onChange.emit(this.user);
    }

    async formSubmitted(data: FormData): Promise<void> {
        if (typeof data.meetingTime === 'string') {
            const { date, id } = JSON.parse(data.meetingTime);
            const resolvedMeetingTime = this.meetings?.find(time => time.meetingTime.id === id)?.meetingTime;

            this.user.date = new Date(date);
            if (resolvedMeetingTime) this.user.meetingTime = resolvedMeetingTime;

            this.user.user = data.user;

            this.forceClose.next();
        }
    }
}
