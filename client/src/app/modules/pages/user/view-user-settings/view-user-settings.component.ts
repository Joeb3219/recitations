import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Form, FormFieldUpdated, User } from '@dynrec/common';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-view-user-settings',
    templateUrl: './view-user-settings.component.html',
    styleUrls: ['./view-user-settings.component.scss'],
})
export class ViewUserSettingsComponent implements OnInit {
    form: Form<User>;
    user?: User;

    selectedImpersonationUser?: User;

    constructor(
        private readonly toastr: ToastrService,
        private readonly userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.user = _.cloneDeep(user);
            this.generateForm();
        });
    }

    async handleImpersonateUser() {
        if (!this.selectedImpersonationUser) {
            return;
        }

        this.userService.impersonateUser(this.selectedImpersonationUser.username).subscribe(result => {
            if (result.data) {
                localStorage.setItem('jwt', result.data);
                this.userService.flushCurrentUser();
                this.router.navigate(['/settings']);
                this.toastr.success('Successfully impersonated user');
            } else {
                this.toastr.error('Failed to impersonate user');
            }
        });
    }

    async handleSubmitSettings() {
        if (!this.user) {
            return;
        }
        try {
            await this.userService.updateUser(this.user);
            this.userService.flushCurrentUser();
            this.toastr.success('Successfully updated user settings');
        } catch (err) {
            this.toastr.error('Failed to update user settings');
        }
    }

    generateForm() {
        this.form = new Form<User>();
        this.form.inputGroups = [{ name: 'personal', label: 'Personal Information', page: 0 }];
        this.form.inputs = [
            {
                name: 'firstName',
                label: 'First Name',
                type: 'text',
                group: 'personal',
                row: 0,
                col: 0,
                value: this.user?.firstName,
            },
            {
                name: 'lastName',
                label: 'Last Name',
                type: 'text',
                group: 'personal',
                row: 0,
                col: 1,
                value: this.user?.lastName,
            },
            {
                name: 'email',
                label: 'Email Address',
                type: 'text',
                group: 'personal',
                row: 1,
                col: 0,
                value: this.user?.email,
            },
        ];
    }

    handleFieldUpdated({ name, value }: FormFieldUpdated<User>): void {
        Object.assign(this.user, { [name]: value });
    }
}
