import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { MeetingTimeService } from '@services/meetingTime.service';

import { MeetingType } from '@enums/meetingType.enum';
import { MeetingTime } from '@models/meetingTime'
import { Form } from '@models/forms/form'

@Component({
  selector: 'app-meeting-time-edit',
  templateUrl: './meeting-time-edit.component.html',
  styleUrls: ['./meeting-time-edit.component.scss']
})
export class MeetingTimeEditComponent implements OnInit {

	@Input() isVisible: boolean
	@Input() meetingTime: MeetingTime
	@Output() onClose: EventEmitter<{}> = new EventEmitter();
	@Output() onMeetingTimeEdited: EventEmitter<MeetingTime> = new EventEmitter();
	forceClose: Subject<any> = new Subject<any>()
	form: Form

	constructor(
		private _meetingTimeService: MeetingTimeService,
		private toastr: ToastrService,
	) {}

	ngOnInit() {
		this.generateForm()
	}

	ngOnChanges(changes: SimpleChanges){
		this.generateForm()
	}

	generateForm(){
		this.form = new Form();
		this.form.inputs = [{
			type: 'select',
			name: 'type',
			options: [
				{ value: MeetingType.RECITATION, label: 'Recitation' },
				{ value: MeetingType.LECTURE, label: 'Lecture' },
				{ value: MeetingType.OFFICE_HOUR, label: 'Office Hour' },
				{ value: MeetingType.STUDY_GROUP, label: 'Study Group' },
			],
			value: this.meetingTime.type,
			label: 'Meeting Type',
		}, {
			type: 'select',
			name: 'weekday',
			options: [
				{ value: 'monday', label: 'Monday' },
				{ value: 'tuesday', label: 'Tuesday' },
				{ value: 'wednesday', label: 'Wednesday' },
				{ value: 'thursday', label: 'Thursday' },
				{ value: 'friday', label: 'Friday' },
				{ value: 'saturday', label: 'Saturday' },
				{ value: 'sunday', label: 'Sunday' },
			],
			value: this.meetingTime.weekday,
			label: 'Weekday',
		}, {
			type: 'user',
			name: 'leader',
			value: this.meetingTime.leader,
			label: 'Leader',
		}, {
			type: 'time',
			name: 'startTime',
			value: this.meetingTime.startTime,
			label: 'Start Time',
		}, {
			type: 'time',
			name: 'endTime',
			value: this.meetingTime.endTime,
			label: 'End Time',
		}, {
			type: 'select',
			name: 'frequency',
			options: [
				{ value: 1, label: 'Once a week' }
			],
			value: this.meetingTime.frequency,
			label: 'Frequency',
		}]
	}

	handleClose(){
		this.onClose.emit(null)
	}

	async formSubmitted(data){
		// first we update the data in the model
		Object.keys(data).forEach((key) => {
			this.meetingTime[key] = data[key]
		})

		// and now we submit it to the API.
		try{
			const result = await this._meetingTimeService.createMeetingTime(this.meetingTime)
			this.onMeetingTimeEdited.emit(result)

			this.toastr.success('Successfully created meeting time')
			this.forceClose.next()
		}catch(err){
			console.error(err)
			this.toastr.error('Failed to create meeting time')
		}
	}

}
