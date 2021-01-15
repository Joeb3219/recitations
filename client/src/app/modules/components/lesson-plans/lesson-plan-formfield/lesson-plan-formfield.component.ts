import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Course, LessonPlan } from '@dynrec/common';
import { LessonPlanService } from '@services/lesson-plan.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'app-lesson-plan-formfield',
    templateUrl: './lesson-plan-formfield.component.html',
    styleUrls: ['./lesson-plan-formfield.component.scss'],
})
export class LessonPlanFormfieldComponent implements OnInit, OnChanges {
    @Input() lessonPlan?: LessonPlan = undefined;

    @Input() name?: string = undefined;

    @Input() course: Course;

    @Output() onChange: EventEmitter<LessonPlan> = new EventEmitter<LessonPlan>();

    lessonPlans: LessonPlan[];

    constructor(private lessonPlanService: LessonPlanService) {}

    ngOnInit(): void {
        this.loadLessonPlans();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.loadLessonPlans();
        }
    }

    async loadLessonPlans(): Promise<void> {
        if (!this.course) this.lessonPlans = [];
        else this.lessonPlans = (await this.lessonPlanService.getCourseLessonPlans(this.course)).data;
    }

    formatter = (plan: LessonPlan): string => {
        if (plan) return `${plan.name} ${plan.creator ? `(${plan.creator.firstName} ${plan.creator.lastName})` : ``}`;
        return ``;
    };

    handlePlanSelected(data: { item: LessonPlan }): void {
        this.onChange.emit(data.item);
    }

    search = (text$: Observable<string>): Observable<LessonPlan[]> =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term =>
                term === ''
                    ? []
                    : this.lessonPlans
                          .filter(plan => {
                              return (
                                  plan.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  (plan.creator?.username.toLowerCase().indexOf(term.toLowerCase()) ?? -1) > -1
                              );
                          })
                          .slice(0, 10)
            )
        );
}
