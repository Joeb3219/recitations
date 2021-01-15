import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    authMechanism = '';

    constructor(
        private router: Router,
        private userService: UserService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    ngOnInit(): void {
        this.authMechanism = environment.authMechanism;

        // First, we check if the user already has a jwt
        // If so, we will log them out :)
        if (localStorage.getItem('jwt')) {
            this.successfulLogout();
        }

        if (this.authMechanism === 'cas') {
            this.casLogin();
        }
    }

    casLogin() {
        this.userService.casLogin().subscribe({
            next: data => {
                if (data.data) {
                    this.document.location.href = data.data;
                }
            },
        });
    }

    successfulLogout(): void {
        // if (this.authMechanism === 'cas') {
        //     this.userService.casLogout().subscribe({
        //         next: () => {
        //             this.userService.signOut();
        //         },
        //     });
        // } else {
        //     this.
        // }
        this.userService.signOut();
    }

    successfulLogin(): void {
        this.userService.flushCurrentUser();
        this.router.navigate(['/']);
    }
}
