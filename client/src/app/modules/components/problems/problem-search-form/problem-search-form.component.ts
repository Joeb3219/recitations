import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Course, Problem } from '@dynrec/common';
import { ProblemService } from '@services/problem.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'app-problem-search-form',
    templateUrl: './problem-search-form.component.html',
    styleUrls: ['./problem-search-form.component.scss'],
})
export class ProblemSearchFormComponent implements OnInit, OnChanges {
    @Input() problem?: Problem = undefined;

    @Input() name?: string = undefined;

    @Input() course: Course;

    @Output() onChange: EventEmitter<Problem> = new EventEmitter<Problem>();

    problems: Problem[];

    constructor(private problemService: ProblemService) {}

    ngOnInit(): void {
        this.loadProblems();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.loadProblems();
        }
    }

    async loadProblems(): Promise<void> {
        if (!this.course) this.problems = [];
        else this.problems = (await this.problemService.getCourseProblems(this.course)).data;
    }

    formatter = (problem: Problem): string => {
        if (problem)
            return `${problem.name} ${
                problem.creator ? `(${problem.creator.firstName} ${problem.creator.lastName})` : ``
            }`;
        return ``;
    };

    handleProblemSelected(data: { item: Problem }): void {
        this.onChange.emit(data.item);
    }

    search = (text$: Observable<string>): Observable<Problem[]> =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term =>
                term === ''
                    ? []
                    : this.problems
                          .filter(problem => {
                              return (
                                  problem.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  (problem.creator?.username.toLowerCase().indexOf(term.toLowerCase()) ?? -1) > -1
                              );
                          })
                          .slice(0, 10)
            )
        );
}
