import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, User } from '@dynrec/common';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
    @Input() isVisible: boolean;

    @Output() onClose: EventEmitter<User | undefined> = new EventEmitter<User | undefined>();

    user?: User;

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(private userService: UserService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.user = new User();
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form<User>();

        if (!this.user) {
            return;
        }

        this.form.inputs = [
            {
                type: 'text',
                name: 'firstName',
                value: this.user.firstName,
                label: 'First Name',
                row: 0,
                col: 0,
            },
            {
                type: 'text',
                name: 'lastName',
                value: this.user.lastName,
                label: 'Last Name',
                row: 0,
                col: 1,
            },
            {
                type: 'text',
                name: 'username',
                value: this.user.username,
                label: 'Username',
                row: 1,
                col: 0,
            },
            {
                type: 'text',
                name: 'email',
                value: this.user.email,
                label: 'Email',
                row: 1,
                col: 1,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(user: User): Promise<void> {
        try {
            const result = await this.userService.createUser(user);

            this.user = result.data;

            this.toastr.success('Successfully created user');
            this.onClose.emit(this.user);
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to create user');
        }
    }
}
