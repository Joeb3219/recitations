import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { get } from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { LessonPlanService } from '@services/lesson-plan.service';

import { LessonPlan } from '@models/lessonPlan';
import { Form } from '@models/forms/form';

@Component({
  selector: 'app-lesson-plan-edit',
  templateUrl: './lesson-plan-edit.component.html',
  styleUrls: ['./lesson-plan-edit.component.scss']
})
export class LessonPlanEditComponent implements OnInit {

  @Input() lessonPlan: LessonPlan;
  @Input() isVisible: boolean;

	@Output() onClose: EventEmitter<{}> = new EventEmitter();
	forceClose: Subject<any> = new Subject<any>()

	form: Form

	constructor(
		private _lessonPlanService: LessonPlanService,
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
			value: get(this, 'lessonPlan.name'),
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
		}]
	}

	handleClose(){
		this.onClose.emit(null)
	}

	async formSubmitted(lessonPlan: LessonPlan){
		// We apply any fields from the object, and then any from the overwritten data
		// This allows us to submit a new object with the changes between this.lessonPlan and lessonPlan, without
		// having to commit them to the real copy before we've sent to the database
		const updatedLessonPlan = Object.assign({}, this.lessonPlan, lessonPlan)
		try{
			// send state to the db, and obtain back the ground truth that the db produces
			let result = await this._lessonPlanService.upsertLessonPlan(lessonPlan)

			// and now we store the ground truth back in our real object
			Object.assign(this.lessonPlan, result)

			this.toastr.success('Successfully edited lesson plan')
			this.forceClose.next();
		}catch(err){
			this.toastr.error('Failed to edit lesson plan')
		}
	}

}
