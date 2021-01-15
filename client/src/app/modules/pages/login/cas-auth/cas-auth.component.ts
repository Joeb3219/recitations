import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-cas-auth',
    templateUrl: './cas-auth.component.html',
    styleUrls: ['./cas-auth.component.scss'],
})
export class CasAuthComponent implements OnInit {
    constructor(
        private readonly userService: UserService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params.ticket;

            if (!token) {
                this.toastr.error('Invalid login token');
            } else {
                this.processLoginToken(token);
            }
        });
    }

    processLoginToken(token: string) {
        this.userService.casAuthentication(token).subscribe({
            next: jwt => {
                localStorage.setItem('jwt', jwt.data);
                this.userService.flushCurrentUser();
                this.toastr.success('Successfully logged in via CAS.');
                this.router.navigate(['/']);
            },
            error: () => {
                this.toastr.error('Failed to authorize login.');
                this.router.navigate(['/']);
            },
        });
    }
}
