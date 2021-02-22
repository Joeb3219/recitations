import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoverageRequest, Form, Meeting } from '@dynrec/common';
import dayjs from 'dayjs';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CoverageRequestService } from '../../../../services/coverageRequest.service';
import { MeetingService } from '../../../../services/meeting.service';

@Component({
    selector: 'app-coverage-request-edit',
    templateUrl: './coverage-request-edit.component.html',
    styleUrls: ['./coverage-request-edit.component.scss'],
})
export class CoverageRequestEditComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() request?: CoverageRequest;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    meetings?: Meeting[];

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(
        private coverageRequestService: CoverageRequestService,
        private readonly meetingService: MeetingService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.loadMeetingTimes();
    }

    ngOnChanges(): void {
        this.loadMeetingTimes();
    }

    async loadMeetingTimes() {
        if (!this.request?.course) {
            return;
        }

        const result = await this.meetingService.getMeetingTime(this.request.course);
        this.meetings = result.data.filter(meeting => dayjs().isBefore(meeting.date));

        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form<CoverageRequest>();

        if (!this.request?.course || !this.meetings?.length) {
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
                value: this.request?.meetingTime?.id,
                label: 'Meeting',
                row: 0,
                col: 0,
            },
            {
                type: 'text',
                name: 'reason',
                value: this.request?.reason,
                label: 'Reason',
                row: 1,
                col: 0,
            },
        ];
    }

    getMeetingLabel(meeting: Meeting): string {
        return meeting.toString();
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(request: CoverageRequest): Promise<void> {
        if (typeof request.meetingTime === 'string') {
            const { date, id } = JSON.parse(request.meetingTime);
            const resolvedMeetingTime = this.meetings?.find(time => time.meetingTime.id === id)?.meetingTime;

            if (!resolvedMeetingTime) {
                this.toastr.error('Failed to select meeting time');
                return;
            }

            request.date = date;

            request.meetingTime = resolvedMeetingTime;
        }

        // We apply any fields from the object, and then any from the overwritten data
        // This allows us to submit a new object with the changes between this.request and request, without
        // having to commit them to the real copy before we've sent to the database
        const updatedRequest = Object.assign({}, this.request, request);

        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await this.coverageRequestService.upsertCoverageRequest(updatedRequest);

            // and now we store the ground truth back in our real object
            Object.assign(this.request, result);

            this.toastr.success('Successfully edited coverage request');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to edit coverage request');
        }
    }
}
