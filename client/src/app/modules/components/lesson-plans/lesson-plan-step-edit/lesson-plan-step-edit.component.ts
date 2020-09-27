import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { LessonPlanStep } from '@models/lessonPlanStep';
import { Form } from '@models/forms/form';
import { Subject } from 'rxjs';
import { LessonPlanService } from '@services/lesson-plan.service';
import { ToastrService } from 'ngx-toastr';
import { get } from 'lodash';
import { LessonPlanStepType } from '../../../../../../../common/models/lessonPlanStep';

@Component({
  selector: 'app-lesson-plan-step-edit',
  templateUrl: './lesson-plan-step-edit.component.html',
  styleUrls: ['./lesson-plan-step-edit.component.scss']
})
export class LessonPlanStepEditComponent implements OnInit {

  @Input() isVisible: boolean = true;
  @Input() lessonPlanStep: LessonPlanStep;

  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();
  @Output() onStepEdited: EventEmitter<LessonPlanStep> = new EventEmitter<LessonPlanStep>();

  form: Form;
  forceClose: Subject<any> = new Subject<any>();
	constructor(
		private _lessonPlanService: LessonPlanService,
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
				{ value: 'task', label: 'Task' },
				{ value: 'problem', label: 'Problem' },
			],
			value: get(this.lessonPlanStep, 'type'),
			label: 'Step Type',
			row: 0,
			col: 0,
		}, {
			type: 'number',
			name: 'estimatedDuration',
			label: 'Estimated Duration',
			disabled: get(this.lessonPlanStep, 'type') === 'problem',
			value: get(this.lessonPlanStep, 'problem') ? get(this.lessonPlanStep, 'problem.estimatedDuration') : get(this.lessonPlanStep, 'estimatedDuration'),
			row: 0,
			col: 1,
		}, {
			type: 'text',
			name: 'title',
			label: 'Title',
			value: get(this.lessonPlanStep, 'title'),
			row: 1,
			col: 0,
		}, {
			type: 'text',
			name: 'description',
			label: 'Description',
			value: get(this.lessonPlanStep, 'description'),
			row: 2,
		}, {
			type: 'problem',
			name: 'problem',
			label: 'Problem',
			course: get(this.lessonPlanStep, 'course'),
			value: get(this.lessonPlanStep, 'problem'),
			hidden: get(this.lessonPlanStep, 'type') !== 'problem',
			row: 3,
		}]
  }
  
  handleFieldChange({ name, value }) {
    this.lessonPlanStep[name] = value;
    this.generateForm();
}

	handleClose(){
		this.onClose.emit(null)
	}

	async formSubmitted(data){
		// first we update the data in the model
		Object.keys(data).forEach((key) => {
			this.lessonPlanStep[key] = data[key]
		})

		// and now we submit it to the API.
		try{
			const result = await this._lessonPlanService.upsertLessonPlanStep(this.lessonPlanStep)
			this.onStepEdited.emit(result)

			this.toastr.success('Successfully created lesson plan step')
			this.forceClose.next()
		}catch(err){
			console.error(err)
			this.toastr.error('Failed to create lesson plan step')
		}
	}

}
