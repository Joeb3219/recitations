import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
		const updatedSection = Object.assign({}, this.section, section)

		console.log(updatedSection)

		try{
			let result = await this._sectionService.upsertSection(updatedSection)

			console.log(result)

			// this.section = result

			this.toastr.success('Successfully edited section')
			this.handleClose();
		}catch(err){
			console.error(err)
			this.toastr.error('Failed to edit section')
		}
	}

}
