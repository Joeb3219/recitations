import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Meetable, MeetingTime } from '@dynrec/common';
import { faEllipsisV, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-meeting-times-formfield',
    templateUrl: './meeting-times-formfield.component.html',
    styleUrls: ['./meeting-times-formfield.component.scss'],
})
export class MeetingTimesFormfieldComponent implements OnInit {
    @Input() meetable: Meetable;

    @Output() onChange: EventEmitter<MeetingTime[]> = new EventEmitter<
        MeetingTime[]
    >();

    icons = {
        add: faPlusSquare,
        modify: faEllipsisV,
    };

    isEditingMeetingTime = false;

    selectedEditedMeetingTime?: MeetingTime = undefined;

    ngOnInit(): void {
        if (this.meetable && !this.meetable.meetingTimes) {
            this.meetable.meetingTimes = [];
        }

        this.onChange.emit(this.meetable.meetingTimes);
    }

    handleAddNewMeetingTime(): void {
        this.selectedEditedMeetingTime = new MeetingTime();
        this.isEditingMeetingTime = true;
    }

    handleEditMeetingTimeClosed(): void {
        this.isEditingMeetingTime = false;
        this.selectedEditedMeetingTime = undefined;
        this.onChange.emit(this.meetable.meetingTimes);
    }

    handleEditMeetingTime(meetingTime: MeetingTime): void {
        this.selectedEditedMeetingTime = meetingTime;
        this.isEditingMeetingTime = true;
    }

    handleMeetingTimeEdited(meetingTime: MeetingTime): void {
        if (!meetingTime) return; // Check that the meeting time was actually returned by the calling form, indicating that a successful meeting time was created

        if (!this.meetable.meetingTimes) {
            this.meetable.meetingTimes = [];
        }

        // Now we check to see if this meeting time already existed in the database
        // if so, we will simply update the list to include this one at the given index
        // we keep track of the found index that the given id already exists at, so that we can overwrite
        // if none is found, the foundIndex will stillb e null, and thus we push instead
        const foundIndex = this.meetable.meetingTimes.findIndex(
            (item) => item.id === meetingTime.id
        );

        if (foundIndex !== -1)
            this.meetable.meetingTimes[foundIndex] = meetingTime;
        else this.meetable.meetingTimes.push(meetingTime);

        this.handleEditMeetingTimeClosed();
    }
}
