import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, LearningGoal } from '@dynrec/common';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { LearningGoalService } from '../../../../services/learningGoal.service';

@Component({
    selector: 'app-learning-goal-search-formfield',
    templateUrl: './learning-goal-search-formfield.component.html',
    styleUrls: ['./learning-goal-search-formfield.component.scss'],
})
export class LearningGoalSearchFormfieldComponent implements OnInit {
    @Input() goals?: LearningGoal[] = [];
    @Input() course: Course;
    @Input() name?: string;

    @Output() onChange: EventEmitter<LearningGoal[]> = new EventEmitter<LearningGoal[]>();

    currentlySelectedGoal?: LearningGoal = undefined;

    allCourseGoals: LearningGoal[] = [];

    constructor(private learningGoalService: LearningGoalService) {}

    ngOnInit() {
        if (!this.goals) {
            this.goals = [];
        }

        this.loadGoals();
    }

    async loadGoals() {
        const categories = (await this.learningGoalService.getCourseLearningGoalCategories(this.course)).data;
        this.allCourseGoals = _.flatten(categories.map(cat => cat.goals));
    }

    formatter = (goal: LearningGoal): string => {
        if (goal) return `${goal.number}: ${goal.name}`;
        return ``;
    };

    handleGoalSelected(data: { item: LearningGoal }): void {
        const foundMatch = this.goals?.find(goal => goal.id === data.item.id);

        if (!foundMatch) {
            this.goals = [...(this.goals ?? []), data.item];
            this.onChange.emit(this.goals);
            this.currentlySelectedGoal = undefined;
        }
    }

    handleGoalDeleted(item: LearningGoal) {
        this.goals = this.goals?.filter(goal => goal.id !== item.id);
        this.onChange.emit(this.goals ?? []);
    }

    search = (text$: Observable<string>): Observable<LearningGoal[]> =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term =>
                term === ''
                    ? []
                    : this.allCourseGoals
                          .filter(goal => {
                              return (
                                  goal.number.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  goal.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  goal.description.toLowerCase().indexOf(term.toLowerCase()) > -1
                              );
                          })
                          .slice(0, 10)
            )
        );
}
