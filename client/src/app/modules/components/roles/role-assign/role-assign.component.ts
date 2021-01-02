import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, Role, User } from '@dynrec/common';
import { RoleService } from '@services/role.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

type FormData = { users?: User[] };

@Component({
    selector: 'app-role-assign',
    templateUrl: './role-assign.component.html',
    styleUrls: ['./role-assign.component.scss'],
})
export class RoleAssignComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() role?: Role;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    assignments?: User[];

    forceClose: Subject<void> = new Subject<void>();

    form: Form<FormData>;

    constructor(private roleService: RoleService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.loadAssignments();
    }

    ngOnChanges(): void {
        this.loadAssignments();
    }

    async loadAssignments() {
        if (!this.role) {
            return;
        }

        const result = await this.roleService.getRoleAssignments(this.role);
        this.assignments = result.data;

        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form<FormData>();

        if (!this.role) {
            return;
        }

        this.form.inputs = [
            {
                type: 'textBlock',
                value: `Users assigned to the role ${this.role.name}`,
                label: undefined,
                row: 0,
                col: 0,
            },
            {
                type: 'user',
                multi: true,
                name: 'users',
                value: this.assignments ?? [],
                label: 'Users',
                row: 1,
                col: 0,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(formData: FormData): Promise<void> {
        if (!formData.users || !this.role || !this.role.id) {
            return;
        }

        try {
            // send state to the db, and obtain back the ground truth that the db produces
            await this.roleService.updateRoleAssignments(this.role, formData.users);

            this.toastr.success('Successfully edited role assignments');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to edit role assignments');
        }
    }
}
