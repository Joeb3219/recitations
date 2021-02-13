import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    GradebookDateRangeOverride,
    GradebookMeetingOverride,
    GradebookOverride,
    GradebookUserOverride,
    Meeting,
} from '@dynrec/common';
import { faEllipsisV, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from '../../../../services/meeting.service';

@Component({
    selector: 'app-gradebook-override-overrides-formfield',
    templateUrl: './gradebook-override-overrides-formfield.component.html',
    styleUrls: ['./gradebook-override-overrides-formfield.component.scss'],
})
export class GradebookOverrideOverridesFormfieldComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() override: GradebookOverride;

    @Output() onChange: EventEmitter<GradebookOverride> = new EventEmitter<GradebookOverride>();

    meetings: Meeting[];
    selectedEditIndex: number = -1;
    selectedEditType?: 'dateRange' | 'meeting' | 'user' = undefined;

    icons = {
        add: faPlusSquare,
        modify: faEllipsisV,
    };

    loading: boolean = false;

    constructor(private meetingService: MeetingService, private toastr: ToastrService) {}

    ngOnInit() {
        this.loadMeetings();
    }

    async loadMeetings() {
        this.loading = true;
        const result = await this.meetingService.getMeetingTime(this.override.course);
        this.meetings = result.data;
        this.loading = false;
    }

    handleAddDateRange() {
        this.selectedEditType = 'dateRange';
        this.override.dateRangeOverrides.push(
            new GradebookDateRangeOverride({
                start: dayjs().tz().startOf('day').toDate(),
                end: dayjs().tz().endOf('day').toDate(),
            })
        );
        this.selectedEditIndex = this.override.dateRangeOverrides.length - 1;
    }

    handleCloseEditOverride() {
        this.onChange.emit(this.override);
        this.selectedEditIndex = -1;
        this.selectedEditType = undefined;
    }

    handleDateRangeEdited(range: GradebookDateRangeOverride) {
        this.override.dateRangeOverrides[this.selectedEditIndex] = range;

        this.handleCloseEditOverride();
    }

    handleMeetingEdited(meeting: GradebookMeetingOverride) {
        this.override.meetingOverrides[this.selectedEditIndex] = meeting;

        this.handleCloseEditOverride();
    }

    handleUserEdited(user: GradebookUserOverride) {
        this.override.userOverrides[this.selectedEditIndex] = user;

        this.handleCloseEditOverride();
    }

    handleAddMeeting() {
        this.selectedEditType = 'meeting';
        this.override.meetingOverrides.push(new GradebookMeetingOverride());
        this.selectedEditIndex = this.override.meetingOverrides.length - 1;
    }

    handleAddUser() {
        this.selectedEditType = 'user';
        this.override.userOverrides.push(new GradebookUserOverride());
        this.selectedEditIndex = this.override.userOverrides.length - 1;
    }

    handleEditDateRange(index: number) {
        this.selectedEditIndex = index;
        this.selectedEditType = 'dateRange';
    }

    handleDeleteDateRange(index: number) {
        this.override.dateRangeOverrides = this.override.dateRangeOverrides.filter((range, idx) => idx !== index);
        this.onChange.emit(this.override);
    }

    handleEditMeeting(index: number) {
        this.selectedEditIndex = index;
        this.selectedEditType = 'meeting';
    }

    handleDeleteMeeting(index: number) {
        this.override.meetingOverrides = this.override.meetingOverrides.filter((range, idx) => idx !== index);
        this.onChange.emit(this.override);
    }

    handleEditUser(index: number) {
        this.selectedEditIndex = index;
        this.selectedEditType = 'user';
    }

    handleDeleteUser(index: number) {
        this.override.userOverrides = this.override.userOverrides.filter((range, idx) => idx !== index);
        this.onChange.emit(this.override);
    }
}
