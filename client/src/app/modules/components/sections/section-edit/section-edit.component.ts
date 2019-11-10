import { Component, OnInit, Input } from '@angular/core';

import { Section } from '@models/section'
import { Form } from '@models/forms/form'

@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrls: ['./section-edit.component.scss']
})
export class SectionEditComponent implements OnInit {

	@Input() section: Section
	form: Form

	constructor() { }

	ngOnInit() {
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
			name: 'index',
			value: (this.section) ? this.section.professor : null,
			label: 'Professor',
		}
		// , {
		// 	type: 'text',
		// 	name: 'meetingTimes',
		// 	value: (this.section) ? this.section.meetingTimes : null,
		// 	label: 'Meeting Times',
		// }
		]
	}

	formSubmitted(data){
		// var { username, password } = data;
		// this._userService.signin(username, password).subscribe((result: any) => {
		// 	if(result && result.data){
		// 		this.onSuccessfulLogin.emit(result.data)
		// 	}
		// }, (err) => {
		// 	console.error(err)
		// });
	}

}
