import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, Problem } from '@dynrec/common';
import { ProblemService } from '@services/problem.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-problem-edit',
    templateUrl: './problem-edit.component.html',
    styleUrls: ['./problem-edit.component.scss'],
})
export class ProblemEditComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() problem?: Problem;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(private problemService: ProblemService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    ngOnChanges(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();

        if (!this.problem?.course) {
            return;
        }

        this.form.inputs = [
            {
                type: 'text',
                name: 'name',
                value: this.problem?.name,
                label: 'Name',
                row: 0,
                col: 0,
            },
            {
                type: 'select',
                name: 'difficulty',
                options: [
                    { label: 'Easy', value: 1 },
                    { label: 'Medium', value: 3 },
                    { label: 'Hard', value: 5 },
                ],
                value: this.problem?.difficulty,
                label: 'Difficulty',
                row: 1,
                col: 0,
            },
            {
                type: 'number',
                name: 'estimatedDuration',
                value: this.problem?.estimatedDuration,
                label: 'Estimated Duration (minutes)',
                row: 1,
                col: 1,
            },
            {
                type: 'wysiwyg',
                name: 'question',
                value: this.problem?.question,
                label: 'Question',
                row: 2,
            },
            {
                type: 'wysiwyg',
                name: 'solution',
                value: this.problem?.solution,
                label: 'Solution',
                row: 3,
            },
            {
                type: 'learningGoals',
                name: 'learningGoals',
                label: 'Learning Goals',
                value: this.problem?.learningGoals,
                course: this.problem?.course,
                row: 4,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(problem: Problem): Promise<void> {
        // We apply any fields from the object, and then any from the overwritten data
        // This allows us to submit a new object with the changes between this.problem and problem, without
        // having to commit them to the real copy before we've sent to the database
        const updatedProblem = Object.assign({}, this.problem, problem);
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await this.problemService.upsertProblem(updatedProblem);

            // and now we store the ground truth back in our real object
            Object.assign(this.problem, result);

            this.toastr.success('Successfully edited problem');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to edit problem');
        }
    }
}
