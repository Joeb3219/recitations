import { Component, OnInit, Input, Output } from '@angular/core';

import { Meetable } from '@models/meetable'

@Component({
  selector: 'app-meeting-times-formfield',
  templateUrl: './meeting-times-formfield.component.html',
  styleUrls: ['./meeting-times-formfield.component.scss']
})
export class MeetingTimesFormfieldComponent implements OnInit {

	@Input() meetable: Meetable

	constructor() {}

	ngOnInit() {
		if(this.meetable && !this.meetable.meetingTimes){
			this.meetable.meetingTimes = []
		}
	}

}
