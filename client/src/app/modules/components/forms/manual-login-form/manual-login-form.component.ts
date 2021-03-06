import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form } from '@dynrec/common';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-manual-login-form',
    templateUrl: './manual-login-form.component.html',
    styleUrls: ['./manual-login-form.component.scss'],
})
export class ManualLoginFormComponent implements OnInit {
    form?: Form<{ username: string; password: string }> = undefined;

    @Output() onSuccessfulLogin: EventEmitter<string> = new EventEmitter<string>();

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();
        this.form.inputs = [
            {
                type: 'text',
                name: 'username',
                label: 'Username',
            },
            {
                type: 'password',
                name: 'password',
                label: 'Password',
            },
        ];
    }

    formSubmitted(data: { username: string; password: string }): void {
        const { username, password } = data;
        this.userService.signin(username, password).subscribe(result => {
            if (result?.data) {
                localStorage.setItem('jwt', result.data);
                this.onSuccessfulLogin.emit(result.data);
            }
        });
    }
}
