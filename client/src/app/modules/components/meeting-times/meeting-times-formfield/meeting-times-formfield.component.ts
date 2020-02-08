import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faPlusSquare, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import { Meetable } from '@models/meetable'
import { MeetingTime } from '@models/meetingTime'

@Component({
  selector: 'app-meeting-times-formfield',
  templateUrl: './meeting-times-formfield.component.html',
  styleUrls: ['./meeting-times-formfield.component.scss']
})
export class MeetingTimesFormfieldComponent implements OnInit {

	@Input() meetable: Meetable
	@Output() onChange: EventEmitter<MeetingTime[]> = new EventEmitter<MeetingTime[]>()

	icons = {
		add: faPlusSquare,
		modify: faEllipsisV,
	}
	isEditingMeetingTime: boolean = false;
	selectedEditedMeetingTime: MeetingTime = null


	constructor() {}

	ngOnInit() {
		if(this.meetable && !this.meetable.meetingTimes){
			this.meetable.meetingTimes = []
		}

		this.onChange.emit(this.meetable.meetingTimes)
	}

	handleAddNewMeetingTime() {
		this.selectedEditedMeetingTime = new MeetingTime()
		this.isEditingMeetingTime = true
	}

	handleEditMeetingTimeClosed() {
		this.isEditingMeetingTime = false
		this.selectedEditedMeetingTime = null
		this.onChange.emit(this.meetable.meetingTimes)
	}

	handleMeetingTimeEdited(meetingTime: MeetingTime) {
		if(!meetingTime) return; // Check that the meeting time was actually returned by the calling form, indicating that a successful meeting time was created

		// Now we check to see if this meeting time already existed in the database
		// if so, we will simply update the list to include this one at the given index
		// we keep track of the found index that the given id already exists at, so that we can overwrite
		// if none is found, the foundIndex will stillb e null, and thus we push instead
		let foundIndex = null
		this.meetable.meetingTimes.forEach((item, index) => {
			if(item.id == meetingTime.id) foundIndex = index
		})

		if(foundIndex) this.meetable.meetingTimes[foundIndex] = meetingTime
		else this.meetable.meetingTimes.push(meetingTime)

		this.handleEditMeetingTimeClosed()
	}

}
