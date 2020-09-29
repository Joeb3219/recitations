import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Problem } from '@models/problem';
import { ProblemService } from '@services/problem.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-problem-delete',
    templateUrl: './problem-delete.component.html',
    styleUrls: ['./problem-delete.component.scss'],
})
export class ProblemDeleteComponent {
    @Input() isVisible: boolean;

    @Input() problem: Problem;

    @Output() onClose: EventEmitter<boolean> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    constructor(
        private problemService: ProblemService,
        private toastr: ToastrService
    ) {}

    handleClose(): void {
        this.onClose.emit(false);
    }

    async handleModalSubmit(): Promise<void> {
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            await this.problemService.deleteProblem(this.problem.id);
            this.toastr.success('Successfully deleted problem');
            this.onClose.emit(true);
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to delete problem');
        }
    }
}
