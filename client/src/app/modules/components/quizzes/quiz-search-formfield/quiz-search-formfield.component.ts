import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Course, Quiz } from '@dynrec/common';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { QuizService } from '../../../../services/quiz.service';

@Component({
    selector: 'app-quiz-search-formfield',
    templateUrl: './quiz-search-formfield.component.html',
    styleUrls: ['./quiz-search-formfield.component.scss'],
})
export class QuizSearchFormfieldComponent implements OnInit, OnChanges {
    @Input() quiz?: Quiz = undefined;

    @Input() name?: string = undefined;

    @Input() course: Course;

    @Output() onChange: EventEmitter<Quiz> = new EventEmitter<Quiz>();

    quizzes: Quiz[];

    constructor(private quizService: QuizService) {}

    ngOnInit(): void {
        this.loadQuizzes();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.loadQuizzes();
        }
    }

    async loadQuizzes(): Promise<void> {
        if (!this.course) this.quizzes = [];
        else this.quizzes = (await this.quizService.getCourseQuizes(this.course)).data;
    }

    formatter = (quiz: Quiz): string => {
        if (quiz) return `${quiz.name} ${quiz.creator ? `(${quiz.creator.firstName} ${quiz.creator.lastName})` : ``}`;
        return ``;
    };

    handleQuizSelected(data: { item: Quiz }): void {
        this.onChange.emit(data.item);
    }

    search = (text$: Observable<string>): Observable<Quiz[]> =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term =>
                term === ''
                    ? []
                    : this.quizzes
                          .filter(quiz => {
                              return (
                                  quiz.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  (quiz.creator?.username.toLowerCase().indexOf(term.toLowerCase()) ?? -1) > -1
                              );
                          })
                          .slice(0, 10)
            )
        );
}
