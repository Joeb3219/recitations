import { Component, OnInit } from '@angular/core';
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

    constructor(private router: Router, private userService: UserService) {}

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
                console.log(data);
            },
        });
    }

    successfulLogout(): void {
        if (this.authMechanism === 'cas') {
            this.userService.casLogout().subscribe({
                next: () => {
                    this.userService.signOut();
                },
            });
        }
    }

    successfulLogin(): void {
        this.userService.flushCurrentUser();
        this.router.navigate(['/']);
    }
}
