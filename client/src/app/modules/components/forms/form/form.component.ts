import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs'

import { Form } from '@models/forms/form'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

	@ViewChild('submitButton', { static: false }) submitButton

	@Input() form: Form
	@Input() showSubmit: boolean = true // Whether or not to show the submit button. Generally true, save for places like when placed in a modal.
	@Input() forceSubmit: Observable<any> // If provided, can be used to forcefully submit the form, regardless of user intention
	@Output() onSubmit: EventEmitter<{}> = new EventEmitter();
	@Output() onFieldChange: EventEmitter<{ name: string, value: any }> = new EventEmitter();
	internalStore = {};


	pageNumber: number = 0 // which page number of the form are we currently executing?

	constructor(){}

	ngOnInit(){
		if(this.forceSubmit){
			this.forceSubmit.subscribe({
				next: () => {
					setTimeout(_ => this.submitButton.nativeElement.click())
				}
			})
		}
	}

	nextPage(){
		if(this.form.pages.length > (this.pageNumber + 1)) this.pageNumber ++
		else this.submit()
	}

	prevPage(){
		if(this.form.pages.length && this.pageNumber > 0) this.pageNumber --
	}

	fieldUpdated(name, data){
		const value = data.target.value
		this.internalStore[name] = value

		this.onFieldChange.emit({
			name,
			value
		})
	}

	submit(){
		this.onSubmit.emit(this.internalStore)
	}

}
