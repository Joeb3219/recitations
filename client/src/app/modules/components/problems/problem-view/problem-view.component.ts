import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Problem, ProblemDifficulty } from '@dynrec/common';

@Component({
    selector: 'app-problem-view',
    templateUrl: './problem-view.component.html',
    styleUrls: ['./problem-view.component.scss'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ height: 0, opacity: 0 }),
                animate('.08s ease-out', style({ height: 300, opacity: 1 })),
            ]),
            transition(':leave', [
                style({ height: 300, opacity: 1 }),
                animate('.08s ease-in', style({ height: 0, opacity: 0 })),
            ]),
        ]),
    ],
})
export class ProblemViewComponent implements OnInit {
    isEditProblemModalOpen = false;

    @Input() problem: Problem;
    @Input() showLearningGoals: boolean = true;
    @Input() allowShowEdit: boolean = true;
    @Input() allowShowSolution: boolean = false;

    userFullName?: string;

    showSolution = false;

    solutionButtonText = 'Show Solution';

    ngOnInit(): void {
        this.userFullName = this.problem.creator?.getFullName();
    }

    get problemDifficulty() {
        return ProblemDifficulty;
    }

    handleSolutionButton(): void {
        this.showSolution = !this.showSolution;
        this.solutionButtonText = this.showSolution ? 'Hide Solution' : 'Show Solution';
    }

    handleOpenEditProblemModal(): void {
        this.isEditProblemModalOpen = true;
    }

    handleCloseEditProblemModal(): void {
        this.isEditProblemModalOpen = false;
    }

    getMinuteUnit(estimatedDuration: number): string {
        return Problem.getMinuteUnit(estimatedDuration);
    }
}
