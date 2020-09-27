import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { ProblemService } from '@services/problem.service'

import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

import { Problem } from '@models/problem'
import { Course } from '@models/course';

@Component({
  selector: 'app-problem-search-form',
  templateUrl: './problem-search-form.component.html',
  styleUrls: ['./problem-search-form.component.scss']
})
export class ProblemSearchFormComponent implements OnInit, OnChanges {

	@Input() problem: Problem = null
	@Input() name: string = null
	@Input() course: Course;
	@Output() onChange: EventEmitter<Problem> = new EventEmitter<Problem>()

	problems: Problem[]

	constructor(
		private _problemService: ProblemService,
	) { }

	ngOnInit() {
		this.loadProblems();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes) {
			this.loadProblems();
		}
	}

	async loadProblems() {
		if(!this.course) this.problems = [];
		else this.problems = await (await this._problemService.getCourseProblems(this.course)).data;
	}

	formatter = (problem: Problem) => {
		if(problem) return `${problem.name} ${problem.creator ? `(${problem.creator.firstName} ${problem.creator.lastName})`: ``}`
		else return ``
	}

	handleProblemSelected (data) {
		this.onChange.emit(data.item)
	}

	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map(term => term === '' ? []
				: this.problems.filter(
					problem => {
						return problem.name.toLowerCase().indexOf(term.toLowerCase()) > -1  ||
							problem.creator.username.toLowerCase().indexOf(term.toLowerCase()) > -1 
						}
				).slice(0, 10))
	)


}