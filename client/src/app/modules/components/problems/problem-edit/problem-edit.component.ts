import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { get } from 'lodash';

import { ProblemService } from '@services/problem.service';
import { Problem } from '@models/problem';
import { Form } from '@models/forms/form'

@Component({
  selector: 'app-problem-edit',
  templateUrl: './problem-edit.component.html',
  styleUrls: ['./problem-edit.component.scss']
})
export class ProblemEditComponent implements OnInit {

	@Input() isVisible: boolean
	@Input() problem: Problem
	@Output() onClose: EventEmitter<{}> = new EventEmitter();
	forceClose: Subject<any> = new Subject<any>()

	form: Form

	constructor(
		private _problemService: ProblemService,
		private toastr: ToastrService,
	) { }

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
			name: 'name',
			value: get(this, 'problem.name'),
			label: 'Name',
		}, {
			type: 'wysiwyg',
			name: 'question',
			value: get(this, 'problem.question'),
			label: 'Question',
		}, {
			type: 'wysiwyg',
			name: 'solution',
			value: get(this, 'problem.solution'),
			label: 'Solution',
		}, {
			type: 'select',
			name: 'difficulty',
			options: [
				{ label: 'Easy', value: '1' },
				{ label: 'Medium', value: '3' },
				{ label: 'Hard', value: '5' },
			],
			value: get(this, 'problem.difficulty'),
			label: 'Difficulty',
		}, {
			type: 'number',
			name: 'estimatedDuration',
			value: get(this, 'problem.estimatedDuration'),
			label: 'Estimated Duration (minutes)',
		}]

		console.log(get(this, 'problem'))
	}

	handleClose(){
		this.onClose.emit(null)
	}

	async formSubmitted(problem: Problem){
		// We apply any fields from the object, and then any from the overwritten data
		// This allows us to submit a new object with the changes between this.problem and problem, without
		// having to commit them to the real copy before we've sent to the database
		const updatedProblem = Object.assign({}, this.problem, problem)
		try{
			// send state to the db, and obtain back the ground truth that the db produces
			let result = await this._problemService.upsertProblem(updatedProblem)

			// and now we store the ground truth back in our real object
			Object.assign(this.problem, result)

			this.toastr.success('Successfully edited problem')
			this.forceClose.next();
		}catch(err){
			console.error(err)
			this.toastr.error('Failed to edit problem')
		}
	}

}
