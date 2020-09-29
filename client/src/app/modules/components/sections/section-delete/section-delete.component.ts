import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section } from '@models/section';
import { User } from '@models/user';
import { SectionService } from '@services/section.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-section-delete',
    templateUrl: './section-delete.component.html',
    styleUrls: ['./section-delete.component.scss'],
})
export class SectionDeleteComponent {
    @Input() isVisible: boolean;

    @Input() section: Section;

    @Output() onClose: EventEmitter<boolean> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    constructor(
        private sectionService: SectionService,
        private toastr: ToastrService
    ) {}

    handleClose(): void {
        this.onClose.emit(false);
    }

    async handleModalSubmit(): Promise<void> {
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            await this.sectionService.deleteSection(this.section.id);
            this.toastr.success('Successfully deleted section');
            this.onClose.emit(true);
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to delete section');
        }
    }

    getUserFullName(user: User): string {
        return User.getFullName(user);
    }
}
