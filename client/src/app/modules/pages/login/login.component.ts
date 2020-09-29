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
    }

    successfulLogout(): void {
        localStorage.removeItem('jwt');
        this.userService.signOut();
    }

    successfulLogin(jwt: string): void {
        localStorage.setItem('jwt', jwt);
        this.userService.flushCurrentUser();
        this.router.navigate(['/']);
    }
}
