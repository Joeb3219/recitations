import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Form } from '@models/forms/form'

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit {

	@Input() form: Form
	@Input() title: string
	@Input() submitText: string
	@Input() showModal: boolean
	@Input() forceClose: Observable<{}> = new Observable();
	@Output() onSubmit: EventEmitter<{}> = new EventEmitter();
	@Output() onClose: EventEmitter<{}> = new EventEmitter();
	@Output() onFieldChange: EventEmitter<{ name: string, value: any }> = new EventEmitter();

	forceFormSubmit: Subject<any> = new Subject<any>()


	constructor(){}

	ngOnInit(){}

	handleOnSubmit(val) {
		this.onSubmit.emit(val)
	}

	handleOnClose() {
		this.onClose.emit(null)
	}

	handleOnFieldChange(val) {
		this.onFieldChange.emit(val)
	}

	handleModalSubmit(){
		this.forceFormSubmit.next()
	}


}
