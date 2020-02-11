import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
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

	defaultWYSIWYGModules = {
		formula: true,
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			['blockquote', 'code-block'],

			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

			[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

			[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

			['formula', 'link', 'image', 'video']                         // link and image, video
		]
	};

	constructor(){}

	ngOnInit(){
		if(this.forceSubmit){
			this.forceSubmit.subscribe({
				next: () => {
					setTimeout(_ => this.submitButton.nativeElement.click())
				}
			})
		}

		this.loadDefaultFormData()
	}

	ngOnChanges(changes: SimpleChanges){
		this.loadDefaultFormData()
	}

	loadDefaultFormData(){
		if(!this.form) return

		this.form.inputs.forEach((input) => {
			this.internalStore[input.name] = input.value
		})
	}

	// When an editor is created, we pass back the value we wish to save into it in addition to the editor
	// we then can format the content and then set the contents
	// Why not do this beforehand? It seems they don't support it very well.
	// This approach is documented here: https://github.com/KillerCodeMonkey/ngx-quill/issues/77
	wysiwygCreated(value, editor) {
		const contents = editor.clipboard.convert(value);
		editor.setContents(contents)
	}

	nextPage(){
		if(this.form.pages.length > (this.pageNumber + 1)) this.pageNumber ++
		else this.submit()
	}

	prevPage(){
		if(this.form.pages.length && this.pageNumber > 0) this.pageNumber --
	}

	fieldUpdatedWysiwyg(name, data) {
		const value = (data.target ? data.target.value : data).html
		this.internalStore[name] = value


		this.onFieldChange.emit({
			name,
			value
		})		
	}

	fieldUpdated(name, data){
		const value = (data.target ? data.target.value : data)
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
