import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    constructor(private readonly userService: UserService, private readonly router: Router) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe({
            next: user => {
                if (!user) {
                    return;
                }

                // Check if the user has the correct information set.
                if (!user.firstName || !user.lastName || !user.email) {
                    this.router.navigate(['/settings']);
                }
            },
        });
    }
}
