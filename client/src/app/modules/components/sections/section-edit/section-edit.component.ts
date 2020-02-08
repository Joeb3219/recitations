import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SectionService } from '@services/section.service';

import { Section } from '@models/section'
import { Form } from '@models/forms/form'

@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrls: ['./section-edit.component.scss']
})
export class SectionEditComponent implements OnInit {

	@Input() isVisible: boolean
	@Input() section: Section
	@Output() onClose: EventEmitter<{}> = new EventEmitter();
	forceClose: Subject<any> = new Subject<any>()
	form: Form

	constructor(
		private _sectionService: SectionService,
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
			type: 'text',
			name: 'sectionNumber',
			value: (this.section) ? this.section.sectionNumber : null,
			label: 'Section Number',
		}, {
			type: 'text',
			name: 'index',
			value: (this.section) ? this.section.index : null,
			label: 'Index Number',
		}, {
			type: 'user',
			name: 'ta',
			value: (this.section) ? this.section.ta : null,
			label: 'TA',
		}, {
			type: 'user',
			name: 'professor',
			value: (this.section) ? this.section.professor : null,
			label: 'Professor',
		}, {
			type: 'meetingTimes',
			name: 'meetingTimes',
			meetable: this.section,
			label: 'Meeting Times',
		}]
	}

	handleClose(){
		this.onClose.emit(null)
	}

	async formSubmitted(section: Section){
		// We apply any fields from the object, and then any from the overwritten data
		// This allows us to submit a new object with the changes between this.section and section, without
		// having to commit them to the real copy before we've sent to the database
		const updatedSection = Object.assign({}, this.section, section)
		try{
			// send state to the db, and obtain back the ground truth that the db produces
			let result = await this._sectionService.upsertSection(updatedSection)

			// and now we store the ground truth back in our real object
			this.section = result

			this.toastr.success('Successfully edited section')
			this.forceClose.next();
		}catch(err){
			console.error(err)
			this.toastr.error('Failed to edit section')
		}
	}

}
