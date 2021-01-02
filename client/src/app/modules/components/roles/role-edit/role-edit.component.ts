import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, Role } from '@dynrec/common';
import { RoleService } from '@services/role.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrls: ['./role-edit.component.scss'],
})
export class RoleEditComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() role?: Role;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(private roleService: RoleService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    ngOnChanges(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();

        if (!this.role?.course) {
            return;
        }

        this.form.inputs = [
            {
                type: 'text',
                name: 'name',
                value: this.role.name,
                label: 'Name',
                row: 0,
                col: 0,
            },
            {
                type: 'abilities',
                name: 'abilities',
                abilities: this.role.abilities ?? [],
                label: 'Abilities',
                row: 1,
                col: 0,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(role: Role): Promise<void> {
        // We apply any fields from the object, and then any from the overwritten data
        // This allows us to submit a new object with the changes between this.role and role, without
        // having to commit them to the real copy before we've sent to the database
        const updatedRole = Object.assign({}, this.role, role);
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await this.roleService.upsertRole(updatedRole);

            // and now we store the ground truth back in our real object
            Object.assign(this.role, result);

            this.toastr.success('Successfully edited role');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to edit role');
        }
    }
}
