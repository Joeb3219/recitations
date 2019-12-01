import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Form } from '@models/forms/form'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

	@Input() form: Form
	@Output() onSubmit: EventEmitter<{}> = new EventEmitter();
	@Output() onFieldChange: EventEmitter<{ name: string, value: any }> = new EventEmitter();
	internalStore = {};

	pageNumber: number = 0 // which page number of the form are we currently executing?

	constructor(){}

	ngOnInit(){}

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
